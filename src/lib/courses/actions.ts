"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { hasServiceRole, supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type VideoUrlResult = { ok: true; url: string } | { ok: false; error: "unauthenticated" | "forbidden" | "unavailable" | "generic" };

const VIDEO_URL_TTL_SECONDS = 60 * 60 * 6; // long enough to watch a full lesson without re-fetching

/** Signed video URL, gated by the same course-access rule as getCourseOutline (see queries.ts). */
export async function getCourseVideoUrl(lessonId: string): Promise<VideoUrlResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "unauthenticated" };
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  if (!hasServiceRole()) return { ok: false, error: "generic" };

  const admin = supabaseAdmin()!;
  const { data: lesson, error: lessonError } = await admin.from("course_lessons").select("video_path, course_id").eq("id", lessonId).single();
  if (lessonError || !lesson?.video_path) return { ok: false, error: "unavailable" };

  const { data: course } = await admin.from("courses").select("product_id").eq("id", lesson.course_id).single();
  if (course?.product_id) {
    const { data: entry } = await admin.from("user_library").select("id").eq("user_id", user.id).eq("product_id", course.product_id).maybeSingle();
    if (!entry) return { ok: false, error: "forbidden" };
  }

  const { data: signed, error: signError } = await admin.storage.from("courses").createSignedUrl(lesson.video_path, VIDEO_URL_TTL_SECONDS);
  if (signError || !signed) {
    console.error("[courses] failed to sign video URL:", signError?.message);
    return { ok: false, error: "generic" };
  }
  return { ok: true, url: signed.signedUrl };
}

export async function toggleLessonDone(lessonId: string, done: boolean, courseSlug: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false };

  const { error } = await supabase
    .from("lesson_progress")
    .upsert({ user_id: auth.user.id, lesson_id: lessonId, is_done: done, completed_at: done ? new Date().toISOString() : null }, { onConflict: "user_id,lesson_id" });
  if (error) {
    console.error("[courses] toggle progress:", error.message);
    return { ok: false };
  }
  revalidatePath(`/courses/${courseSlug}`);
  return { ok: true };
}
