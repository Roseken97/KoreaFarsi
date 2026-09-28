import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { getCourseVideoUrl } from "@/lib/courses/actions";
import { getLessonWithCourse } from "@/lib/courses/queries";
import { flattenLessons, isLessonUnlocked } from "@/lib/courses/types";
import { getMessages } from "@/lib/i18n/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { LessonView } from "./LessonView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lessonId: string }> }): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const result = await getLessonWithCourse(slug, lessonId);
  return { title: result?.lesson.title ?? "Lesson" };
}

/** Lesson Overview + Teacher Content merged into one screen (sketches 09-10). */
export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  const [{ m, locale }, result] = await Promise.all([getMessages(), getLessonWithCourse(slug, lessonId)]);
  if (!result) notFound();
  const { outline, lesson } = result;
  const t = m.courses;

  if (!outline.hasAccess) {
    const user = await getCurrentUser();
    return (
      <div className="animate-fade-up max-w-2xl">
        <SubPageHeader title={t.title} backHref={`/courses/${slug}`} backLabel={t.title} />
        <Notice tone="error">{user ? m.courses.lesson.errors.forbidden : m.courses.lesson.errors.unauthenticated}</Notice>
        <ButtonLink href={user ? "/bookstore" : "/auth/login"} className="mt-4 w-auto! px-8">
          {user ? t.getAccessCta : m.auth.login.submit}
        </ButtonLink>
      </div>
    );
  }

  if (!isLessonUnlocked(outline.units, outline.progress, lessonId)) {
    return (
      <div className="animate-fade-up max-w-2xl">
        <SubPageHeader title={t.title} backHref={`/courses/${slug}`} backLabel={t.title} />
        <Notice>{t.lesson.locked}</Notice>
        <ButtonLink href={`/courses/${slug}`} className="mt-4 w-auto! px-8">
          {t.title}
        </ButtonLink>
      </div>
    );
  }

  const flat = flattenLessons(outline.units);
  const idx = flat.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  const video = lesson.video_path ? await getCourseVideoUrl(lessonId) : null;

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={locale === "en" ? lesson.title_en || lesson.title : lesson.title} backHref={`/courses/${slug}`} backLabel={t.title} />
      <LessonView
        lesson={lesson}
        courseSlug={slug}
        locale={locale}
        isDone={Boolean(outline.progress[lesson.id])}
        videoUrl={video?.ok ? video.url : null}
        videoError={video && !video.ok ? video.error : lesson.video_path ? null : "unavailable"}
        prevHref={prev ? `/courses/${slug}/lessons/${prev.id}` : null}
        nextHref={next ? `/courses/${slug}/lessons/${next.id}` : null}
      />
    </div>
  );
}
