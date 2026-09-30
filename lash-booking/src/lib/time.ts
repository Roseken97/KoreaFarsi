// Time helpers. The salon runs on Tehran time regardless of where the server is.
// Dates are stored as Gregorian ISO strings ("2026-10-01"); times as minutes from midnight.

export const TZ = "Asia/Tehran";

const partsFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Current date (ISO) and minute-of-day in Tehran. */
export function tehranNow(now = new Date()): { date: string; minutes: number } {
  const p = Object.fromEntries(partsFmt.formatToParts(now).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

/** Adds days to an ISO date without any timezone drift (pure calendar arithmetic). */
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Saturday … 6 = Friday (Iranian week order). */
export function weekdayIndex(iso: string): number {
  const js = new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  return (js + 1) % 7;
}

export const WEEKDAYS_FA = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export function isIsoDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
}

const jDay = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: "UTC", day: "numeric" });
const jMonth = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: "UTC", month: "long" });
const jYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: "UTC", year: "numeric" });

export function jalaliParts(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return { day: jDay.format(d), month: jMonth.format(d), weekday: WEEKDAYS_FA[weekdayIndex(iso)] };
}

/** e.g. "پنجشنبه ۱۰ مهر ۱۴۰۵" — assembled by hand; Intl's own order mixes badly in RTL. */
export function jalaliLong(iso: string): string {
  const p = jalaliParts(iso);
  return `${p.weekday} ${p.day} ${p.month} ${jYear.format(new Date(`${iso}T12:00:00Z`)).replace(/[^۰-۹]/g, "")}`;
}

export function faDigits(v: string | number): string {
  return String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** Converts Persian/Arabic digits typed by users back to ASCII. */
export function enDigits(v: string): string {
  return v
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** 570 → "09:30" */
export function minToHHMM(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** "09:30" → 570, or null if malformed. */
export function hhmmToMin(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h > 24 || mm > 59 || h * 60 + mm > 1440) return null;
  return h * 60 + mm;
}

export function faTime(min: number): string {
  return faDigits(minToHHMM(min));
}

export function toman(n: number): string {
  return `${faDigits(n.toLocaleString("en-US")).replace(/,/g, "٬")} تومان`;
}

export function durationFa(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${faDigits(m)} دقیقه`;
  if (!m) return `${faDigits(h)} ساعت`;
  return `${faDigits(h)} ساعت و ${faDigits(m)} دقیقه`;
}

/** Online deposit for a price, rounded to the nearest 1,000 Toman (minimum 1,000). */
export function depositAmount(price: number, percent: number): number {
  return Math.max(1000, Math.round((price * percent) / 100 / 1000) * 1000);
}
