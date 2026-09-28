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

const RESOURCE_URL_TTL_SECONDS = 60 * 10;

/** Signed download URL for a Resources-tab file, gated the same way lesson video access is. */
export async function getCourseResourceUrl(resourceId: string): Promise<VideoUrlResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "unauthenticated" };
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  if (!hasServiceRole()) return { ok: false, error: "generic" };

  const admin = supabaseAdmin()!;
  const { data: resource, error: resourceError } = await admin.from("course_resources").select("file_path, course_id").eq("id", resourceId).single();
  if (resourceError || !resource?.file_path) return { ok: false, error: "unavailable" };

  const { data: course } = await admin.from("courses").select("product_id").eq("id", resource.course_id).single();
  if (course?.product_id) {
    const { data: entry } = await admin.from("user_library").select("id").eq("user_id", user.id).eq("product_id", course.product_id).maybeSingle();
    if (!entry) return { ok: false, error: "forbidden" };
  }

  const { data: signed, error: signError } = await admin.storage.from("courses").createSignedUrl(resource.file_path, RESOURCE_URL_TTL_SECONDS);
  if (signError || !signed) {
    console.error("[courses] failed to sign resource URL:", signError?.message);
    return { ok: false, error: "generic" };
  }
  return { ok: true, url: signed.signedUrl };
}

export type ReviewResult = { ok: true } | { ok: false; error: "unauthenticated" | "forbidden" | "generic" };

/** Create/update the signed-in user's own review for a course (unique per user+course). Requires the same access as watching its lessons. */
export async function submitCourseReview(courseId: string, courseSlug: string, rating: number, comment: string): Promise<ReviewResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const { data: course } = await supabase.from("courses").select("product_id").eq("id", courseId).maybeSingle();
  if (course?.product_id) {
    const { data: entry } = await supabase.from("user_library").select("id").eq("user_id", auth.user.id).eq("product_id", course.product_id).maybeSingle();
    if (!entry) return { ok: false, error: "forbidden" };
  }

  const { data: profile } = await supabase.from("profiles").select("name, avatar_key").eq("id", auth.user.id).maybeSingle();

  const { error } = await supabase.from("course_reviews").upsert(
    {
      course_id: courseId,
      user_id: auth.user.id,
      reviewer_name: profile?.name ?? null,
      reviewer_avatar_key: profile?.avatar_key ?? null,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      comment: comment.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_id,user_id" },
  );
  if (error) {
    console.error("[courses] submit review:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidatePath(`/courses/${courseSlug}`);
  return { ok: true };
}

export async function deleteCourseReview(courseId: string, courseSlug: string): Promise<ReviewResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };
  const { error } = await supabase.from("course_reviews").delete().eq("course_id", courseId).eq("user_id", auth.user.id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/courses/${courseSlug}`);
  return { ok: true };
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
