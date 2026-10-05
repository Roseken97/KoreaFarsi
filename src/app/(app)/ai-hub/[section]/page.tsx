import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DictionaryIcon, HeadphonesIcon, MicIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getMessages } from "@/lib/i18n/server";

const SECTIONS = ["speak", "listen", "shadow", "grammar"] as const;
type Section = (typeof SECTIONS)[number];

function isSection(v: string): v is Section {
  return (SECTIONS as readonly string[]).includes(v);
}

const SECTION_ICON: Record<Section, typeof MicIcon> = {
  speak: MicIcon,
  listen: HeadphonesIcon,
  shadow: MicIcon,
  grammar: DictionaryIcon,
};

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const { m } = await getMessages();
  return { title: isSection(section) ? m.aiPractice.sections[section] : "AI Practice" };
}

/** Not-yet-built AI Hub sections (Speak/Listen/Shadow/Grammar) — same coming-soon copy as before, now its own page instead of a notice under the hub. */
export default async function AiHubSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();

  const { m } = await getMessages();
  const t = m.aiPractice;
  const Icon = SECTION_ICON[section];

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={t.sections[section]} backHref="/ai-hub" backLabel={t.title} />
      <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-10 text-center shadow-soft">
        <span className="grid size-16 place-items-center rounded-full bg-cream-deep text-ink-soft">
          <Icon width={28} height={28} />
        </span>
        <p className="text-sm text-ink-soft">{t.tabComingSoon[section]}</p>
      </div>
    </div>
  );
}
