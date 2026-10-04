export type VocabularyEntry = { ko: string; fa: string; en?: string };
export type SlideContent = { title: string; title_en?: string; body: string; body_en?: string; ko?: string; chart?: "consonants" | "vowels" };
export type LessonMaterial = { title: string; title_en?: string; file_path: string };

/** Preset icon choices for a course's "What You Will Learn" row (mapped to real icons in skillIcons.tsx). */
export type SkillIconKey = "listening" | "reading" | "writing" | "speaking" | "vocabulary" | "grammar" | "pronunciation" | "culture";
export type CourseSkill = { icon: SkillIconKey; title: string; title_en?: string };

/** Preset icon choices for a course unit's badge on the Lessons timeline (mapped to real icons in unitIcons.tsx). */
export type UnitIconKey = "book" | "sparkle" | "chat" | "people" | "food" | "palette" | "globe" | "mic" | "headphones" | "pencil" | "tag" | "flame";

/** Mirrors public.courses (supabase/migrations/0009_courses.sql, skills added in 0015). */
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
  skills: CourseSkill[];
};

export type CourseUnit = {
  id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  sort_order: number;
  icon: UnitIconKey;
};

export type CourseLesson = {
  id: string;
  unit_id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  title_ko: string | null;
  sort_order: number;
  duration_minutes: number;
  content_type: "video" | "slides";
  video_path: string | null;
  slides: SlideContent[];
  script: string | null;
  script_en: string | null;
  vocabulary: VocabularyEntry[];
  notes: string | null;
  objectives: string | null;
  objectives_en: string | null;
  materials: LessonMaterial[];
};

export type UnitWithLessons = CourseUnit & { lessons: CourseLesson[] };

/** Mirrors public.course_resources (supabase/migrations/0014_course_resources_reviews.sql). */
export type CourseResource = {
  id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  file_path: string;
  sort_order: number;
};

/** Mirrors public.course_reviews. reviewer_name/avatar_key are denormalized at submit time. */
export type CourseReview = {
  id: string;
  course_id: string;
  user_id: string;
  reviewer_name: string | null;
  reviewer_avatar_key: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type CourseOutline = {
  course: Course;
  units: UnitWithLessons[];
  hasAccess: boolean;
  progress: Record<string, boolean>; // lesson_id -> is_done
};

export type LevelBucket = "beginner" | "intermediate" | "advanced";

/** Maps a course's free-text level (typed in /admin/courses) onto the 3 filter buckets from the sketch. */
export function levelBucket(level: string | null): LevelBucket | null {
  if (!level) return null;
  const v = level.trim().toLowerCase();
  if (["beginner", "starter", "مبتدی", "1-1", "1"].includes(v)) return "beginner";
  if (["intermediate", "متوسط", "1-2", "2"].includes(v)) return "intermediate";
  if (["advanced", "پیشرفته", "3"].includes(v)) return "advanced";
  return null;
}

export function lessonCount(units: UnitWithLessons[]) {
  return units.reduce((n, u) => n + u.lessons.length, 0);
}

export function completedCount(units: UnitWithLessons[], progress: Record<string, boolean>) {
  return units.reduce((n, u) => n + u.lessons.filter((l) => progress[l.id]).length, 0);
}

/** Flat, ordered lesson list — used to find a lesson's course-wide neighbors and its "first not done". */
export function flattenLessons(units: UnitWithLessons[]) {
  return units.flatMap((u) => u.lessons.map((l) => ({ ...l, unitTitle: u.title, unitTitleEn: u.title_en, unitIcon: u.icon })));
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
