export type VocabularyEntry = { ko: string; fa: string; en?: string };

/** Mirrors public.courses (supabase/migrations/0009_courses.sql). */
export type Course = {
  id: string;
  slug: string;
  product_id: string | null;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  level: string | null;
  cover_image_url: string | null;
  is_available: boolean;
  sort_order: number;
};

export type CourseUnit = {
  id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  sort_order: number;
};

export type CourseLesson = {
  id: string;
  unit_id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  sort_order: number;
  duration_minutes: number;
  video_path: string | null;
  script: string | null;
  script_en: string | null;
  vocabulary: VocabularyEntry[];
  notes: string | null;
};

export type UnitWithLessons = CourseUnit & { lessons: CourseLesson[] };

export type CourseOutline = {
  course: Course;
  units: UnitWithLessons[];
  hasAccess: boolean;
  progress: Record<string, boolean>; // lesson_id -> is_done
};

export function lessonCount(units: UnitWithLessons[]) {
  return units.reduce((n, u) => n + u.lessons.length, 0);
}

export function completedCount(units: UnitWithLessons[], progress: Record<string, boolean>) {
  return units.reduce((n, u) => n + u.lessons.filter((l) => progress[l.id]).length, 0);
}

/** Flat, ordered lesson list — used to find a lesson's course-wide neighbors and its "first not done". */
export function flattenLessons(units: UnitWithLessons[]) {
  return units.flatMap((u) => u.lessons.map((l) => ({ ...l, unitTitle: u.title, unitTitleEn: u.title_en })));
}

/**
 * Sequential unlock: a lesson opens once every lesson before it (course-wide,
 * in unit/lesson sort order) is done. The first lesson is always unlocked.
 */
export function isLessonUnlocked(units: UnitWithLessons[], progress: Record<string, boolean>, lessonId: string) {
  const flat = flattenLessons(units);
  const idx = flat.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  return flat.slice(0, idx).every((l) => progress[l.id]);
}
