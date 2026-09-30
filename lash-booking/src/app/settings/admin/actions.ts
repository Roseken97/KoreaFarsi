"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { onCancelled, onConfirmed, sendTest } from "@/lib/notify";
import {
  checkPassword,
  clearLoginFailures,
  endSession,
  isAdmin,
  loginLocked,
  recordLoginFailure,
  startSession,
} from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";
import {
  addClosedDay,
  createPendingBooking,
  deleteService,
  getService,
  getSettings,
  removeClosedDay,
  saveSettings,
  setBookingStatus,
  slotsFor,
  upsertService,
  type BookingStatus,
  type Settings,
} from "@/lib/store";
import { enDigits, hhmmToMin, isIsoDate } from "@/lib/time";

// Every mutation re-checks the session: server actions are public HTTP endpoints.
async function guard() {
  if (!(await isAdmin())) redirect("/settings/admin/login");
}

const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const int = (f: FormData, k: string, min: number, max: number, fallback: number) => {
  const n = Number(enDigits(String(f.get(k) ?? "")).replace(/[^\d]/g, ""));
  return Number.isFinite(n) && String(f.get(k) ?? "").trim() !== "" ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};

// ─── Session ─────────────────────────────────────────────────────────────

export type LoginState = { error?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const h = await headers();
  const key = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (loginLocked(key)) return { error: "تلاش‌های ناموفق زیاد بود. ۱۰ دقیقه‌ی دیگر امتحان کنید." };
  if (!checkPassword(String(form.get("password") ?? ""))) {
    recordLoginFailure(key);
    return { error: "رمز عبور درست نیست." };
  }
  clearLoginFailures(key);
  await startSession();
  redirect("/settings/admin");
}

export async function logout() {
  await endSession();
  redirect("/settings");
}

// ─── Bookings ────────────────────────────────────────────────────────────

const ADMIN_STATUSES: BookingStatus[] = ["confirmed", "completed", "cancelled"];

export async function changeStatus(form: FormData) {
  await guard();
  const id = Number(form.get("id"));
  const status = String(form.get("status")) as BookingStatus;
  if (!Number.isInteger(id) || !ADMIN_STATUSES.includes(status)) return;
  const before = setBookingStatus(id, status);
  if (status === "cancelled" && before?.status === "confirmed") after(() => onCancelled(before));
  revalidatePath("/settings/admin");
}

/** Free start times for the manual-booking form (ignores the customer notice period). */
export async function adminSlots(serviceId: number, date: string): Promise<number[]> {
  await guard();
  const svc = getService(Number(serviceId));
  if (!svc || !isIsoDate(date)) return [];
  return slotsFor(date, svc.duration_min, getSettings(), { admin: true });
}

export type ManualState = { ok?: boolean; error?: string };

export async function addManualBooking(_: ManualState, form: FormData): Promise<ManualState> {
  await guard();
  const serviceId = Number(form.get("serviceId"));
  const date = str(form, "date", 10);
  const start = hhmmToMin(str(form, "start", 5));
  const name = str(form, "name", 80);
  const phone = normalizePhone(str(form, "phone", 20));
  if (!serviceId || !isIsoDate(date) || start === null) return { error: "خدمت، روز و ساعت را انتخاب کنید." };
  if (name.length < 2) return { error: "نام مشتری را وارد کنید." };
  if (!phone) return { error: "شماره موبایل معتبر نیست." };
  const r = createPendingBooking({ serviceId, date, start, name, phone, note: str(form, "note"), manual: true });
  if (!r.ok) return { error: r.error === "slot_taken" ? "این ساعت آزاد نیست." : "خدمت نامعتبر است." };
  const booking = r.booking;
  after(() => onConfirmed(booking, { online: false }));
  revalidatePath("/settings/admin");
  return { ok: true };
}

// ─── Services ────────────────────────────────────────────────────────────

export async function saveService(form: FormData) {
  await guard();
  const id = Number(form.get("id")) || undefined;
  const name = str(form, "name", 80);
  if (!name) return;
  upsertService({
    id,
    name,
    description: str(form, "description", 300),
    duration_min: int(form, "duration", 10, 600, 60),
    price: int(form, "price", 0, 1_000_000_000, 0),
    active: form.get("active") === "on" ? 1 : 0,
    sort: int(form, "sort", 0, 999, 0),
  });
  revalidatePath("/settings/admin/services");
  revalidatePath("/");
}

