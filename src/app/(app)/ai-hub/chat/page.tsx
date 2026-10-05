import type { Metadata } from "next";
import { ChatBubbleIcon, TrophyIcon, WatchIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getAiPracticeStats } from "@/lib/ai-practice/queries";
import { getMessages } from "@/lib/i18n/server";
import { formatNumber } from "@/lib/i18n/config";
import { ChatBox } from "@/components/chat/ChatBox";
import type { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.aiPractice.sections.chat };
}

/** The one real AI Hub section — the working chat assistant, plus the real progress numbers. */
export default async function AiHubChatPage() {
  const [{ m, locale }, stats] = await Promise.all([getMessages(), getAiPracticeStats()]);
  const t = m.aiPractice;

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={t.sections.chat} backHref="/ai-hub" backLabel={t.title} />

      <section className="mb-5 rounded-card bg-surface p-4 shadow-soft">
        <h2 className="font-display text-base font-semibold">{t.progress.title}</h2>
        <div className="mt-3 grid grid-cols-3 divide-x divide-line">
          <ProgressStat icon={<ChatBubbleIcon width={18} height={18} />} value={formatNumber(stats.conversations, locale)} label={t.progress.conversations} />
          <ProgressStat icon={<WatchIcon width={18} height={18} />} value="—" label={t.progress.hours} />
          <ProgressStat icon={<TrophyIcon width={18} height={18} />} value={formatNumber(stats.badges, locale)} label={t.progress.badges} />
        </div>
      </section>

      <ChatBox hideHeader />

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
