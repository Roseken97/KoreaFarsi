"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { hasServiceRole, supabaseAdmin } from "@/lib/supabase/admin";
import type { Course, CourseLesson, CourseResource, CourseSkill, CourseUnit, SlideContent, VocabularyEntry } from "./types";

export type AdminResult = { ok: true } | { ok: false; error: "forbidden" | "slug" | "title" | "generic" };
export type UploadTicketResult = { ok: true; path: string; token: string; bucket: "courses" } | { ok: false; error: "forbidden" | "generic" };

async function guard() {
  const [admin, store] = [await getAdminUser(), supabaseAdmin()];
  return admin && store ? store : null;
}

export async function listCoursesAdmin(): Promise<Course[]> {
  const store = await guard();
  if (!store) return [];
  const { data, error } = await store.from("courses").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/courses] list:", error.message);
    return [];
  }
  return (data ?? []) as Course[];
}

/** For the "link to a purchasable product" dropdown — only 'course' category products make sense here. */
export async function listCourseProductsAdmin(): Promise<{ id: string; slug: string; title: string }[]> {
  const store = await guard();
  if (!store) return [];
  const { data } = await store.from("products").select("id, slug, title").eq("category", "course").order("title", { ascending: true });
  return data ?? [];
}

export async function getCourseForAdmin(id: string) {
  const store = await guard();
  if (!store) return null;
  const [{ data: course }, { data: units }, { data: lessons }, { data: resources }] = await Promise.all([
    store.from("courses").select("*").eq("id", id).maybeSingle(),
    store.from("course_units").select("*").eq("course_id", id).order("sort_order", { ascending: true }),
    store.from("course_lessons").select("*").eq("course_id", id).order("sort_order", { ascending: true }),
    store.from("course_resources").select("*").eq("course_id", id).order("sort_order", { ascending: true }),
  ]);
  if (!course) return null;
  return {
    course: course as Course,
    units: (units ?? []) as CourseUnit[],
    lessons: (lessons ?? []) as CourseLesson[],
    resources: (resources ?? []) as CourseResource[],
  };
}

export async function createVideoUploadTicket(courseSlug: string, fileName: string): Promise<UploadTicketResult> {
  if (!(await getAdminUser())) return { ok: false, error: "forbidden" };
  if (!hasServiceRole()) return { ok: false, error: "generic" };
  const admin = supabaseAdmin()!;
  const safeName = fileName.replace(/[^\w.\-]+/g, "_").slice(-120);
  const path = `${courseSlug}/${Date.now()}-${safeName}`;
  const { data, error } = await admin.storage.from("courses").createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[admin/courses] upload ticket:", error?.message);
    return { ok: false, error: "generic" };
  }
  return { ok: true, path: data.path, token: data.token, bucket: "courses" };
}

export type CourseInput = {
  id: string | null;
  slug: string;
  product_id: string | null;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  level: string;
  cover_image_url: string | null;
  is_available: boolean;
  sort_order: number;
  skills: CourseSkill[];
};

export async function saveCourse(input: CourseInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
  const title = input.title.trim();
  if (!slug) return { ok: false, error: "slug" };
  if (!title) return { ok: false, error: "title" };

  const row = {
    slug,
    product_id: input.product_id,
    title,
    title_en: input.title_en.trim() || null,
    description: input.description.trim() || null,
    description_en: input.description_en.trim() || null,
    level: input.level.trim() || null,
    cover_image_url: input.cover_image_url,
    is_available: input.is_available,
    sort_order: input.sort_order,
    skills: input.skills,
  };

  const { error } = input.id ? await store.from("courses").update(row).eq("id", input.id) : await store.from("courses").insert(row);
  if (error) return { ok: false, error: error.code === "23505" ? "slug" : "generic" };
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { ok: true };
}

export async function deleteCourse(id: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("courses").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { ok: true };
}

export async function saveUnit(input: { id: string | null; course_id: string; title: string; title_en: string; sort_order: number }): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const title = input.title.trim();
  if (!title) return { ok: false, error: "title" };
  const row = { course_id: input.course_id, title, title_en: input.title_en.trim() || null, sort_order: input.sort_order };
  const { error } = input.id ? await store.from("course_units").update(row).eq("id", input.id) : await store.from("course_units").insert(row);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/admin/courses/${input.course_id}`);
  return { ok: true };
}

export async function deleteUnit(id: string, courseId: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("course_units").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true };
}

export type LessonInput = {
  id: string | null;
  unit_id: string;
  course_id: string;
  title: string;
  title_en: string;
  sort_order: number;
  duration_minutes: number;
  content_type: "video" | "slides";
  video_path: string | null;
  slides: SlideContent[];
  script: string;
  script_en: string;
  vocabulary: VocabularyEntry[];
  notes: string;
};

export async function saveLesson(input: LessonInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const title = input.title.trim();
  if (!title) return { ok: false, error: "title" };
  const row = {
    unit_id: input.unit_id,
    course_id: input.course_id,
    title,
    title_en: input.title_en.trim() || null,
    sort_order: input.sort_order,
    duration_minutes: input.duration_minutes,
    content_type: input.content_type,
    video_path: input.video_path,
    slides: input.slides,
    script: input.script.trim() || null,
    script_en: input.script_en.trim() || null,
    vocabulary: input.vocabulary,
    notes: input.notes.trim() || null,
  };
  const { error } = input.id ? await store.from("course_lessons").update(row).eq("id", input.id) : await store.from("course_lessons").insert(row);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/admin/courses/${input.course_id}`);
  revalidatePath(`/courses`);
  return { ok: true };
}

export async function deleteLesson(id: string, courseId: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("course_lessons").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true };
}

export type ResourceInput = { id: string | null; course_id: string; title: string; title_en: string; file_path: string | null; sort_order: number };

export async function saveResource(input: ResourceInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const title = input.title.trim();
  if (!title) return { ok: false, error: "title" };
  if (!input.file_path) return { ok: false, error: "generic" };
  const row = { course_id: input.course_id, title, title_en: input.title_en.trim() || null, file_path: input.file_path, sort_order: input.sort_order };
  const { error } = input.id ? await store.from("course_resources").update(row).eq("id", input.id) : await store.from("course_resources").insert(row);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/admin/courses/${input.course_id}`);
  revalidatePath("/courses");
  return { ok: true };
}

export async function deleteResource(id: string, courseId: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("course_resources").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true };
}
