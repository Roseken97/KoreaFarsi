"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LEVELS, TASK_CATEGORIES, type PlanInput } from "./types";

export type PlannerResult = { ok: true } | { ok: false; error: "unauthenticated" | "invalid" | "generic" };

function validate(input: PlanInput) {
  if (!PLAN_LEVELS.includes(input.level)) return false;
  if (!Number.isFinite(input.minutesPerDay) || input.minutesPerDay < 5 || input.minutesPerDay > 180) return false;
  if (!Array.isArray(input.daysOfWeek) || input.daysOfWeek.length === 0 || input.daysOfWeek.some((d) => d < 0 || d > 6))
    return false;
  if (!Array.isArray(input.categories) || input.categories.length === 0 || !input.categories.every((c) => TASK_CATEGORIES.includes(c)))
    return false;
  return true;
}

/** Deactivates any existing plan and creates a new active one. Simpler than "editing" a plan, and matches how a learner actually thinks about it ("start a new plan"). */
export async function savePlan(input: PlanInput): Promise<PlannerResult> {
  if (!validate(input)) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const { error: deactivateError } = await supabase
    .from("study_plans")
    .update({ is_active: false })
    .eq("user_id", auth.user.id)
    .eq("is_active", true);
  if (deactivateError) return { ok: false, error: "generic" };

  const { error: insertError } = await supabase.from("study_plans").insert({
    user_id: auth.user.id,
    level: input.level,
    minutes_per_day: input.minutesPerDay,
    days_of_week: [...new Set(input.daysOfWeek)].sort(),
    categories: input.categories,
    goal: input.goal?.trim() || null,
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
