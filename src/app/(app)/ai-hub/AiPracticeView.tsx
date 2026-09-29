"use client";

import Link from "next/link";
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { ChatBox } from "@/components/chat/ChatBox";
import { BellIcon, ChatBubbleIcon, ChevronIcon, DictionaryIcon, HeadphonesIcon, MicIcon, RobotIcon, TrophyIcon, WatchIcon } from "@/components/icons";
import { HeaderIconLink, PageHeader } from "@/components/shell/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import type { AiPracticeStats } from "@/lib/ai-practice/queries";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import type { Profile } from "@/lib/profile";

type Section = "chat" | "speak" | "listen" | "shadow" | "grammar";
type Level = "beginner" | "intermediate" | "advanced";

const OTHER_SECTIONS: { key: Exclude<Section, "chat">; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "speak", Icon: MicIcon },
  { key: "listen", Icon: HeadphonesIcon },
  { key: "shadow", Icon: MicIcon },
  { key: "grammar", Icon: DictionaryIcon },
];

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

export function AiPracticeView({ profile, stats, unreadCount }: { profile: Profile | null; stats: AiPracticeStats; unreadCount: number }) {
  const { m, locale } = useI18n();
  const t = m.aiPractice;
  const [selected, setSelected] = useState<Section>("chat");
  const [level, setLevel] = useState<Level>("beginner");

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
        <div className="relative shrink-0 rounded-[20px] bg-sage-soft px-3.5 py-3">
          <span className="absolute -top-2.5 -end-1.5 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink shadow-soft" dir="ltr" lang="ko">
            {t.greeting}
          </span>
          <RobotIcon width={32} height={32} className="text-teal-deep" />
        </div>
      </div>

      {/* Chat — the one real, working section — as a wide horizontal card */}
      <button
        onClick={() => setSelected("chat")}
        className={`mt-5 flex w-full items-center gap-3 rounded-[20px] border bg-surface p-4 text-start shadow-soft transition ${selected === "chat" ? "border-teal ring-2 ring-teal/20" : "border-line hover:bg-cream"}`}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal text-white">
          <ChatBubbleIcon width={20} height={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-ink">{t.sections.chat}</span>
          <span className="block truncate text-[12px] text-ink-faint">{t.chatCardBody}</span>
        </span>
        <ChevronIcon width={16} height={16} className="shrink-0 text-ink-faint rtl:-scale-x-100" />
      </button>

      {/* Speak / Listen / Shadow / Grammar — same design, not yet functional */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {OTHER_SECTIONS.map(({ key, Icon }) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`flex flex-col items-start gap-2 rounded-[18px] border bg-surface p-3.5 text-start shadow-soft transition ${selected === key ? "border-teal ring-2 ring-teal/20" : "border-line hover:bg-cream"}`}
          >
            <span className="grid size-9 place-items-center rounded-full bg-sage-soft text-teal-deep">
              <Icon width={17} height={17} />
            </span>
            <span className="text-sm font-semibold text-ink">{t.sections[key]}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        {selected === "chat" ? (
          <ChatBox />
        ) : (
          <ComingSoonPanel Icon={OTHER_SECTIONS.find((s) => s.key === selected)!.Icon} text={t.tabComingSoon[selected]} />
        )}
      </div>

      {selected !== "chat" && (
        <section className="mt-7 rounded-[18px] bg-surface p-4 shadow-soft">
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
      )}

      {selected !== "chat" && <p className="mt-6 text-center text-sm text-ink-faint italic">{t.quote}</p>}
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
