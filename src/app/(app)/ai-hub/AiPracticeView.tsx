"use client";

import Link from "next/link";
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { ChatBox } from "@/components/chat/ChatBox";
import { BellIcon, ChatBubbleIcon, DictionaryIcon, HeadphonesIcon, MicIcon, RobotIcon, TrophyIcon, WatchIcon } from "@/components/icons";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import type { AiPracticeStats } from "@/lib/ai-practice/queries";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import type { Profile } from "@/lib/profile";

type OtherSection = "speak" | "listen" | "shadow" | "grammar";
type Level = "beginner" | "intermediate" | "advanced";

const OTHER_SECTIONS: { key: OtherSection; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "speak", Icon: MicIcon },
  { key: "listen", Icon: HeadphonesIcon },
  { key: "shadow", Icon: MicIcon },
  { key: "grammar", Icon: DictionaryIcon },
];

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

/**
 * AI Practice. Chat is the one real, working section, so it gets the page's
 * main real estate (no header duplication, no "select it" step). The other
 * modes are a small, clearly-secondary chip row — real numbers (Your
 * Progress) never hide behind a not-yet-built feature.
 */
export function AiPracticeView({ profile, stats, unreadCount }: { profile: Profile | null; stats: AiPracticeStats; unreadCount: number }) {
  const { m, locale } = useI18n();
  const t = m.aiPractice;
  const [level, setLevel] = useState<Level>("beginner");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="animate-fade-up max-w-2xl">
      <PageHeader
        actions={
          <>
            <HeaderIconLink href="/notifications" label={m.home.notifications} badge={unreadCount > 0}>
              <BellIcon width={20} height={20} />
            </HeaderIconLink>
            <Link href={profile ? "/account" : "/auth/welcome"} aria-label={m.home.profile}>
              <Avatar name={profile?.name} email={profile?.user.email} avatarKey={profile?.avatarKey} size={40} className="shadow-soft" />
            </Link>
          </>
        }
      />

      {/* Title + friendly AI character */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">{t.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t.subtitle}</p>
        </div>
        <div className="relative shrink-0 rounded-card bg-sage-soft px-3.5 py-3">
          <span className="absolute -top-2.5 -end-1.5 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink shadow-soft" dir="ltr" lang="ko">
            {t.greeting}
          </span>
          <RobotIcon width={32} height={32} className="text-teal-deep" />
        </div>
      </div>

      {/* Your Progress — always visible; real numbers, never hidden behind a placeholder tab */}
      <section className="mt-5 rounded-card bg-surface p-4 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-base font-semibold">{t.progress.title}</h2>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-ink-soft outline-none"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {m.courses.levels[l]}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 grid grid-cols-3 divide-x divide-line">
          <ProgressStat icon={<ChatBubbleIcon width={18} height={18} />} value={formatNumber(stats.conversations, locale)} label={t.progress.conversations} />
          <ProgressStat icon={<WatchIcon width={18} height={18} />} value="—" label={t.progress.hours} />
          <ProgressStat icon={<TrophyIcon width={18} height={18} />} value={formatNumber(stats.badges, locale)} label={t.progress.badges} />
        </div>
      </section>

      {/* Speak / Listen / Shadow / Grammar — a small, clearly-secondary row, not full cards competing with the real feature */}
      <div className="mt-5">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-ink-faint uppercase">{t.comingSoonLabel}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {OTHER_SECTIONS.map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => setNotice(t.tabComingSoon[key])}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-cream-deep px-3.5 py-2 text-xs font-medium text-ink-soft transition hover:bg-cream"
            >
              <Icon width={14} height={14} />
              {t.sections[key]}
            </button>
          ))}
        </div>
        {notice && <p className="mt-2 text-xs text-ink-faint">{notice}</p>}
      </div>

      {/* Chat — the real feature, front and center */}
      <div className="mt-6">
        <ChatBox hideHeader />
      </div>

      <p className="mt-6 text-center text-sm text-ink-faint italic">{t.quote}</p>
    </div>
  );
}

function ProgressStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 text-center">
      <span className="text-ink-faint">{icon}</span>
      <span className="text-sm font-semibold text-ink" dir="ltr">
        {value}
      </span>
      <span className="text-[10px] text-ink-faint">{label}</span>
    </div>
  );
}
