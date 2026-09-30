import "server-only";
import { randomBytes } from "node:crypto";
import { db, tx } from "./db";
import { addDays, depositAmount, tehranNow, weekdayIndex, hhmmToMin } from "./time";

// ─── Types ────────────────────────────────────────────────────────────────

export type DayHours = { enabled: boolean; open: string; close: string };

export type Settings = {
  businessName: string;
  tagline: string;
  artistName: string;
  phone: string;
  address: string;
  instagram: string;
  /** Percentage of the service price paid online to lock the slot (100 = full). */
  depositPercent: number;
  /** Start times are offered every N minutes. */
  slotStep: number;
  /** How many days ahead customers can book. */
  horizonDays: number;
  /** Earliest bookable time, in minutes from now. */
  minNoticeMin: number;
  /** A pending (unpaid) booking holds its slot for this many minutes. */
  holdMinutes: number;
  /** Buffer after each appointment (cleanup/prep). */
  bufferMin: number;
  /** Index 0 = Saturday … 6 = Friday. */
  week: DayHours[];
  policy: string;
  sms: SmsSettings;
};

export type SmsSettings = {
  /** Confirmation right after payment / manual booking. */
  confirm: boolean;
  /** Reminder `reminderHours` before the appointment. */
  reminder: boolean;
  reminderHours: number;
  /** Tell the customer when the salon cancels their booking. */
  cancel: boolean;
  /** Notify the owner of every new online booking. */
  owner: boolean;
  ownerMobile: string;
  templates: { confirm: string; reminder: string; cancel: string; owner: string };
};

export const DEFAULT_SMS: SmsSettings = {
  confirm: true,
  reminder: true,
  reminderHours: 24,
  cancel: true,
  owner: false,
  ownerMobile: "",
  templates: {
    confirm: "{name} عزیز، نوبت {service} شما برای {date} ساعت {time} قطعی شد.\nکد پیگیری: {code}\n{salon}",
    reminder: "{name} عزیز، یادآوری نوبت {service}: {date} ساعت {time}.\nلطفاً بدون آرایش چشم تشریف بیاورید.\n{salon}",
    cancel: "{name} عزیز، نوبت {service} شما در {date} ساعت {time} لغو شد. برای هماهنگی با ما تماس بگیرید.\n{salon}",
    owner: "نوبت جدید: {name} ({phone})\n{service} - {date} ساعت {time}",
  },
};

export const DEFAULT_SETTINGS: Settings = {
  businessName: "استودیو مژه",
  tagline: "کاشت و لیفت مژه، با دقت و آرامش",
  artistName: "",
  phone: "",
  address: "",
  instagram: "",
  depositPercent: 30,
  slotStep: 30,
  horizonDays: 21,
  minNoticeMin: 120,
  holdMinutes: 15,
  bufferMin: 15,
  week: [
    { enabled: true, open: "10:00", close: "19:00" },
    { enabled: true, open: "10:00", close: "19:00" },
    { enabled: true, open: "10:00", close: "19:00" },
    { enabled: true, open: "10:00", close: "19:00" },
    { enabled: true, open: "10:00", close: "19:00" },
    { enabled: true, open: "10:00", close: "15:00" },
    { enabled: false, open: "10:00", close: "15:00" },
  ],
  policy:
    "بیعانه برای قطعی شدن نوبت است و مابقی مبلغ در سالن پرداخت می‌شود. لغو تا ۲۴ ساعت قبل از نوبت، با هماهنگی تلفنی ممکن است. لطفاً بدون آرایش چشم و ۵ دقیقه زودتر تشریف بیاورید.",
  sms: DEFAULT_SMS,
};

export type Service = {
  id: number;
  name: string;
  description: string;
  duration_min: number;
  price: number;
  active: number;
  sort: number;
};

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "expired" | "needs_refund";

export type Booking = {
  id: number;
  code: string;
  service_id: number | null;
  service_name: string;
  date: string;
  start_min: number;
  end_min: number;
  customer_name: string;
  phone: string;
  note: string;
  price: number;
  amount: number;
  status: BookingStatus;
  authority: string | null;
  ref_id: string | null;
  expires_at: number | null;
  paid_at: string | null;
  reminder_sent_at: string | null;
  created_at: string;
};

