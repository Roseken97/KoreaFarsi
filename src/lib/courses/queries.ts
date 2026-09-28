import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { Course, CourseOutline, CourseUnit, CourseLesson, CourseResource, CourseReview, UnitWithLessons } from "./types";
import { flattenLessons } from "./types";

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[courses] list:", error.message);
    return [];
  }
  return (data ?? []) as Course[];
}

/** Lesson counts per course, for the course list cards (avoids fetching every lesson's full row). */
export async function getCourseLessonCounts(courseIds: string[]): Promise<Record<string, number>> {
  if (!isSupabaseConfigured || courseIds.length === 0) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("course_lessons").select("course_id").in("course_id", courseIds);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) counts[row.course_id] = (counts[row.course_id] ?? 0) + 1;
  return counts;
}

/** Whether the signed-in user (if any) can watch this course's videos. */
async function checkAccess(courseProductId: string | null, userId: string | null) {
  if (!courseProductId) return Boolean(userId); // open course: any signed-in user
  if (!userId) return false;
  const supabase = await createClient();
  const { data } = await supabase.from("user_library").select("id").eq("user_id", userId).eq("product_id", courseProductId).maybeSingle();
  return Boolean(data);
}

export async function getCourseOutline(slug: string): Promise<CourseOutline | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const [{ data: course }, user] = await Promise.all([
    supabase.from("courses").select("*").eq("slug", slug).eq("is_available", true).maybeSingle(),
    getCurrentUser(),
  ]);
  if (!course) return null;

  const [{ data: units }, { data: lessons }, hasAccess] = await Promise.all([
    supabase.from("course_units").select("*").eq("course_id", course.id).order("sort_order", { ascending: true }),
    supabase.from("course_lessons").select("*").eq("course_id", course.id).order("sort_order", { ascending: true }),
    checkAccess((course as Course).product_id, user?.id ?? null),
  ]);

  const grouped: UnitWithLessons[] = ((units ?? []) as CourseUnit[]).map((u) => ({
    ...u,
    lessons: ((lessons ?? []) as CourseLesson[]).filter((l) => l.unit_id === u.id),
  }));

  let progress: Record<string, boolean> = {};
  if (user) {
    const lessonIds = (lessons ?? []).map((l) => l.id);
    if (lessonIds.length > 0) {
      const { data: rows } = await supabase.from("lesson_progress").select("lesson_id, is_done").eq("user_id", user.id).in("lesson_id", lessonIds);
      progress = Object.fromEntries((rows ?? []).map((r) => [r.lesson_id, r.is_done]));
    }
  }

  return { course: course as Course, units: grouped, hasAccess, progress };
}

export type ContinueCard = { course: Course; nextLessonId: string | null; done: number; total: number };

/**
 * Home's "Continue Your Journey" card. Phase 2 scope: points at the first
 * available course rather than tracking true cross-course "last accessed" —
 * fine while the catalog is small, worth revisiting once there are many courses.
 */
export async function getContinueCard(): Promise<ContinueCard | null> {
  const courses = await getCourses();
  const course = courses[0];
  if (!course) return null;
  const outline = await getCourseOutline(course.slug);
  if (!outline) return { course, nextLessonId: null, done: 0, total: 0 };
  const flat = flattenLessons(outline.units);
  const done = flat.filter((l) => outline.progress[l.id]).length;
  const next = flat.find((l) => !outline.progress[l.id]) ?? flat[0] ?? null;
  return { course, nextLessonId: next?.id ?? null, done, total: flat.length };
}

/** Resources tab: metadata only — the file itself needs a signed URL from getCourseResourceUrl (actions.ts). */
export async function getCourseResources(courseId: string): Promise<CourseResource[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("course_resources").select("*").eq("course_id", courseId).order("sort_order", { ascending: true });
  if (error) {
    console.error("[courses] resources:", error.message);
    return [];
  }
  return (data ?? []) as CourseResource[];
}

export async function getCourseReviews(courseId: string): Promise<CourseReview[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("course_reviews").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
  if (error) {
    console.error("[courses] reviews:", error.message);
    return [];
  }
  return (data ?? []) as CourseReview[];
}

export async function getLessonWithCourse(courseSlug: string, lessonId: string) {
  const outline = await getCourseOutline(courseSlug);
  if (!outline) return null;
  const lesson = outline.units.flatMap((u) => u.lessons).find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { outline, lesson };
}
