import "server-only";
import { sendSms } from "./sms";
import { bookingsDueForReminder, claimReminder, getSettings, logSms, type Booking, type Settings } from "./store";
import { faTime, jalaliLong, tehranNow } from "./time";

// Booking → SMS. Every send is logged (shown in the admin panel), and a failed SMS
// never breaks the booking flow that triggered it.

type Kind = "confirm" | "reminder" | "cancel" | "owner" | "test";

export const PLACEHOLDERS = ["{name}", "{service}", "{date}", "{time}", "{code}", "{salon}", "{phone}", "{address}"] as const;

export function render(template: string, b: Booking, s: Settings): string {
  const vars: Record<string, string> = {
    name: b.customer_name,
    service: b.service_name,
    date: jalaliLong(b.date),
    time: faTime(b.start_min),
    code: b.code,
    salon: s.businessName,
    phone: b.phone,
    address: s.address,
  };
  return template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m).trim();
}

async function deliver(kind: Kind, to: string, text: string, bookingId: number | null) {
  const r = await sendSms(to, text);
  logSms({ bookingId, phone: to, kind, message: text, ok: r.ok, error: r.ok ? undefined : r.error });
  if (!r.ok) console.error(`[sms] ${kind} to ${to} failed: ${r.error}`);
  return r;
}

/** Runs after a booking becomes confirmed (online payment or manual entry). */
export async function onConfirmed(b: Booking, opts: { online: boolean }) {
  const s = getSettings();
  const jobs: Promise<unknown>[] = [];
  if (s.sms.confirm) {
    jobs.push(deliver("confirm", b.phone, render(s.sms.templates.confirm, b, s), b.id));
    // Booked inside the reminder window: the confirmation already does the reminder's job.
    if (bookingsDueForReminder(s.sms.reminderHours).some((x) => x.id === b.id)) claimReminder(b.id);
  }
  if (opts.online && s.sms.owner && s.sms.ownerMobile) {
    jobs.push(deliver("owner", s.sms.ownerMobile, render(s.sms.templates.owner, b, s), b.id));
  }
  await Promise.allSettled(jobs);
}

/** Runs when the salon cancels an upcoming confirmed booking. */
export async function onCancelled(b: Booking) {
  const s = getSettings();
  if (!s.sms.cancel) return;
  const now = tehranNow();
  if (b.date < now.date || (b.date === now.date && b.start_min <= now.minutes)) return; // already past
  await deliver("cancel", b.phone, render(s.sms.templates.cancel, b, s), b.id);
}

export async function sendTest(to: string) {
  const s = getSettings();
  return deliver("test", to, `پیامک آزمایشی از ${s.businessName} ✓`, null);
}

/** Tehran 22:00–08:00: reminders wait until morning. */
function quietHours(minutes: number) {
  return minutes >= 22 * 60 || minutes < 8 * 60;
}

/** One scheduler tick: sends every reminder that is due. Safe to call concurrently. */
export async function runReminders(): Promise<{ sent: number; failed: number }> {
  const s = getSettings();
  const now = tehranNow();
  if (!s.sms.reminder || quietHours(now.minutes)) return { sent: 0, failed: 0 };
  let sent = 0;
  let failed = 0;
  for (const b of bookingsDueForReminder(s.sms.reminderHours, now)) {
    if (!claimReminder(b.id)) continue;
    const r = await deliver("reminder", b.phone, render(s.sms.templates.reminder, b, s), b.id);
    if (r.ok) sent++;
    else failed++;
  }
  return { sent, failed };
}
