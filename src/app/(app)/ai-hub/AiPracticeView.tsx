"use client";

import { ArcCarousel, type ArcCard } from "@/components/ai-hub/ArcCarousel";
import { FloatingRobotIcon } from "@/components/ai-hub/FloatingRobotIcon";
import { ChatBubbleIcon, DictionaryIcon, HeadphonesIcon, MicIcon } from "@/components/icons";
import { PageHeader } from "@/components/shell/PageHeader";
import { useI18n } from "@/lib/i18n/client";

const SECTION_STYLE: Record<string, { Icon: ArcCard["Icon"]; bg: string; text: string }> = {
  chat: { Icon: ChatBubbleIcon, bg: "bg-teal-mist", text: "text-teal-deep" },
  speak: { Icon: MicIcon, bg: "bg-coral-soft", text: "text-coral-deep" },
  listen: { Icon: HeadphonesIcon, bg: "bg-sky-soft", text: "text-sky-deep" },
  shadow: { Icon: MicIcon, bg: "bg-violet-soft", text: "text-violet-deep" },
  grammar: { Icon: DictionaryIcon, bg: "bg-gold-soft", text: "text-gold-deep" },
};

/**
 * AI Hub landing: floating character + large infinite carousel with modern card design.
 * Each card's own page lives under /ai-hub/<key>.
 */
export function AiPracticeView() {
  const { m } = useI18n();
  const t = m.aiPractice;

  const cards: ArcCard[] = (["chat", "speak", "listen", "shadow", "grammar"] as const).map((key) => ({
    key,
    label: t.sections[key],
    href: `/ai-hub/${key}`,
    ...SECTION_STYLE[key],
  }));

  return (
    <div className="animate-fade-up flex w-full flex-col items-center py-6">
      <PageHeader />
      <div className="mt-8 mb-12">
        <FloatingRobotIcon size={96} />
      </div>
      <div className="w-full px-4 sm:px-6 max-w-4xl">
        <ArcCarousel cards={cards} />
      </div>
    </div>
  );
}
