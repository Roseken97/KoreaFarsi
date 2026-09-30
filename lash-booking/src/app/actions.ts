"use server";

import { availableDays, createPendingBooking, getBookingByCode, getService, markFailed, setAuthority, slotsFor } from "@/lib/store";
import { startPayment } from "@/lib/payment";
import { normalizePhone } from "@/lib/phone";
import { enDigits, isIsoDate, jalaliParts } from "@/lib/time";

export type DayOption = { date: string; day: string; month: string; weekday: string; count: number };

export async function getDays(serviceId: number): Promise<DayOption[]> {
  const service = getService(Number(serviceId));
  if (!service?.active) return [];
  return availableDays(service.duration_min).map((d) => ({ ...d, ...jalaliParts(d.date) }));
}

export async function getSlots(serviceId: number, date: string): Promise<number[]> {
  const service = getService(Number(serviceId));
  if (!service?.active || !isIsoDate(date)) return [];
  return slotsFor(date, service.duration_min);
}

export type BookResult = { ok: true; url: string } | { ok: false; field?: "name" | "phone"; message: string; slotGone?: boolean };

export async function book(input: {
  serviceId: number;
  date: string;
  start: number;
  name: string;
  phone: string;
  note: string;
}): Promise<BookResult> {
  const name = String(input.name ?? "").trim().slice(0, 80);
  const phone = normalizePhone(String(input.phone ?? ""));
  const note = String(input.note ?? "").trim().slice(0, 500);
  if (name.length < 2) return { ok: false, field: "name", message: "لطفاً نام خود را وارد کنید." };
  if (!phone) return { ok: false, field: "phone", message: "شماره موبایل معتبر نیست (مثلاً ۰۹۱۲۱۲۳۴۵۶۷)." };
  if (!isIsoDate(input.date) || !Number.isInteger(input.start)) {
    return { ok: false, message: "زمان انتخاب‌شده معتبر نیست.", slotGone: true };
  }

  const created = createPendingBooking({ serviceId: Number(input.serviceId), date: input.date, start: input.start, name, phone, note });
  if (!created.ok) {
    return created.error === "slot_taken"
      ? { ok: false, message: "متأسفانه این ساعت همین حالا رزرو شد. لطفاً ساعت دیگری انتخاب کنید.", slotGone: true }
      : { ok: false, message: "این خدمت در حال حاضر قابل رزرو نیست." };
  }

  const b = created.booking;
  const pay = await startPayment({
    code: b.code,
    amount: b.amount,
    description: `رزرو ${b.service_name} - کد ${b.code}`,
    mobile: phone,
  });
  if (!pay.ok) {
    markFailed(b.code); // release the slot right away
    return { ok: false, message: pay.message };
  }
  setAuthority(b.code, pay.authority);
  return { ok: true, url: pay.url };
}

/**
 * Lookup needs both the tracking code and the phone number, so knowing someone's
 * number alone never reveals their appointments.
 */
export async function track(rawCode: string, rawPhone: string): Promise<{ ok: true; code: string } | { ok: false; message: string }> {
  const code = enDigits(String(rawCode ?? "")).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const phone = normalizePhone(String(rawPhone ?? ""));
  const b = code && phone ? getBookingByCode(code) : undefined;
  if (!b || b.phone !== phone) return { ok: false, message: "نوبتی با این کد و شماره پیدا نشد." };
  return { ok: true, code: b.code };
}
