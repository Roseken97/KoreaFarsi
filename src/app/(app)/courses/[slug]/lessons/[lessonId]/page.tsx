import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { ChevronIcon, LayersIcon, LevelIcon, PlayIcon, TargetIcon, WatchIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { getLessonWithCourse, isLessonBookmarked } from "@/lib/courses/queries";
import { isLessonUnlocked, levelBucket, type CourseLesson } from "@/lib/courses/types";
import { fmt, formatNumber, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { BookmarkButton } from "./BookmarkButton";
import { LessonMaterials } from "./LessonMaterials";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lessonId: string }> }): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const result = await getLessonWithCourse(slug, lessonId);
  return { title: result?.lesson.title ?? "Lesson" };
}

/** How many steps the Start page's learning path will have — main content + whichever of script/vocabulary/notes exist. */
function countLearningSteps(lesson: CourseLesson, locale: Locale): number {
  let n = 1;
  if (lesson.vocabulary.length > 0) n += 1;
  if (locale === "en" ? lesson.script_en || lesson.script : lesson.script) n += 1;
  if (lesson.notes) n += 1;
  return n;
}

/** Lesson Overview (sketch 09) — shown before "Start Lesson" opens the actual content (tabs page, now at .../start). */
export default async function LessonOverviewPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  const [{ m, locale }, result] = await Promise.all([getMessages(), getLessonWithCourse(slug, lessonId)]);
  if (!result) notFound();
  const { outline, lesson } = result;
  const t = m.courses;
  const to = t.lesson.overview;

  if (!outline.hasAccess) {
    const user = await getCurrentUser();
    return (
      <div className="animate-fade-up max-w-2xl">
        <OverviewBackHeader backHref={`/courses/${slug}`} />
        <Notice tone="error">{user ? t.lesson.errors.forbidden : t.lesson.errors.unauthenticated}</Notice>
        <ButtonLink href={user ? "/bookstore" : "/auth/login"} className="mt-4 w-auto! px-8">
          {user ? t.getAccessCta : m.auth.login.submit}
        </ButtonLink>
      </div>
    );
  }

  if (!isLessonUnlocked(outline.units, outline.progress, lessonId)) {
    return (
      <div className="animate-fade-up max-w-2xl">
        <OverviewBackHeader backHref={`/courses/${slug}`} />
        <Notice>{t.lesson.locked}</Notice>
        <ButtonLink href={`/courses/${slug}`} className="mt-4 w-auto! px-8">
          {t.title}
        </ButtonLink>
      </div>
    );
  }

  const unit = outline.units.find((u) => u.lessons.some((l) => l.id === lessonId))!;
  const lessonIndexInUnit = unit.lessons.findIndex((l) => l.id === lessonId);
  const bookmarked = await isLessonBookmarked(lessonId);

  const title = locale === "en" ? lesson.title_en || lesson.title : lesson.title;
  const unitTitle = locale === "en" ? unit.title_en || unit.title : unit.title;
  const levelLabel = outline.course.level ? t.levels[levelBucket(outline.course.level) ?? "beginner"] || outline.course.level : null;
  const objectivesText = locale === "en" ? lesson.objectives_en || lesson.objectives : lesson.objectives;
  const objectives = (objectivesText ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const activitiesCount = countLearningSteps(lesson, locale);

  return (
    <div className="animate-fade-up max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <OverviewBackHeader backHref={`/courses/${slug}`} />
        <BookmarkButton lessonId={lessonId} initialBookmarked={bookmarked} />
      </div>

      <p className="text-xs font-medium text-ink-faint" dir="auto">
        {[levelLabel ?? outline.course.level, unitTitle, fmt(to.lessonLabel, { n: formatNumber(lessonIndexInUnit + 1, locale) })].filter(Boolean).join("  ›  ")}
      </p>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {lesson.title_ko ? (
            <>
              <h1 lang="ko" className="font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
                {lesson.title_ko}
              </h1>
              <p className="mt-1 text-base text-ink-soft" dir="auto">
                {title}
              </p>
            </>
          ) : (
            <h1 className="font-display text-2xl leading-tight font-bold text-ink" dir="auto">
              {title}
            </h1>
          )}
        </div>
        <div className="relative h-20 w-24 shrink-0 opacity-90">
          <SakuraBranch className="absolute -top-1 -end-1 w-20 rtl:-scale-x-100" />
          <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-10" />
        </div>
      </div>

      <div className="mt-5 flex gap-3 rounded-card bg-sage-soft p-4">
        <TargetIcon width={20} height={20} className="mt-0.5 shrink-0 text-teal-deep" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{to.objectivesTitle}</p>
          {objectives.length > 0 ? (
            <ul className="mt-1.5 flex flex-col gap-1 text-[13px] leading-6 text-ink-soft">
              {objectives.map((line, i) => (
                <li key={i} dir="auto">
                  • {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[13px] leading-6 text-ink-faint">{to.objectivesEmpty}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-card bg-surface p-3 shadow-soft">
        <MetaItem icon={<WatchIcon width={18} height={18} />} value={lesson.duration_minutes > 0 ? `${formatNumber(lesson.duration_minutes, locale)}′` : "—"} label={to.meta.time} />
        <MetaItem icon={<LevelIcon width={18} height={18} />} value={levelLabel ?? "—"} label={to.meta.level} />
        <MetaItem icon={<LayersIcon width={18} height={18} />} value={fmt(to.activitiesCount, { n: formatNumber(activitiesCount, locale) })} label={to.meta.activities} />
      </div>

      <h2 className="mt-6 font-display text-lg font-semibold">{to.materialsTitle}</h2>
      <div className="mt-3">
        {lesson.materials.length > 0 ? (
          <LessonMaterials lessonId={lessonId} materials={lesson.materials} locale={locale} />
        ) : (
          <p className="rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft">{to.materialsEmpty}</p>
        )}
      </div>

      <Link
        href={`/courses/${slug}/lessons/${lessonId}/start`}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-field bg-violet px-5 text-[15px] font-semibold text-white shadow-soft transition hover:bg-violet-deep active:scale-[0.99]"
      >
        <PlayIcon width={18} height={18} />
        {to.startLesson}
        <ChevronIcon width={16} height={16} className="rtl:-scale-x-100" />
      </Link>
    </div>
  );
}

function OverviewBackHeader({ backHref }: { backHref: string }) {
  return (
    <Link href={backHref} aria-label="Back" className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-soft hover:text-ink">
      <ChevronIcon width={18} height={18} className="rotate-180" />
    </Link>
  );
}

function MetaItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 text-center">
      <span className="text-ink-faint">{icon}</span>
      <span className="text-[13px] font-semibold whitespace-nowrap text-ink" dir="auto">
        {value}
      </span>
      <span className="text-[10px] leading-[1.3] text-ink-faint" dir="auto">
        {label}
      </span>
    </div>
  );
}
