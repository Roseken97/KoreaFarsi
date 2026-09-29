import type { Metadata } from "next";
import Link from "next/link";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { Logo } from "@/components/brand/Logo";
import { BooksStackIcon, ChevronIcon, LanternIcon, PlannerIcon, RobotIcon, ShoppingBagIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { Tilt3D } from "@/components/marketing/Tilt3D";
import { ButtonLink } from "@/components/ui/Button";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.marketing.metaTitle };
}

const FEATURES = [
  { key: "courses", Icon: BooksStackIcon, href: "/courses" },
  { key: "bookstore", Icon: ShoppingBagIcon, href: "/bookstore" },
  { key: "aiHub", Icon: RobotIcon, href: "/ai-hub" },
  { key: "planner", Icon: PlannerIcon, href: "/planner" },
  { key: "koreaLife", Icon: LanternIcon, href: "/korea-life" },
] as const;

/** Public marketing site at "/" — separate from the app (which now opens at /launch, the PWA start_url). */
export default async function MarketingLandingPage() {
  const { m } = await getMessages();
  const t = m.marketing;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -start-32 size-96 rounded-full bg-blush/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-24 top-96 size-96 rounded-full bg-sage/25 blur-3xl" />

      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo size={34} />
        <div className="flex items-center gap-4">
          <LanguageSwitch />
          <Link href="/auth/login" className="text-sm font-medium text-ink-soft hover:text-ink">
            {t.nav.login}
          </Link>
          <Link href="/auth/welcome" className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-deep">
            {t.nav.start}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-5xl flex-col items-center gap-7 px-6 pt-8 pb-16 text-center md:pt-14">
        <span className="rounded-full bg-sage-soft px-4 py-1.5 text-xs font-semibold text-teal-deep">{t.hero.eyebrow}</span>
        <h1 className="max-w-2xl font-display text-4xl leading-tight font-bold text-ink md:text-6xl">{t.hero.title}</h1>
        <p className="max-w-xl text-lg leading-8 text-ink-soft">{t.hero.subtitle}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <ButtonLink href="/auth/welcome" className="w-auto! px-8">
            {t.hero.cta}
          </ButtonLink>
          <Link href="/auth/login" className="text-sm font-semibold text-teal-deep">
            {t.hero.ctaSecondary}
          </Link>
        </div>

        <Tilt3D className="relative mt-4 h-64 w-full max-w-lg overflow-hidden rounded-[32px] bg-gradient-to-br from-blush-soft via-cream to-sage-soft shadow-lift md:h-80">
          <span aria-hidden="true" className="absolute -top-8 -start-8 size-40 rounded-full bg-white/30 blur-2xl" />
          <span aria-hidden="true" className="absolute end-10 top-10 size-20 rounded-full bg-blush/20 blur-xl" />
          <SakuraBranch className="absolute -top-3 -end-3 w-48 md:w-64 rtl:-scale-x-100" />
          <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-32 md:h-40" />
        </Tilt3D>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">{t.features.title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, Icon, href }) => (
            <Tilt3D key={key} strength={6} className="flex flex-col items-start rounded-[24px] bg-surface p-6 shadow-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-sage-soft text-teal-deep">
                <Icon width={22} height={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{t.features.items[key].title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{t.features.items[key].body}</p>
              <Link href={href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-deep">
                {t.nav.start}
                <ChevronIcon width={14} height={14} className="rtl:-scale-x-100" />
              </Link>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="rounded-[28px] bg-ink px-8 py-12 text-cream shadow-lift">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{t.ctaBand.title}</h2>
          <p className="mt-2 text-cream/80">{t.ctaBand.body}</p>
          <Link href="/auth/welcome" className="mt-6 inline-flex rounded-full bg-cream px-8 py-3.5 text-[15px] font-semibold text-ink shadow-soft transition hover:bg-cream/90">
            {t.ctaBand.cta}
          </Link>
        </div>
      </section>

      <footer className="relative border-t border-line/60 px-6 py-8 text-center text-xs text-ink-faint">
        <p>© {new Date().getFullYear()} KoreaFarsi — {t.footer.rights}</p>
      </footer>
    </div>
  );
}
