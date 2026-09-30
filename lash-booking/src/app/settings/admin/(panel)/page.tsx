import Link from "next/link";
import { ConfirmButton, ManualBookingForm, SubmitButton } from "@/components/admin/forms";
import { Card, Icon, StatusBadge } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { dashboardStats, listBookings, listServices, getSettings, type Booking, type BookingFilter } from "@/lib/store";
import { addDays, faDigits, faTime, jalaliLong, tehranNow, toman } from "@/lib/time";
import { changeStatus } from "../actions";

export const metadata = { title: "نوبت‌ها" };

const FILTERS: { key: BookingFilter; label: string }[] = [
  { key: "today", label: "امروز" },
  { key: "upcoming", label: "پیش رو" },
  { key: "attention", label: "نیاز به پیگیری" },
  { key: "past", label: "گذشته" },
  { key: "all", label: "همه" },
];

export default async function BookingsAdmin({ searchParams }: PageProps<"/settings/admin">) {
  await requireAdmin();
  const { f } = await searchParams;
  const filter = (FILTERS.find((x) => x.key === f)?.key ?? "upcoming") as BookingFilter;
  const stats = dashboardStats();
  const bookings = listBookings(filter);
  const s = getSettings();

  const today = tehranNow().date;
  const days = Array.from({ length: s.horizonDays + 1 }, (_, i) => {
    const date = addDays(today, i);
    return { date, label: `${i === 0 ? "امروز — " : ""}${jalaliLong(date)}` };
  });
  const services = listServices().map((x) => ({ id: x.id, name: x.name }));

  // Group by date for a day-by-day agenda.
  const groups = new Map<string, Booking[]>();
  for (const b of bookings) groups.set(b.date, [...(groups.get(b.date) ?? []), b]);

  return (
    <div className="animate-rise space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="نوبت‌های امروز" value={faDigits(stats.today)} />
        <Stat label="نوبت‌های پیش رو" value={faDigits(stats.upcoming)} />
        <Stat label="دریافتی آنلاین (۳۰ روز)" value={toman(stats.monthRevenue)} small />
        <Stat label="نیاز به پیگیری" value={faDigits(stats.attention)} alert={stats.attention > 0} />
      </div>

      <details className="group rounded-card bg-surface shadow-soft">
        <summary className="flex cursor-pointer select-none items-center gap-2 p-5 font-bold">
          <span className="grid size-7 place-items-center rounded-full bg-rose-mist text-rose-deep">
            <Icon name="plus" className="size-4" />
          </span>
          ثبت نوبت دستی
          <span className="hidden text-xs font-normal text-ink-faint sm:inline">(برای رزروهای تلفنی یا اینستاگرامی)</span>
        </summary>
        <div className="border-t border-line p-5">
          <ManualBookingForm services={services} days={days} />
        </div>
      </details>

      <div>
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((x) => (
            <Link
              key={x.key}
              href={`/settings/admin?f=${x.key}`}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-sm transition ${
                x.key === filter ? "bg-rose-deep text-white" : "text-ink-soft ring-1 ring-line hover:text-ink"
              }`}
            >
              {x.label}
              {x.key === "attention" && stats.attention > 0 && ` (${faDigits(stats.attention)})`}
            </Link>
          ))}
        </div>

        {bookings.length === 0 ? (
          <Card className="py-10 text-center text-sm text-ink-soft">نوبتی در این بخش نیست.</Card>
        ) : (
          <div className="space-y-6">
            {[...groups].map(([date, list]) => (
              <section key={date}>
                <h3 className="mb-2 px-1 text-sm font-bold text-ink-soft">
                  {date === today && <span className="me-2 rounded-full bg-rose-deep px-2 py-0.5 text-xs text-white">امروز</span>}
                  {jalaliLong(date)}
                </h3>
                <div className="space-y-2">
                  {list.map((b) => (
                    <BookingRow key={b.id} b={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingRow({ b }: { b: Booking }) {
  const remaining = b.price - b.amount;
  return (
    <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
      <div className="flex items-center gap-3 md:w-40">
        <div className="rounded-xl bg-rose-mist px-3 py-2 text-center">
          <div className="text-base font-extrabold text-rose-deep">{faTime(b.start_min)}</div>
          <div className="text-[11px] text-ink-faint">تا {faTime(b.end_min)}</div>
        </div>
        <StatusBadge status={b.status} />
      </div>

      <div className="min-w-0 flex-1 text-sm">
        <div className="font-bold">{b.customer_name}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-ink-soft">
          <a href={`tel:${b.phone}`} dir="ltr" className="hover:text-rose-deep">
            {b.phone}
          </a>
          <span>{b.service_name}</span>
          <span dir="ltr" className="font-mono text-xs text-ink-faint">
            {b.code}
          </span>
        </div>
        {b.note && <p className="mt-1 text-xs text-ink-soft">«{b.note}»</p>}
      </div>

      <div className="text-sm md:w-44 md:text-left">
        {b.amount > 0 ? (
          <>
            <div className="text-ok">پرداخت‌شده: {toman(b.amount)}</div>
            {remaining > 0 && <div className="text-ink-soft">مانده: {toman(remaining)}</div>}
          </>
        ) : (
          <div className="text-ink-soft">{b.status === "confirmed" || b.status === "completed" ? `دستی · ${toman(b.price)}` : "—"}</div>
        )}
      </div>

      {(b.status === "confirmed" || b.status === "needs_refund") && (
        <div className="flex gap-2 md:w-auto">
          {b.status === "confirmed" && (
            <form action={changeStatus}>
              <input type="hidden" name="id" value={b.id} />
              <input type="hidden" name="status" value="completed" />
              <SubmitButton className="rounded-xl bg-ok-soft px-3 py-2 text-sm font-medium text-ok transition hover:bg-ok hover:text-white">
                انجام شد
              </SubmitButton>
            </form>
          )}
          <form action={changeStatus}>
            <input type="hidden" name="id" value={b.id} />
            <input type="hidden" name="status" value="cancelled" />
            <ConfirmButton
              message={b.status === "needs_refund" ? "بعد از بازگشت وجه یا هماهنگی، این مورد بسته شود؟" : "این نوبت لغو شود؟ ساعت آن دوباره آزاد می‌شود."}
              className="rounded-xl px-3 py-2 text-sm text-ink-soft ring-1 ring-line transition hover:text-danger hover:ring-danger"
            >
              {b.status === "needs_refund" ? "بسته شد" : "لغو"}
            </ConfirmButton>
          </form>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value, alert, small }: { label: string; value: string; alert?: boolean; small?: boolean }) {
  return (
    <Card className={`p-4 ${alert ? "ring-2 ring-danger/40" : ""}`}>
      <div className="text-xs text-ink-faint">{label}</div>
      <div className={`mt-1 font-extrabold ${small ? "text-base" : "text-2xl"} ${alert ? "text-danger" : ""}`}>{value}</div>
    </Card>
  );
}
