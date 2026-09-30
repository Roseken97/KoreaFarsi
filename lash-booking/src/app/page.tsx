import Link from "next/link";
import { connection } from "next/server";
import { BookingWizard } from "@/components/BookingWizard";
import { Icon, Shell } from "@/components/ui";
import { getSettings, listServices } from "@/lib/store";

export default async function Home() {
  await connection();
  const s = getSettings();
  const services = listServices({ activeOnly: true }).map((x) => ({
    id: x.id,
    name: x.name,
    description: x.description,
    duration: x.duration_min,
    price: x.price,
  }));

  return (
    <Shell>
      <header className="flex h-16 items-center justify-between">
        <span className="text-sm font-medium text-ink-soft">رزرو آنلاین نوبت</span>
        <Link
          href="/settings"
          aria-label="تنظیمات"
          className="grid size-10 place-items-center rounded-full bg-surface text-ink-soft shadow-soft transition hover:rotate-45 hover:text-rose-deep"
        >
          <Icon name="settings" />
        </Link>
      </header>

      <section className="relative mb-6 overflow-hidden rounded-card bg-gradient-to-bl from-rose-soft via-rose-mist to-surface px-6 py-8 shadow-soft">
        <LashArc />
        <p className="mb-1 text-xs font-bold tracking-wide text-rose">{s.artistName ? `با ${s.artistName}` : "Lash Studio"}</p>
        <h1 className="text-2xl font-extrabold leading-snug">{s.businessName}</h1>
        <p className="mt-2 max-w-[18rem] text-sm leading-7 text-ink-soft">{s.tagline}</p>
      </section>

      {services.length ? (
        <BookingWizard
          services={services}
          depositPercent={s.depositPercent}
          holdMinutes={s.holdMinutes}
          policy={s.policy}
        />
      ) : (
        <p className="rounded-card bg-surface p-6 text-center text-ink-soft shadow-soft">در حال حاضر خدمتی برای رزرو فعال نیست.</p>
      )}
    </Shell>
  );
}

/** Decorative closed-eye lash line in the hero corner. */
function LashArc() {
  return (
    <svg viewBox="0 0 120 60" className="pointer-events-none absolute -left-3 -top-1 w-36 text-rose/35" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M10 22c25 22 75 22 100 0" />
      {[18, 30, 44, 60, 76, 90, 102].map((x, i) => {
        const y = 22 + Math.sin((Math.PI * (x - 10)) / 100) * 15;
        const lean = (x - 60) / 6;
        return <path key={i} d={`M${x} ${y}l${lean} 12`} />;
      })}
    </svg>
  );
}
