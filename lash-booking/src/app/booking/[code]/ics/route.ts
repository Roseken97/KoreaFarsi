import { getBookingByCode, getSettings } from "@/lib/store";

// Tehran has no DST since 2022, so a fixed +03:30 offset converts local → UTC.
const TEHRAN_OFFSET_MIN = 210;

function utcStamp(date: string, minutes: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCMinutes(minutes - TEHRAN_OFFSET_MIN);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const esc = (s: string) => s.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

export async function GET(_req: Request, ctx: RouteContext<"/booking/[code]/ics">) {
  const { code } = await ctx.params;
  const b = getBookingByCode(code.toUpperCase());
  if (!b || b.status !== "confirmed") return new Response("Not found", { status: 404 });
  const s = getSettings();

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//lash-booking//FA",
    "BEGIN:VEVENT",
    `UID:${b.code}@lash-booking`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${utcStamp(b.date, b.start_min)}`,
    `DTEND:${utcStamp(b.date, b.end_min)}`,
    `SUMMARY:${esc(`${b.service_name} - ${s.businessName}`)}`,
    `DESCRIPTION:${esc(`کد پیگیری: ${b.code}`)}`,
    s.address ? `LOCATION:${esc(s.address)}` : "",
    "BEGIN:VALARM",
    "TRIGGER:-PT3H",
    "ACTION:DISPLAY",
    "DESCRIPTION:یادآوری نوبت",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="booking-${b.code}.ics"`,
    },
  });
}
