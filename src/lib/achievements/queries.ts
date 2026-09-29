import "server-only";
import { computeStreak, getActivePlan } from "@/lib/planner/queries";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AchievementStats = { lessonsDone: number; libraryCount: number; reviewsCount: number; streak: number };

const EMPTY: AchievementStats = { lessonsDone: 0, libraryCount: 0, reviewsCount: 0, streak: 0 };

/** Real counts behind the Achievements badges — no separate "achievements" table, just derived from existing progress data. */
export async function getAchievementStats(): Promise<AchievementStats> {
  if (!isSupabaseConfigured) return EMPTY;
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return EMPTY;

  const [{ count: lessonsDone }, { count: libraryCount }, { count: reviewsCount }, plan] = await Promise.all([
    supabase.from("lesson_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_done", true),
    supabase.from("user_library").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("course_reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    getActivePlan(),
  ]);
  const streak = plan ? await computeStreak(plan.id) : 0;

  return { lessonsDone: lessonsDone ?? 0, libraryCount: libraryCount ?? 0, reviewsCount: reviewsCount ?? 0, streak };
}
