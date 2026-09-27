import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import {
  BellIcon,
  BooksStackIcon,
  LanternIcon,
  MicIcon,
  PencilIcon,
  PlayIcon,
  ReviewIcon,
  RobotIcon,
  ShoppingBagIcon,
  WatchIcon,
} from "@/components/icons";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { fmt, type Messages } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
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

type PlanKey = keyof Messages["home"]["today"]["items"];
const PLAN: { key: PlanKey; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "watch", Icon: WatchIcon },
  { key: "review", Icon: ReviewIcon },
  { key: "practice", Icon: PencilIcon },
  { key: "speak", Icon: MicIcon },
];

export default async function HomePage() {
  const [{ m }, profile] = await Promise.all([getMessages(), getProfile()]);
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
        {/* Continue Your Journey — Phase 1 empty state (no courses yet) */}
        <section>
          <h2 className="font-display text-xl font-semibold">{t.continue.title}</h2>
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
        </section>

        {/* Today's Plan — Phase 1 placeholder (Planner comes later) */}
        <section>
          <h2 className="font-display text-xl font-semibold">{t.today.title}</h2>
          <div className="mt-3 rounded-card bg-surface p-4 shadow-soft">
            <ul className="grid grid-cols-4 gap-2">
              {PLAN.map(({ key, Icon }) => (
                <li key={key} className="flex flex-col items-center gap-2">
                  <span className="relative grid size-14 place-items-center">
                    <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
                      <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" className="stroke-line" />
                    </svg>
                    <Icon width={22} height={22} className="text-ink-soft" />
                  </span>
                  <span className="text-xs font-medium text-ink-soft">{t.today.items[key]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-center text-xs text-ink-faint">{t.today.soon}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
