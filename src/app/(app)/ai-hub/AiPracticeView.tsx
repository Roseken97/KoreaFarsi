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
 * AI Hub landing: just the floating character + a semicircular carousel of
 * the 5 practice "spaces". No title, stats, or chip row — Rose asked for
 * everything else removed. Each card's own page (incl. the real Chat) lives
 * under /ai-hub/<key>.
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
    <div className="animate-fade-up flex max-w-2xl flex-col items-center">
      <PageHeader />
      <div className="mt-6 mb-2">
        <FloatingRobotIcon size={96} />
      </div>
      <ArcCarousel cards={cards} />
    </div>
  );
}
