import "server-only";
import { countUnlockedBadges } from "@/lib/achievements/definitions";
import { getAchievementStats } from "@/lib/achievements/queries";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export type AiPracticeStats = { conversations: number; badges: number };

/** "Your Progress" numbers: real conversation count (distinct chat sessions) + the same badge count as Achievements. Hours aren't tracked yet. */
export async function getAiPracticeStats(): Promise<AiPracticeStats> {
  const [user, admin, achievementStats] = await Promise.all([getCurrentUser(), Promise.resolve(supabaseAdmin()), getAchievementStats()]);

  let conversations = 0;
  if (user && admin) {
    const { data } = await admin.from("chat_messages").select("session_id").eq("user_id", user.id).eq("role", "user");
    conversations = new Set((data ?? []).map((r) => r.session_id as string)).size;
  }

  return { conversations, badges: countUnlockedBadges(achievementStats) };
}
