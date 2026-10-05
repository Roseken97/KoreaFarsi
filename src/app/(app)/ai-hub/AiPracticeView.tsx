"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ChatBox } from "@/components/chat/ChatBox";
import { BellIcon, ChatBubbleIcon, DictionaryIcon, HeadphonesIcon, MicIcon, TrophyIcon, WatchIcon } from "@/components/icons";
import { FloatingMascot } from "@/components/ai-hub/FloatingMascot";
import { PracticeCarousel, type PracticeCard } from "@/components/ai-hub/PracticeCarousel";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import type { AiPracticeStats } from "@/lib/ai-practice/queries";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import type { Profile } from "@/lib/profile";

type OtherSection = "speak" | "listen" | "shadow" | "grammar";
type Level = "beginner" | "intermediate" | "advanced";

const OTHER_SECTIONS: { key: OtherSection; Icon: PracticeCard["Icon"]; bg: string; text: string }[] = [
  { key: "speak", Icon: MicIcon, bg: "bg-coral-soft", text: "text-coral-deep" },
  { key: "listen", Icon: HeadphonesIcon, bg: "bg-sky-soft", text: "text-sky-deep" },
  { key: "shadow", Icon: MicIcon, bg: "bg-violet-soft", text: "text-violet-deep" },
  { key: "grammar", Icon: DictionaryIcon, bg: "bg-gold-soft", text: "text-gold-deep" },
];

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

/**
 * AI Practice. A floating mascot hero sits above a colored carousel of
 * practice "spaces" — Chat is the one that's real (its card scrolls down to
 * the actual ChatBox below); the rest surface the same coming-soon notice as
 * before, just inside the new card language instead of a plain chip row.
 */
export function AiPracticeView({ profile, stats, unreadCount }: { profile: Profile | null; stats: AiPracticeStats; unreadCount: number }) {
  const { m, locale } = useI18n();
  const t = m.aiPractice;
  const [level, setLevel] = useState<Level>("beginner");
  const [notice, setNotice] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const cards: PracticeCard[] = [
    { key: "chat", label: t.sections.chat, Icon: ChatBubbleIcon, bg: "bg-teal-mist", text: "text-teal-deep" },
    ...OTHER_SECTIONS.map(({ key, Icon, bg, text }) => ({ key, label: t.sections[key], Icon, bg, text })),
  ];

  function onSelectCard(key: string) {
    setActiveCard(key);
    if (key === "chat") {
      setNotice(null);
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setNotice(t.tabComingSoon[key as OtherSection]);
    }
  }

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

      {/* Floating mascot hero */}
      <div className="relative flex flex-col items-center gap-1 pt-1 pb-3 text-center">
        <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-ink shadow-soft" dir="ltr" lang="ko">
          {t.greeting}
        </span>
        <FloatingMascot size={120} />
        <h1 className="font-display text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-ink-soft">{t.subtitle}</p>
      </div>

      {/* Practice spaces — colored floating carousel; tapping one "enters" that space */}
      <PracticeCarousel cards={cards} active={activeCard} onSelect={onSelectCard} />
      {notice && <p className="mt-2 text-center text-xs text-ink-faint">{notice}</p>}

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

      {/* Chat — the real feature, front and center */}
      <div ref={chatRef} className="mt-6 scroll-mt-6">
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
