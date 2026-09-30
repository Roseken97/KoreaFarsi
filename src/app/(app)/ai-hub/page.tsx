import type { Metadata } from "next";
import { getAiPracticeStats } from "@/lib/ai-practice/queries";
import { getMessages } from "@/lib/i18n/server";
import { getUnreadNotificationCount } from "@/lib/notifications/queries";
import { getProfile } from "@/lib/profile";
import { AiPracticeView } from "./AiPracticeView";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.aiPractice.metaTitle };
}

/**
 * AI Practice (sketch 12). Chat is real (the existing KoreaFarsi AI text
 * assistant); Speak/Listen/Shadow/Grammar are the UX/structure only for now —
 * per Rose, the voice engine behind them is a later, separately-scoped build.
 */
export default async function AiHubPage() {
  const [profile, stats, unreadCount] = await Promise.all([getProfile(), getAiPracticeStats(), getUnreadNotificationCount()]);

  return <AiPracticeView profile={profile} stats={stats} unreadCount={unreadCount} />;
}
