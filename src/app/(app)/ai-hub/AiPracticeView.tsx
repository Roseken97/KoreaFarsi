"use client";

import { ArcCarousel, type ArcCard } from "@/components/ai-hub/ArcCarousel";
import { ChatBubbleIcon, DictionaryIcon, HeadphonesIcon, MicIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

const SECTION_STYLE: Record<string, Pick<ArcCard, "Icon" | "bg" | "text" | "korean" | "live">> = {
  chat: { Icon: ChatBubbleIcon, bg: "bg-gradient-to-br from-purple-600 to-purple-800", text: "text-purple-100", korean: "채팅", live: true },
  speak: { Icon: MicIcon, bg: "bg-gradient-to-br from-violet-600 to-violet-800", text: "text-violet-100", korean: "말하기", live: false },
  listen: { Icon: HeadphonesIcon, bg: "bg-gradient-to-br from-purple-700 to-slate-900", text: "text-purple-100", korean: "듣기", live: false },
  shadow: { Icon: MicIcon, bg: "bg-gradient-to-br from-indigo-600 to-purple-800", text: "text-indigo-100", korean: "섀도잉", live: false },
  grammar: { Icon: DictionaryIcon, bg: "bg-gradient-to-br from-purple-600 to-indigo-800", text: "text-purple-100", korean: "문법", live: false },
};

/**
 * AI Hub: immersive dark carousel experience with premium purple/lavender aesthetic.
 * Each card's own page lives under /ai-hub/<key>.
 */
export function AiPracticeView() {
  const { m, locale } = useI18n();
  const nf = new Intl.NumberFormat(locale);
  const t = m.aiPractice;

  const cards: ArcCard[] = (["chat", "speak", "listen", "shadow", "grammar"] as const).map((key) => ({
    key,
    label: t.sections[key],
    href: `/ai-hub/${key}`,
    ...SECTION_STYLE[key],
  }));

  return (
    <div className="animate-fade-up flex w-full h-dvh flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <ArcCarousel cards={cards} labels={t.card} formatNumber={(n) => nf.format(n)} />
      </div>
    </div>
  );
}
