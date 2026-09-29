import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BooksStackIcon, ChevronIcon, LanternIcon, PlannerIcon, RobotIcon, ShoppingBagIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { Tilt3D } from "@/components/marketing/Tilt3D";
import { HeroLetterScene } from "@/components/marketing/HeroLetterScene";
import { Scene3DBackgroundClient as Scene3DBackground } from "@/components/marketing/Scene3DBackgroundClient";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.marketing.metaTitle };
}

const ACCENT = {
  teal: { icon: "bg-teal-mist text-teal-deep", bar: "bg-teal" },
  blush: { icon: "bg-blush-soft text-blush", bar: "bg-blush" },
  sage: { icon: "bg-sage-soft text-teal-deep", bar: "bg-sage" },
} as const;

const FEATURES = [
  { key: "courses", Icon: BooksStackIcon, href: "/courses", accent: "teal" },
  { key: "bookstore", Icon: ShoppingBagIcon, href: "/bookstore", accent: "blush" },
  { key: "aiHub", Icon: RobotIcon, href: "/ai-hub", accent: "sage" },
  { key: "planner", Icon: PlannerIcon, href: "/planner", accent: "blush" },
  { key: "koreaLife", Icon: LanternIcon, href: "/korea-life", accent: "teal" },
] as const;

/** Public marketing site at "/" — separate from the app (which now opens at /launch, the PWA start_url). */
export default async function MarketingLandingPage() {
  const { m } = await getMessages();
  const t = m.marketing;

  const navItems = FEATURES.map(({ key, href }) => ({ key, href, label: t.features.items[key].title }));
  const tabItems = [{ key: "features", href: "#features", label: t.nav.features }, ...navItems];

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Scene3DBackground />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -start-32 size-96 rounded-full bg-blush/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-24 top-96 size-96 rounded-full bg-sage/25 blur-3xl" />

      <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo size={34} />
        <div className="flex items-center gap-4">
          <LanguageSwitch />
          <Link href="/auth/login" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline-block">
            {t.nav.login}
          </Link>
          <Link
            href="/auth/welcome"
            className="rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-deep sm:px-5"
          >
            {t.nav.start}
          </Link>
        </div>
      </header>

      {/* Hero — large, and running directly on the shared 3D background instead of its own boxed art */}
      <section className="relative z-10 flex min-h-[85dvh] flex-col items-center justify-center gap-7 px-6 pb-10 text-center">
        <HeroLetterScene />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[26rem] max-w-2xl -translate-y-1/2 rounded-[64px] bg-cream/45 blur-3xl"
        />
        <span className="relative rounded-full bg-sage-soft px-4 py-1.5 text-xs font-semibold text-teal-deep">{t.hero.eyebrow}</span>
        <h1 className="relative max-w-2xl font-display text-4xl leading-tight font-bold text-ink md:text-6xl">{t.hero.title}</h1>
        <p className="relative max-w-xl text-lg leading-8 text-ink-soft">{t.hero.subtitle}</p>
        <div className="relative flex flex-col items-center gap-3 sm:flex-row">
          <ButtonLink href="/auth/welcome" className="w-auto! px-8">
            {t.hero.cta}
          </ButtonLink>
          <Link href="/auth/login" className="text-sm font-semibold text-teal-deep">
            {t.hero.ctaSecondary}
          </Link>
        </div>
      </section>

      {/* Quick-jump tabs — every major section reachable in one tap, right under the hero */}
      <nav
        aria-label={t.nav.features}
        className="relative z-10 mx-auto flex max-w-3xl gap-2 overflow-x-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="shrink-0 rounded-full bg-surface/90 px-4 py-2 text-sm font-medium text-ink-soft shadow-soft backdrop-blur transition hover:bg-surface hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Features — its own tinted band so it reads as a distinct section, not a continuation of the hero */}
      <section id="features" className="relative scroll-mt-24 bg-gradient-to-b from-transparent via-cream-deep/60 to-transparent py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="rounded-full bg-teal-mist px-4 py-1.5 text-xs font-semibold text-teal-deep">{t.features.eyebrow}</span>
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">{t.features.title}</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ key, Icon, href, accent }) => (
              <Tilt3D
                key={key}
                strength={6}
                className="group relative flex flex-col items-start overflow-hidden rounded-[24px] bg-surface p-6 shadow-soft transition hover:shadow-lift"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${ACCENT[accent].bar}`} />
                <span className={`grid size-12 place-items-center rounded-2xl ${ACCENT[accent].icon}`}>
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
        </div>
      </section>

      {/* Method — real content about how KoreaFarsi actually teaches, not just an icon grid */}
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="rounded-full bg-blush-soft px-4 py-1.5 text-xs font-semibold text-blush">{t.method.eyebrow}</span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink md:text-3xl">{t.method.title}</h2>
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">{t.method.intro}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-[28px] bg-surface p-5 shadow-soft">
            {t.method.steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex w-20 flex-col items-center gap-1.5 rounded-2xl bg-cream px-2 py-3 text-center">
                  <span className="grid size-7 place-items-center rounded-full bg-teal text-xs font-bold text-white">{i + 1}</span>
                  <span className="text-xs leading-4 font-medium text-ink">{step}</span>
                </div>
                {i < t.method.steps.length - 1 && (
                  <ChevronIcon width={14} height={14} className="shrink-0 text-ink-faint rtl:-scale-x-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-8 py-12 text-cream shadow-lift">
          <span aria-hidden="true" className="pointer-events-none absolute -top-16 -end-16 size-56 rounded-full bg-blush/25 blur-3xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -start-10 size-56 rounded-full bg-teal/30 blur-3xl" />
          <h2 className="relative font-display text-2xl font-semibold md:text-3xl">{t.ctaBand.title}</h2>
          <p className="relative mt-2 text-cream/80">{t.ctaBand.body}</p>
          <Link
            href="/auth/welcome"
            className="relative mt-6 inline-flex rounded-full bg-gradient-to-r from-cream to-cream/90 px-8 py-3.5 text-[15px] font-semibold text-ink shadow-soft transition hover:from-white hover:to-cream"
          >
            {t.ctaBand.cta}
          </Link>
        </div>
      </section>

      <SiteFooter m={m} />
    </div>
  );
}
