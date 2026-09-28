import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import {
  BellIcon,
  BooksStackIcon,
  LanternIcon,
  PlayIcon,
  RobotIcon,
  ShoppingBagIcon,
} from "@/components/icons";
import { HomeTodayRing } from "@/components/planner/HomeTodayRing";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { getContinueCard } from "@/lib/courses/queries";
import { fmt, formatNumber, type Locale, type Messages } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getTodayTasks } from "@/lib/planner/queries";
import { getProfile } from "@/lib/profile";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.home.metaTitle };
}

type CardKey = keyof Messages["home"]["cards"];

/** The four main sections (sketch 02 Home). My Courses / Korea Life are placeholders in Phase 1. */
const CARDS: { key: CardKey; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; tone: string }[] = [
  { key: "courses", href: "/courses", Icon: BooksStackIcon, tone: "bg-sage-soft text-teal-deep" },
  { key: "bookstore", href: "/bookstore", Icon: ShoppingBagIcon, tone: "bg-blush-soft text-ink" },
  { key: "aiHub", href: "/ai-hub", Icon: RobotIcon, tone: "bg-ink text-cream" },
  { key: "koreaLife", href: "/korea-life", Icon: LanternIcon, tone: "bg-cream-deep text-ink" },
];

export default async function HomePage() {
  const [{ m, locale }, profile, { plan, tasks }, continueCard] = await Promise.all([
    getMessages(),
    getProfile(),
    getTodayTasks(),
    getContinueCard(),
  ]);
  const t = m.home;
  const firstName = profile?.name?.split(/\s+/)[0] ?? null;

  return (
    <div className="animate-fade-up">
      <PageHeader
        actions={
          <>
            <HeaderIconLink href="/notifications" label={t.notifications}>
              <BellIcon width={20} height={20} />
            </HeaderIconLink>
            <Link href={profile ? "/account" : "/auth/welcome"} aria-label={t.profile}>
              <Avatar name={profile?.name} email={profile?.user.email} size={40} className="shadow-soft" />
            </Link>
          </>
        }
      />

      <p lang="ko" className="text-sm text-ink-soft">
        {t.greeting} 👋
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        {firstName ? fmt(t.welcomeNamed, { name: firstName }) : t.welcomeGuest}
      </h1>

      {/* Hero — PROVISIONAL art: SVG composition until the banner illustration exists */}
      <section className="relative mt-6 h-44 overflow-hidden rounded-card bg-gradient-to-br from-blush-soft via-cream to-sage-soft shadow-soft md:h-56">
        <SakuraBranch className="absolute -top-2 -end-2 w-40 md:w-56 rtl:-scale-x-100" />
        <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-24 md:h-32" />
        <div className="relative p-6 md:p-8">
          <p className="max-w-[14rem] font-display text-2xl leading-snug font-semibold text-ink md:max-w-xs md:text-3xl">
            {t.hero.message}
          </p>
          <p lang="ko" className="mt-2 text-sm text-ink-soft">
            {t.hero.ko}
          </p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {CARDS.map(({ key, href, Icon, tone }) => {
          const card = t.cards[key];
          return (
            <Link
              key={key}
              href={href}
              className="group flex flex-col rounded-card border border-line/60 bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift md:p-5"
            >
              <span className={`grid size-11 place-items-center rounded-2xl ${tone}`}>
                <Icon width={22} height={22} />
              </span>
              <span lang="ko" className="mt-4 text-[11px] font-medium tracking-wide text-blush">
                {card.ko}
              </span>
              <span className="mt-0.5 font-display text-lg leading-tight font-semibold text-ink">{card.title}</span>
              <span className="mt-1.5 text-[13px] leading-5 text-ink-soft">{card.body}</span>
            </Link>
          );
        })}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Continue Your Journey — real once a course exists (Phase 2, Part 4) */}
        <section>
          <h2 className="font-display text-xl font-semibold">{t.continue.title}</h2>
          {continueCard ? (
            <Link
              href={continueCard.nextLessonId ? `/courses/${continueCard.course.slug}/lessons/${continueCard.nextLessonId}` : `/courses/${continueCard.course.slug}`}
              className="mt-3 flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sage-soft text-teal-deep">
                <BooksStackIcon width={26} height={26} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink" dir="auto">
                  {locale === "en" ? continueCard.course.title_en || continueCard.course.title : continueCard.course.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-5 text-ink-soft">
                  {continueCard.total > 0 ? fmt(m.courses.progress, { done: formatNumber(continueCard.done, locale as Locale), total: formatNumber(continueCard.total, locale as Locale) }) : m.courses.startCta}
                </p>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${continueCard.total ? (continueCard.done / continueCard.total) * 100 : 0}%` }} />
                </div>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal text-white" aria-hidden="true">
                <PlayIcon width={18} height={18} />
              </span>
            </Link>
          ) : (
            <div className="mt-3 flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sage-soft text-teal-deep">
                <BooksStackIcon width={26} height={26} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{t.continue.emptyTitle}</p>
                <p className="mt-0.5 text-[13px] leading-5 text-ink-soft">{t.continue.emptyBody}</p>
                <div className="mt-2.5 h-1.5 rounded-full bg-line" />
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-line text-surface" aria-hidden="true">
                <PlayIcon width={18} height={18} />
              </span>
            </div>
          )}
        </section>

        {/* Today's Plan — real tasks once a Planner plan exists (Phase 2) */}
        <section>
          <h2 className="font-display text-xl font-semibold">{t.today.title}</h2>
          <div className="mt-3 rounded-card bg-surface p-4 shadow-soft">
            {!plan ? (
              <div className="flex flex-col items-center py-2 text-center">
                <p className="text-sm text-ink-soft">{t.today.soon}</p>
                <ButtonLink href="/planner" variant="secondary" className="mt-3 w-auto! px-6">
                  {m.planner.setupCta}
                </ButtonLink>
              </div>
            ) : tasks.length === 0 ? (
              <p className="py-2 text-center text-sm text-ink-soft">{m.planner.today.empty}</p>
            ) : (
              <>
                <ul className="grid grid-cols-4 gap-2">
                  {tasks.map((task) => (
                    <HomeTodayRing key={task.id} task={task} />
                  ))}
                </ul>
                {tasks.every((task) => task.is_done) && (
                  <p className="mt-4 border-t border-line pt-3 text-center text-xs font-medium text-success">
                    {m.planner.today.allDone}
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