// ─── Settings ─────────────────────────────────────────────────────────────

export function getSettings(): Settings {
  const row = db().prepare("SELECT value FROM settings WHERE key = 'main'").get() as { value: string } | undefined;
  if (!row) return DEFAULT_SETTINGS;
  try {
    const saved = JSON.parse(row.value) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
      week: saved.week?.length === 7 ? saved.week : DEFAULT_SETTINGS.week,
      sms: { ...DEFAULT_SMS, ...saved.sms, templates: { ...DEFAULT_SMS.templates, ...saved.sms?.templates } },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings) {
  db()
    .prepare("INSERT INTO settings (key, value) VALUES ('main', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .run(JSON.stringify(s));
}

// ─── Services ─────────────────────────────────────────────────────────────

export function listServices(opts: { activeOnly?: boolean } = {}): Service[] {
  const where = opts.activeOnly ? "WHERE active = 1" : "";
  return db().prepare(`SELECT * FROM services ${where} ORDER BY sort, id`).all() as unknown as Service[];
}

export function getService(id: number): Service | undefined {
  return db().prepare("SELECT * FROM services WHERE id = ?").get(id) as unknown as Service | undefined;
}

export function upsertService(s: Omit<Service, "id"> & { id?: number }) {
  if (s.id) {
    db()
      .prepare("UPDATE services SET name=?, description=?, duration_min=?, price=?, active=?, sort=? WHERE id=?")
      .run(s.name, s.description, s.duration_min, s.price, s.active, s.sort, s.id);
  } else {
    db()
      .prepare("INSERT INTO services (name, description, duration_min, price, active, sort) VALUES (?,?,?,?,?,?)")
      .run(s.name, s.description, s.duration_min, s.price, s.active, s.sort);
  }
}

export function deleteService(id: number) {
  db().prepare("DELETE FROM services WHERE id = ?").run(id);
}

// ─── Closed days ──────────────────────────────────────────────────────────

export function listClosedDays(fromIso?: string): { date: string; reason: string }[] {
  const from = fromIso ?? tehranNow().date;
  return db().prepare("SELECT date, reason FROM closed_days WHERE date >= ? ORDER BY date").all(from) as {
    date: string;
    reason: string;
  }[];
}

export function addClosedDay(date: string, reason: string) {
  db()
    .prepare("INSERT INTO closed_days (date, reason) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET reason = excluded.reason")
    .run(date, reason);
}

export function removeClosedDay(date: string) {
  db().prepare("DELETE FROM closed_days WHERE date = ?").run(date);
}

// ─── Availability ─────────────────────────────────────────────────────────

/** Bookings that currently occupy time: confirmed ones, and pending ones whose hold hasn't expired. */
const BLOCKING = `(status IN ('confirmed','completed') OR (status = 'pending' AND expires_at > ?))`;

function busyRanges(date: string, now = Date.now()): { start: number; end: number }[] {
  return db()
    .prepare(`SELECT start_min AS start, end_min AS end FROM bookings WHERE date = ? AND ${BLOCKING}`)
    .all(date, now) as { start: number; end: number }[];
}

/** Every start time (minutes) on `date` where a service of `duration` fits. */
export function slotsFor(date: string, duration: number, s = getSettings(), opts: { admin?: boolean } = {}): number[] {
  const today = tehranNow();
  if (date < today.date || date > addDays(today.date, s.horizonDays)) return [];
  const closed = db().prepare("SELECT 1 FROM closed_days WHERE date = ?").get(date);
  if (closed) return [];

  const day = s.week[weekdayIndex(date)];
  const open = hhmmToMin(day.open);
  const close = hhmmToMin(day.close);
  if (!day.enabled || open === null || close === null || close <= open) return [];

  // The owner may squeeze in a same-day booking; customers need the notice period.
  const earliest = date === today.date ? today.minutes + (opts.admin ? 0 : s.minNoticeMin) : 0;
  const busy = busyRanges(date);
  const out: number[] = [];
  for (let t = open; t + duration <= close; t += s.slotStep) {
    if (t < earliest) continue;
    // The buffer follows every appointment: both the new one and existing ones.
    const end = t + duration + s.bufferMin;
    if (busy.some((b) => t < b.end + s.bufferMin && end > b.start)) continue;
    out.push(t);
  }
  return out;
}

export function availableDays(duration: number): { date: string; count: number }[] {
  const s = getSettings();
  const today = tehranNow().date;
  const days: { date: string; count: number }[] = [];
  for (let i = 0; i <= s.horizonDays; i++) {
    const date = addDays(today, i);
    days.push({ date, count: slotsFor(date, duration, s).length });
  }
  return days;
}

// ─── Bookings ─────────────────────────────────────────────────────────────

function newCode(): string {
  // No ambiguous characters (0/O, 1/I) so it can be read over the phone.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export type CreateResult = { ok: true; booking: Booking } | { ok: false; error: "slot_taken" | "service" };

/** Atomically re-checks the slot and inserts a pending booking that holds it. */
export function createPendingBooking(input: {
  serviceId: number;
  date: string;
  start: number;
  name: string;
  phone: string;
  note: string;
  /** Admin-entered booking (phone/Instagram): confirmed immediately, nothing paid online. */
  manual?: boolean;
}): CreateResult {
  return tx((d) => {
    const service = getService(input.serviceId);
    if (!service || !service.active) return { ok: false, error: "service" } as const;
    const s = getSettings();
    if (!slotsFor(input.date, service.duration_min, s, { admin: input.manual }).includes(input.start)) {
      return { ok: false, error: "slot_taken" } as const;
    }
    const amount = input.manual ? 0 : depositAmount(service.price, s.depositPercent);
    const code = newCode();
    d.prepare(
      `INSERT INTO bookings (code, service_id, service_name, date, start_min, end_min, customer_name, phone, note, price, amount, status, expires_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).run(
      code,
      service.id,
      service.name,
      input.date,
      input.start,
      input.start + service.duration_min,
      input.name,
      input.phone,
      input.note,
      service.price,
      amount,
      input.manual ? "confirmed" : "pending",
      input.manual ? null : Date.now() + s.holdMinutes * 60_000,
    );
    return { ok: true, booking: getBookingByCode(code)! } as const;
  });
}

export function getBookingByCode(code: string): Booking | undefined {
  return db().prepare("SELECT * FROM bookings WHERE code = ?").get(code) as unknown as Booking | undefined;
}

export function getBookingByAuthority(authority: string): Booking | undefined {
  return db().prepare("SELECT * FROM bookings WHERE authority = ?").get(authority) as unknown as Booking | undefined;
}

export function setAuthority(code: string, authority: string) {
  db().prepare("UPDATE bookings SET authority = ? WHERE code = ?").run(authority, code);
}

/**
 * Called after the gateway confirms payment. If the hold expired and someone else took
 * the slot meanwhile, the booking is flagged for a refund instead of double-booking.
 */
export function markPaid(code: string, refId: string): Booking | undefined {
  return tx((d) => {
    const b = getBookingByCode(code);
    if (!b) return undefined;
    if (b.status !== "pending" && b.status !== "expired") return b; // already handled (idempotent)
    const clash = d
      .prepare(
        `SELECT 1 FROM bookings WHERE date = ? AND id != ? AND ${BLOCKING} AND start_min < ? AND end_min + ? > ?`,
      )
      .get(b.date, b.id, Date.now(), b.end_min + getSettings().bufferMin, getSettings().bufferMin, b.start_min);
    const status: BookingStatus = clash ? "needs_refund" : "confirmed";
    d.prepare("UPDATE bookings SET status = ?, ref_id = ?, paid_at = datetime('now'), expires_at = NULL WHERE id = ?").run(
      status,
      refId,
      b.id,
    );
    return getBookingByCode(code);
  });
}

export function markFailed(code: string) {
  db().prepare("UPDATE bookings SET status = 'expired', expires_at = NULL WHERE code = ? AND status = 'pending'").run(code);
}

/** Returns the booking as it was before the change (callers use it to decide on notifications). */
export function setBookingStatus(id: number, status: BookingStatus): Booking | undefined {
  const before = db().prepare("SELECT * FROM bookings WHERE id = ?").get(id) as unknown as Booking | undefined;
  db().prepare("UPDATE bookings SET status = ?, expires_at = NULL WHERE id = ?").run(status, id);
  return before;
}

// ─── SMS bookkeeping ──────────────────────────────────────────────────────

/**
 * Confirmed bookings whose reminder time has come and that haven't been reminded.
 * Tehran date/minute arithmetic stays in SQL-free JS: we pull the next 3 days and filter.
 */
export function bookingsDueForReminder(hoursBefore: number, now = tehranNow()): Booking[] {
  const rows = db()
    .prepare(
      "SELECT * FROM bookings WHERE status = 'confirmed' AND reminder_sent_at IS NULL AND date >= ? AND date <= ? ORDER BY date, start_min",
    )
    .all(now.date, addDays(now.date, Math.ceil(hoursBefore / 24) + 1)) as unknown as Booking[];
  const nowAbs = dayNumber(now.date) * 1440 + now.minutes;
  return rows.filter((b) => {
    const startAbs = dayNumber(b.date) * 1440 + b.start_min;
    // Due once inside the window, but not if the appointment is under 30 minutes away.
    return nowAbs >= startAbs - hoursBefore * 60 && nowAbs <= startAbs - 30;
  });
}

function dayNumber(iso: string): number {
  return Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

/** Claims a booking's reminder atomically; false if another tick already did. */
export function claimReminder(id: number): boolean {
  const r = db().prepare("UPDATE bookings SET reminder_sent_at = datetime('now') WHERE id = ? AND reminder_sent_at IS NULL").run(id);
  return Number(r.changes) === 1;
}

export function logSms(e: { bookingId: number | null; phone: string; kind: string; message: string; ok: boolean; error?: string }) {
  db()
    .prepare("INSERT INTO sms_log (booking_id, phone, kind, message, ok, error) VALUES (?,?,?,?,?,?)")
    .run(e.bookingId, e.phone, e.kind, e.message, e.ok ? 1 : 0, e.error ?? null);
}

export type SmsLogRow = { id: number; booking_id: number | null; phone: string; kind: string; message: string; ok: number; error: string | null; created_at: string };

export function recentSms(limit = 50): SmsLogRow[] {
  return db().prepare("SELECT * FROM sms_log ORDER BY id DESC LIMIT ?").all(limit) as unknown as SmsLogRow[];
}

export type BookingFilter = "upcoming" | "today" | "past" | "attention" | "all";

export function listBookings(filter: BookingFilter): Booking[] {
  const today = tehranNow().date;
  const base = "SELECT * FROM bookings";
  const q: Record<BookingFilter, [string, unknown[]]> = {
    today: [`${base} WHERE date = ? AND status IN ('confirmed','completed') ORDER BY start_min`, [today]],
    upcoming: [`${base} WHERE date >= ? AND status = 'confirmed' ORDER BY date, start_min`, [today]],
    past: [`${base} WHERE date < ? AND status IN ('confirmed','completed') ORDER BY date DESC, start_min DESC LIMIT 200`, [today]],
    attention: [`${base} WHERE status = 'needs_refund' ORDER BY date`, []],
    all: [`${base} ORDER BY created_at DESC LIMIT 300`, []],
  };
  const [sql, params] = q[filter];
  return db().prepare(sql).all(...(params as string[])) as unknown as Booking[];
}

export function dashboardStats() {
  const today = tehranNow().date;
  const d = db();
  const one = (sql: string, ...p: string[]) => (d.prepare(sql).get(...p) as { n: number }).n;
  return {
    today: one("SELECT COUNT(*) AS n FROM bookings WHERE date = ? AND status IN ('confirmed','completed')", today),
    upcoming: one("SELECT COUNT(*) AS n FROM bookings WHERE date >= ? AND status = 'confirmed'", today),
    attention: one("SELECT COUNT(*) AS n FROM bookings WHERE status = 'needs_refund'"),
    monthRevenue: one(
      "SELECT COALESCE(SUM(amount),0) AS n FROM bookings WHERE paid_at >= datetime('now','-30 days') AND status IN ('confirmed','completed')",
    ),
  };
}
