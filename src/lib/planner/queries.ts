import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { addDays, lastNDays, toDateKey } from "./dates";
import type { PlannerTask, StudyPlan } from "./types";

export async function getActivePlan(): Promise<StudyPlan | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[planner] getActivePlan:", error.message);
  return (data as StudyPlan | null) ?? null;
}

/**
 * Creates today's tasks for the plan if they don't exist yet and today is one
 * of the plan's active days. Safe to call on every page load — the unique
 * constraint on (plan_id, task_date, category) makes it idempotent.
 * There is no cron job in this project yet, so "a new day's tasks appear"
 * simply means "the first visit that day materializes them".
 */
export async function ensureTodayTasks(plan: StudyPlan): Promise<void> {
  const today = new Date();
  if (!plan.days_of_week.includes(today.getDay()) || plan.categories.length === 0) return;

  const supabase = await createClient();
  const minutesPerTask = Math.max(5, Math.round(plan.minutes_per_day / plan.categories.length));
  const rows = plan.categories.map((category) => ({
    user_id: plan.user_id,
    plan_id: plan.id,
    task_date: toDateKey(today),
    category,
    minutes: minutesPerTask,
  }));

  const { error } = await supabase
    .from("planner_tasks")
    .upsert(rows, { onConflict: "plan_id,task_date,category", ignoreDuplicates: true });
  if (error) console.error("[planner] ensureTodayTasks:", error.message);
}

export async function getTasksForDate(planId: string, date: Date): Promise<PlannerTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("planner_tasks")
    .select("*")
    .eq("plan_id", planId)
    .eq("task_date", toDateKey(date));
  if (error) console.error("[planner] getTasksForDate:", error.message);
  return (data as PlannerTask[] | null) ?? [];
}

/** Today's tasks for the signed-in user's active plan, or [] if there's no plan / nothing scheduled today. */
export async function getTodayTasks(): Promise<{ plan: StudyPlan | null; tasks: PlannerTask[] }> {
  const plan = await getActivePlan();
  if (!plan) return { plan: null, tasks: [] };
  await ensureTodayTasks(plan);
  return { plan, tasks: await getTasksForDate(plan.id, new Date()) };
}

/** Tasks for the last 7 days (oldest first), for the Planner page's weekly view. */
export async function getWeekTasks(planId: string): Promise<Record<string, PlannerTask[]>> {
  const supabase = await createClient();
  const days = lastNDays(7);
  const { data, error } = await supabase
    .from("planner_tasks")
    .select("*")
    .eq("plan_id", planId)
    .gte("task_date", toDateKey(days[0]))
    .lte("task_date", toDateKey(days[days.length - 1]));
  if (error) console.error("[planner] getWeekTasks:", error.message);

  const byDate: Record<string, PlannerTask[]> = {};
  for (const day of days) byDate[toDateKey(day)] = [];
  for (const task of (data as PlannerTask[] | null) ?? []) {
    (byDate[task.task_date] ??= []).push(task);
  }
  return byDate;
}

/**
 * Consecutive days up to and including today with at least one completed
 * task. Scans up to 60 days back — a plan-level record, not account-wide,
 * since Level/XP aren't wired up yet (PROJECT_CONTEXT §17, future work).
 */
export async function computeStreak(planId: string): Promise<number> {
  const supabase = await createClient();
  const since = addDays(new Date(), -60);
  const { data, error } = await supabase
    .from("planner_tasks")
    .select("task_date")
    .eq("plan_id", planId)
    .eq("is_done", true)
    .gte("task_date", toDateKey(since));
  if (error || !data) {
    if (error) console.error("[planner] computeStreak:", error.message);
    return 0;
  }

  const doneDates = new Set(data.map((r) => r.task_date as string));
  let streak = 0;
  let cursor = new Date();
  while (doneDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
