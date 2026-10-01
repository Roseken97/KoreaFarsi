import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { Hero } from "@/components/shell/Hero";
import {
  ArrowForwardIcon,
  BellIcon,
  BooksStackIcon,
  LanternIcon,
  PlayIcon,
  RobotIcon,
  ShoppingBagIcon,
} from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import { HomeTodayRing } from "@/components/planner/HomeTodayRing";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { getContinueCard } from "@/lib/courses/queries";
import { fmt, formatNumber, type Locale, type Messages } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getUnreadNotificationCount } from "@/lib/notifications/queries";
import { getTodayTasks } from "@/lib/planner/queries";
import { getProfile } from "@/lib/profile";
import { MESH, MESH_SHADOW } from "@/lib/ui/mesh";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.home.metaTitle };
}

type CardKey = keyof Messages["home"]["cards"];

/**
 * Polished-colorful recipe: a layered mesh gradient (base color + two tinted
 * radial blobs from neighboring palette hues) instead of a flat single fill,
 * a grain texture to kill the flat-vector look, a restrained realistic
 * shadow (not a neon glow), and an editorial layout — icon chip top-start,
 * a large low-opacity Korean glyph as a background watermark, title/body
 * anchored bottom-start, and a small "go" affordance top-end.
 */
const CARDS: { key: CardKey; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; color: keyof typeof MESH; text: string }[] = [
  { key: "courses", href: "/courses", Icon: BooksStackIcon, color: "violet", text: "text-white" },
  { key: "bookstore", href: "/bookstore", Icon: ShoppingBagIcon, color: "coral", text: "text-white" },
  { key: "aiHub", href: "/ai-hub", Icon: RobotIcon, color: "teal", text: "text-white" },
  { key: "koreaLife", href: "/korea-life", Icon: LanternIcon, color: "yellow", text: "text-ink" },
];

export default async function HomePage() {
  const [{ m, locale }, profile, { plan, tasks }, continueCard, unreadCount] = await Promise.all([
    getMessages(),
    getProfile(),
    getTodayTasks(),
    getContinueCard(),
    getUnreadNotificationCount(),
  ]);
  const t = m.home;
  const firstName = profile?.name?.split(/\s+/)[0] ?? null;
  const donePct = continueCard?.total ? Math.round((continueCard.done / continueCard.total) * 100) : 0;

  return (
    <div className="animate-fade-up">
      <PageHeader
        actions={
          <>
            <HeaderIconLink href="/notifications" label={t.notifications} badge={unreadCount > 0}>
              <BellIcon width={20} height={20} />
            </HeaderIconLink>
            <Link href={profile ? "/account" : "/auth/welcome"} aria-label={t.profile}>
              <Avatar name={profile?.name} email={profile?.user.email} avatarKey={profile?.avatarKey} size={40} className="shadow-soft" />
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

      {/* Hero — shows the active /admin/announcements banner, or this default message */}
      <div className="mt-6">
        <Hero placement="home" locale={locale}>
          <span className="absolute -top-10 -start-10 size-32 rounded-full bg-white/30 blur-2xl" aria-hidden="true" />
          <span className="absolute end-6 top-10 size-16 rounded-full bg-blush/20 blur-xl" aria-hidden="true" />
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
          {plan && (
            <div className="absolute bottom-3 start-3 flex items-center gap-2 rounded-full bg-surface/90 py-1.5 ps-1.5 pe-3.5 shadow-soft backdrop-blur">
              <Avatar name={profile?.name} email={profile?.user.email} avatarKey={profile?.avatarKey} size={28} />
              <span className="text-xs font-semibold text-ink">{t.today.title}</span>
            </div>
          )}
        </Hero>
      </div>

      {/* Main sections — polished colorful: mesh gradient + grain, editorial layout, Korean glyph as a watermark */}
      <section className="mt-6 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {CARDS.map(({ key, href, Icon, color, text }) => {
          const card = t.cards[key];
          return (
            <MotionCard
              key={key}
              href={href}
              style={{ backgroundImage: MESH[color] }}
              className={`card-grain group @container relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[28px] p-4 ${MESH_SHADOW[color]}`}
            >
              <span
                lang="ko"
                className={`pointer-events-none absolute -bottom-3 -end-2 text-[15cqw] leading-none font-bold tracking-tight whitespace-nowrap ${text} opacity-[0.16]`}
                aria-hidden="true"
              >
                {card.ko}
              </span>

              <div className="relative flex items-start justify-between">
                <span className={`grid size-9 place-items-center rounded-xl bg-white/20 ${text}`}>
                  <Icon width={18} height={18} />
                </span>
                <span className={`grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 ${text} rtl:rotate-180 rtl:group-hover:-translate-x-0.5`}>
                  <ArrowForwardIcon width={14} height={14} />
                </span>
              </div>

              <span className="relative">
                <span className={`block font-display text-base leading-tight font-semibold ${text}`}>{card.title}</span>
                <span className={`mt-0.5 block text-[11px] leading-4 ${text} opacity-75`}>{card.body}</span>
              </span>
            </MotionCard>
          );
        })}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Continue Your Journey — circular progress + color block, real once a course exists */}
        <section>
          <h2 className="font-display text-xl font-semibold">{t.continue.title}</h2>
          {continueCard ? (
            <MotionCard
              href={continueCard.nextLessonId ? `/courses/${continueCard.course.slug}/lessons/${continueCard.nextLessonId}` : `/courses/${continueCard.course.slug}`}
              className="mt-3 flex items-center gap-4 rounded-[24px] bg-surface p-4 shadow-soft"
              tilt={false}
            >
              <div className="relative grid size-16 shrink-0 place-items-center">
                <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
                  <circle cx="20" cy="20" r="17" fill="none" strokeWidth="4" className="stroke-line" />
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="stroke-violet"
                    pathLength={100}
                    strokeDasharray="100"
                    strokeDashoffset={100 - donePct}
                  />
                </svg>
                <span className="text-sm font-bold text-ink" dir="ltr">
                  {donePct}%
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink" dir="auto">
                  {locale === "en" ? continueCard.course.title_en || continueCard.course.title : continueCard.course.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-5 text-ink-soft">
                  {continueCard.total > 0 ? fmt(m.courses.progress, { done: formatNumber(continueCard.done, locale as Locale), total: formatNumber(continueCard.total, locale as Locale) }) : m.courses.startCta}
                </p>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-violet text-white" aria-hidden="true">
                <PlayIcon width={18} height={18} />
              </span>
            </MotionCard>
          ) : (
            <div className="mt-3 flex items-center gap-4 rounded-[24px] bg-surface p-4 shadow-soft">
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
          <div className="mt-3 rounded-[24px] bg-surface p-4 shadow-soft">
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
