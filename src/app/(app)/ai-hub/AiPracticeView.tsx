"use client";

import Link from "next/link";
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { ChatBox } from "@/components/chat/ChatBox";
import {
  BellIcon,
  ChatBubbleIcon,
  CupIcon,
  DictionaryIcon,
  HeadphonesIcon,
  LayersIcon,
  MicIcon,
  PeopleIcon,
  PlaneIcon,
  RobotIcon,
  TargetIcon,
  TrophyIcon,
  WatchIcon,
} from "@/components/icons";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Notice } from "@/components/ui/Notice";
import type { AiPracticeStats } from "@/lib/ai-practice/queries";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import type { Profile } from "@/lib/profile";

type Tab = "speak" | "chat" | "listen" | "shadow" | "grammar";
type Level = "beginner" | "intermediate" | "advanced";

const TABS: { key: Tab; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "speak", Icon: MicIcon },
  { key: "chat", Icon: ChatBubbleIcon },
  { key: "listen", Icon: HeadphonesIcon },
  { key: "shadow", Icon: MicIcon },
  { key: "grammar", Icon: DictionaryIcon },
];

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

const MODE_CARDS = [
  { key: "freeConversation", Icon: ChatBubbleIcon },
  { key: "scenarioPractice", Icon: LayersIcon },
  { key: "pronunciationCoach", Icon: MicIcon },
  { key: "topicChallenge", Icon: TargetIcon },
] as const;

const RECOMMENDED = [
  { key: "cafe", Icon: CupIcon },
  { key: "airport", Icon: PlaneIcon },
  { key: "meetingPeople", Icon: PeopleIcon },
] as const;

export function AiPracticeView({ profile, stats, unreadCount }: { profile: Profile | null; stats: AiPracticeStats; unreadCount: number }) {
  const { m, locale } = useI18n();
  const t = m.aiPractice;
  const [tab, setTab] = useState<Tab>("speak");
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

      {/* Title + friendly AI character (sketch callout #2, #9) */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">{t.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t.subtitle}</p>
        </div>
        <div className="relative shrink-0 rounded-[20px] bg-sage-soft px-3.5 py-3">
          <span className="absolute -top-2.5 -end-1.5 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink shadow-soft" dir="ltr" lang="ko">
            {t.greeting}
          </span>
          <RobotIcon width={32} height={32} className="text-teal-deep" />
        </div>
      </div>

      {/* Tabs (callout #3) */}
      <div className="mt-5 flex gap-1 overflow-x-auto rounded-full bg-cream-deep p-1">
        {TABS.map(({ key, Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setNotice(null);
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${tab === key ? "bg-surface text-ink shadow-soft" : "text-ink-soft"}`}
          >
            <Icon width={15} height={15} />
            {t.tabs[key]}
          </button>
        ))}
      </div>

      {notice && (
        <div className="mt-4">
          <Notice>{notice}</Notice>
        </div>
      )}

      <div className="mt-5">
        {tab === "speak" && (
          <section>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">{t.speak.heading}</h2>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {m.courses.levels[l]}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{t.speak.body}</p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {MODE_CARDS.map(({ key, Icon }) => (
                <button
                  key={key}
                  onClick={() => setNotice(t.featureComingSoon)}
                  className="flex flex-col items-start gap-2 rounded-[18px] border border-line bg-surface p-3.5 text-start shadow-soft transition hover:bg-cream"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-sage-soft text-teal-deep">
                    <Icon width={17} height={17} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{t.speak.modes[key].title}</span>
                  <span className="text-[12px] leading-4 text-ink-faint">{t.speak.modes[key].body}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === "chat" && <ChatBox />}
        {tab === "listen" && <ComingSoonPanel Icon={HeadphonesIcon} text={t.tabComingSoon.listen} />}
        {tab === "shadow" && <ComingSoonPanel Icon={MicIcon} text={t.tabComingSoon.shadow} />}
        {tab === "grammar" && <ComingSoonPanel Icon={DictionaryIcon} text={t.tabComingSoon.grammar} />}
      </div>

      {tab !== "chat" && (
        <>
          {/* Recommended for You (callout #5) */}
          <section className="mt-7">
            <h2 className="font-display text-lg font-semibold">{t.recommended.title}</h2>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {RECOMMENDED.map(({ key, Icon }) => (
                <button
                  key={key}
                  onClick={() => setNotice(t.featureComingSoon)}
                  className="flex flex-col items-center gap-1.5 rounded-[16px] border border-line bg-surface p-3 text-center shadow-soft transition hover:bg-cream"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-blush-soft text-blush">
                    <Icon width={15} height={15} />
                  </span>
                  <span className="text-[12px] leading-4 font-semibold text-ink">{t.recommended.items[key].title}</span>
                  <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] text-ink-faint">{t.recommended.items[key].tag}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Your Progress (callout #6) — real conversation + badge counts, hours not tracked yet */}
          <section className="mt-7 rounded-[18px] bg-surface p-4 shadow-soft">
            <h2 className="font-display text-base font-semibold">{t.progress.title}</h2>
            <div className="mt-3 grid grid-cols-3 divide-x divide-line">
              <ProgressStat icon={<ChatBubbleIcon width={18} height={18} />} value={formatNumber(stats.conversations, locale)} label={t.progress.conversations} />
              <ProgressStat icon={<WatchIcon width={18} height={18} />} value="—" label={t.progress.hours} />
              <ProgressStat icon={<TrophyIcon width={18} height={18} />} value={formatNumber(stats.badges, locale)} label={t.progress.badges} />
            </div>
          </section>

          <p className="mt-6 text-center text-sm text-ink-faint italic">{t.quote}</p>
        </>
      )}
    </div>
  );
}

function ComingSoonPanel({ Icon, text }: { Icon: ComponentType<SVGProps<SVGSVGElement>>; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-8 text-center shadow-soft">
      <span className="grid size-14 place-items-center rounded-full bg-sage-soft text-teal-deep">
        <Icon width={26} height={26} />
      </span>
      <p className="max-w-xs text-sm text-ink-soft">{text}</p>
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
