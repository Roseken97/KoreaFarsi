"use client";

import { HubCarousel } from "@/components/ai-hub/HubCarousel";
import type { HubCardData } from "@/components/ai-hub/HubCard";
import { ChatBubbleIcon, DictionaryIcon, HeadphonesIcon, MicIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

type SectionKey = "chat" | "speak" | "listen" | "shadow" | "grammar";

/** Per-mode look: Korean name, icon, and the pastel studio backdrop (plus an optional warm floor) of its image card. */
const SECTION_STYLE: Record<SectionKey, Omit<HubCardData, "key" | "label" | "href">> = {
  chat: {
    korean: "채팅",
    Icon: ChatBubbleIcon,
    live: true,
    backdrop: "bg-[radial-gradient(120%_80%_at_30%_15%,#f4f2f9_0%,#d9d5e6_55%,#bfb9d1_100%)]",
  },
  speak: {
    korean: "말하기",
    Icon: MicIcon,
    live: false,
    backdrop: "bg-[radial-gradient(120%_80%_at_30%_15%,#f7eef2_0%,#e3d2dc_55%,#cdb7c6_100%)]",
  },
  listen: {
    korean: "듣기",
    Icon: HeadphonesIcon,
    live: false,
    backdrop: "bg-[radial-gradient(120%_80%_at_30%_15%,#eef1f8_0%,#d3d9e8_55%,#b9c1d6_100%)]",
  },
  shadow: {
    korean: "섀도잉",
    Icon: MicIcon,
    live: false,
    backdrop: "bg-[radial-gradient(120%_80%_at_30%_15%,#f2f0f7_0%,#dcd8e6_60%,#cbc5d8_100%)]",
    floor: "bg-gradient-to-b from-[#efd9b8] to-[#d9b88c]",
  },
  grammar: {
    korean: "문법",
    Icon: DictionaryIcon,
    live: false,
    backdrop: "bg-[radial-gradient(120%_80%_at_30%_15%,#eef4f1_0%,#d3e0da_55%,#b8cbc2_100%)]",
  },
};

/**
 * AI Hub: a pastel-lavender stage holding the practice modes as soft 3D mobile cards.
 * Each card's own page lives under /ai-hub/<key>.
 */
export function AiPracticeView() {
  const { m, locale } = useI18n();
  const t = m.aiPractice;
  const nf = new Intl.NumberFormat(locale);

  const cards: HubCardData[] = (Object.keys(SECTION_STYLE) as SectionKey[]).map((key) => ({
    key,
    label: t.sections[key],
    href: `/ai-hub/${key}`,
    ...SECTION_STYLE[key],
  }));

  return (
    <div className="animate-fade-up -mx-4 -mt-6 -mb-32 min-h-dvh bg-[linear-gradient(180deg,#e4dceb_0%,#d5cbdf_55%,#cabed6_100%)] pt-8 pb-32 sm:-mx-6 md:mx-0 md:mt-0 md:mb-0 md:min-h-[calc(100dvh-5rem)] md:rounded-[40px] md:pt-10 md:pb-10">
      <header className="px-6 text-center">
        <h1 className="text-[26px] font-bold leading-tight text-[#2b2834]">{t.title}</h1>
        <p className="mt-1 text-sm text-[#2b2834]/60">{t.subtitle}</p>
      </header>
      <div className="mt-4">
        <HubCarousel
          cards={cards}
          labels={t.card}
          formatNumber={(n) => nf.format(n)}
          nav={{ prev: t.card.prev, next: t.card.next, goTo: t.card.goTo }}
        />
      </div>
    </div>
  );
}