export async function removeService(form: FormData) {
  await guard();
  const id = Number(form.get("id"));
  if (Number.isInteger(id)) deleteService(id);
  revalidatePath("/settings/admin/services");
  revalidatePath("/");
}

// ─── Schedule ────────────────────────────────────────────────────────────

export type SaveState = { ok?: boolean; error?: string; at?: number };

export async function saveSchedule(_: SaveState, form: FormData): Promise<SaveState> {
  await guard();
  const s = getSettings();
  const week = s.week.map((d, i) => {
    const open = str(form, `open${i}`, 5) || d.open;
    const close = str(form, `close${i}`, 5) || d.close;
    return { enabled: form.get(`on${i}`) === "on", open, close };
  });
  for (const [i, d] of week.entries()) {
    const o = hhmmToMin(d.open);
    const c = hhmmToMin(d.close);
    if (d.enabled && (o === null || c === null || c <= o)) {
      return { error: `ساعت‌های روز ${["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"][i]} درست نیست.` };
    }
  }
  const next: Settings = {
    ...s,
    week,
    slotStep: [15, 20, 30, 45, 60].find((x) => x === int(form, "slotStep", 5, 120, 30)) ?? 30,
    bufferMin: int(form, "bufferMin", 0, 120, s.bufferMin),
    horizonDays: int(form, "horizonDays", 1, 90, s.horizonDays),
    minNoticeMin: int(form, "minNoticeHours", 0, 72, s.minNoticeMin / 60) * 60,
  };
  saveSettings(next);
  revalidatePath("/settings/admin/schedule");
  return { ok: true, at: Date.now() };
}

export async function toggleClosedDay(form: FormData) {
  await guard();
  const date = str(form, "date", 10);
  if (!isIsoDate(date)) return;
  if (form.get("closed") === "1") removeClosedDay(date);
  else addClosedDay(date, str(form, "reason", 100));
  revalidatePath("/settings/admin/schedule");
}

// ─── General ─────────────────────────────────────────────────────────────

export async function saveGeneral(_: SaveState, form: FormData): Promise<SaveState> {
  await guard();
  const s = getSettings();
  const businessName = str(form, "businessName", 80);
  if (!businessName) return { error: "نام سالن را وارد کنید." };
  saveSettings({
    ...s,
    businessName,
    tagline: str(form, "tagline", 160),
    artistName: str(form, "artistName", 80),
    phone: enDigits(str(form, "phone", 30)),
    address: str(form, "address", 300),
    instagram: str(form, "instagram", 60),
    depositPercent: int(form, "depositPercent", 10, 100, s.depositPercent),
    holdMinutes: int(form, "holdMinutes", 5, 60, s.holdMinutes),
    policy: str(form, "policy", 2000),
  });
  revalidatePath("/", "layout");
  return { ok: true, at: Date.now() };
}

// ─── SMS ─────────────────────────────────────────────────────────────────

export async function saveSms(_: SaveState, form: FormData): Promise<SaveState> {
  await guard();
  const s = getSettings();
  const on = (k: string) => form.get(k) === "on";
  const ownerRaw = str(form, "ownerMobile", 20);
  const ownerMobile = ownerRaw ? normalizePhone(ownerRaw) : "";
  if (ownerMobile === null) return { error: "شماره موبایل مدیر معتبر نیست." };
  if (on("owner") && !ownerMobile) return { error: "برای اطلاع‌رسانی به مدیر، شماره موبایل مدیر را وارد کنید." };
  const tpl = (k: keyof Settings["sms"]["templates"]) => str(form, `tpl_${k}`, 600) || s.sms.templates[k];
  saveSettings({
    ...s,
    sms: {
      confirm: on("confirm"),
      reminder: on("reminder"),
      reminderHours: int(form, "reminderHours", 1, 72, s.sms.reminderHours),
      cancel: on("cancel"),
      owner: on("owner"),
      ownerMobile,
      templates: { confirm: tpl("confirm"), reminder: tpl("reminder"), cancel: tpl("cancel"), owner: tpl("owner") },
    },
  });
  revalidatePath("/settings/admin/sms");
  return { ok: true, at: Date.now() };
}

export async function smsTest(_: SaveState, form: FormData): Promise<SaveState> {
  await guard();
  const to = normalizePhone(str(form, "to", 20));
  if (!to) return { error: "شماره موبایل معتبر نیست." };
  const r = await sendTest(to);
  revalidatePath("/settings/admin/sms");
  return r.ok ? { ok: true, at: Date.now() } : { error: r.error };
}
