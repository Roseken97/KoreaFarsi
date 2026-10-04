"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LEVELS, TASK_CATEGORIES, type PlanInput } from "./types";

export type PlannerResult = { ok: true } | { ok: false; error: "unauthenticated" | "invalid" | "generic" };

function validate(input: PlanInput) {
  if (!PLAN_LEVELS.includes(input.level)) return false;
  if (!Array.isArray(input.courseIds) || input.courseIds.length === 0) return false;
  if (!Number.isFinite(input.hoursPerWeek) || input.hoursPerWeek <= 0 || input.hoursPerWeek > 80) return false;
  if (!Array.isArray(input.daysOfWeek) || input.daysOfWeek.length === 0 || input.daysOfWeek.some((d) => d < 0 || d > 6))
    return false;
  if (!Array.isArray(input.categories) || input.categories.length === 0 || !input.categories.every((c) => TASK_CATEGORIES.includes(c)))
    return false;
  return true;
}

/**
 * Deactivates any existing plan and creates a new active one. Simpler than
 * "editing" a plan, and matches how a learner actually thinks about it
 * ("start a new plan"). The pace (minutes/day) and estimated finish date come
 * from the learner's own inputs: total remaining minutes across the chosen
 * courses, divided by how many hours/week they committed to.
 */
export async function savePlan(input: PlanInput): Promise<PlannerResult> {
  if (!validate(input)) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const { data: lessonRows } = await supabase.from("course_lessons").select("duration_minutes").in("course_id", input.courseIds);
  const totalMinutes = (lessonRows ?? []).reduce((sum, r) => sum + (r.duration_minutes ?? 0), 0);

  const daysOfWeek = [...new Set(input.daysOfWeek)].sort();
  const minutesPerWeek = input.hoursPerWeek * 60;
  const minutesPerDay = Math.max(5, Math.round(minutesPerWeek / daysOfWeek.length));
  const weeksToFinish = totalMinutes > 0 ? Math.max(1, Math.ceil(totalMinutes / minutesPerWeek)) : null;
  const targetDate = weeksToFinish ? new Date(Date.now() + weeksToFinish * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : null;

  const { error: deactivateError } = await supabase
    .from("study_plans")
    .update({ is_active: false })
    .eq("user_id", auth.user.id)
    .eq("is_active", true);
  if (deactivateError) return { ok: false, error: "generic" };

  const { error: insertError } = await supabase.from("study_plans").insert({
    user_id: auth.user.id,
    level: input.level,
    course_ids: input.courseIds,
    hours_per_week: input.hoursPerWeek,
    minutes_per_day: minutesPerDay,
    days_of_week: daysOfWeek,
    categories: input.categories,
    goal: input.goal?.trim() || null,
    target_date: targetDate,
  });
  if (insertError) return { ok: false, error: "generic" };

  revalidatePath("/planner");
  revalidatePath("/home");
  return { ok: true };
}

export async function toggleTask(taskId: string, done: boolean): Promise<PlannerResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  // RLS also enforces this, but checking user_id explicitly keeps the intent obvious here.
  const { error } = await supabase
    .from("planner_tasks")
    .update({ is_done: done, completed_at: done ? new Date().toISOString() : null })
    .eq("id", taskId)
    .eq("user_id", auth.user.id);
  if (error) return { ok: false, error: "generic" };

  revalidatePath("/planner");
  revalidatePath("/home");
  return { ok: true };
}
