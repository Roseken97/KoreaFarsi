"use client";

import { ArcCarousel, type ArcCard } from "@/components/ai-hub/ArcCarousel";
import { MODE_ILLUSTRATIONS } from "@/components/ai-hub/ModeIllustrations";
import { ChatBubbleIcon, DictionaryIcon, HeadphonesIcon, MicIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

const SECTION_STYLE: Record<string, Pick<ArcCard, "Icon" | "bg" | "text" | "korean" | "live" | "Illustration">> = {
  chat: { Icon: ChatBubbleIcon, bg: "bg-gradient-to-br from-[#a07ccc] to-[#6a479e]", text: "text-white", korean: "채팅", live: true, Illustration: MODE_ILLUSTRATIONS.chat },
  speak: { Icon: MicIcon, bg: "bg-gradient-to-br from-[#7690ea] to-[#3a4a93]", text: "text-white", korean: "말하기", live: false, Illustration: MODE_ILLUSTRATIONS.speak },
  listen: { Icon: HeadphonesIcon, bg: "bg-gradient-to-br from-[#e98a8f] to-[#a2434d]", text: "text-white", korean: "듣기", live: false, Illustration: MODE_ILLUSTRATIONS.listen },
  shadow: { Icon: MicIcon, bg: "bg-gradient-to-br from-[#4fb89b] to-[#1f6e5c]", text: "text-white", korean: "섀도잉", live: false, Illustration: MODE_ILLUSTRATIONS.shadow },
  grammar: { Icon: DictionaryIcon, bg: "bg-gradient-to-br from-[#d99a4f] to-[#8a5612]", text: "text-white", korean: "문법", live: false, Illustration: MODE_ILLUSTRATIONS.grammar },
};

/**
 * AI Hub: immersive dark carousel experience with premium purple/lavender aesthetic.
 * Each card's own page lives under /ai-hub/<key>; each card shows an illustration of its mode.
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
    <div className="animate-fade-up flex w-full h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <ArcCarousel cards={cards} labels={t.card} formatNumber={(n) => nf.format(n)} />
      </div>
    </div>
  );
}
