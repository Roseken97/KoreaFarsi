"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, ChevronIcon, ShieldIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import { SKILL_ICONS } from "@/lib/courses/skillIcons";
import type { CourseResource, CourseReview, CourseSkill } from "@/lib/courses/types";
import { flattenLessons, isLessonUnlocked, type CourseOutline } from "@/lib/courses/types";
import { fmt, formatNumber, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { ResourcesTab } from "./ResourcesTab";
import { ReviewsTab } from "./ReviewsTab";

type Tab = "overview" | "lessons" | "resources" | "reviews";

export function CourseDetailTabs({
  course,
  units,
  progress,
  locale,
  description,
  total,
  done,
  resources,
  reviews,
  currentUserId,
}: {
  course: CourseOutline["course"];
  units: CourseOutline["units"];
  progress: CourseOutline["progress"];
  locale: Locale;
  description: string | null;
  total: number;
  done: number;
  resources: CourseResource[];
  reviews: CourseReview[];
  currentUserId: string | null;
}) {
  const { m } = useI18n();
  const t = m.courses;
  const [tab, setTab] = useState<Tab>("overview");
  const [expanded, setExpanded] = useState(false);

  const flat = flattenLessons(units);
  const firstOpenId = flat.find((l) => !progress[l.id])?.id ?? flat[0]?.id ?? null;

  // Fallback for courses created before skills were editable per-course (0015).
  const defaultSkills: CourseSkill[] = [
    { icon: "listening", title: t.detail.skills.listening.title },
    { icon: "reading", title: t.detail.skills.reading.title },
    { icon: "writing", title: t.detail.skills.writing.title },
    { icon: "speaking", title: t.detail.skills.speaking.title },
  ];
  const skills = course.skills && course.skills.length > 0 ? course.skills : defaultSkills;

  /** Numbered circle sits outside the lesson card, connected to the next one by a vertical line (sketch 07). */
  function LessonRow({ lesson, index, isLast }: { lesson: (typeof flat)[number]; index: number; isLast: boolean }) {
    const isDone = Boolean(progress[lesson.id]);
    const isCurrent = !isDone && lesson.id === firstOpenId;
    const unlocked = isDone || isLessonUnlocked(units, progress, lesson.id);
    const rowClass = `flex min-w-0 flex-1 items-center gap-3 rounded-field border bg-surface p-3 ${isCurrent ? "border-teal bg-teal/5" : "border-line"}`;
    const content = (
      <>
        <span className={`min-w-0 flex-1 truncate text-sm font-medium ${unlocked ? "text-ink" : "text-ink-faint"}`} dir="auto">
          {locale === "en" ? lesson.title_en || lesson.title : lesson.title}
        </span>
        {unlocked ? (
          lesson.duration_minutes > 0 && <span className="shrink-0 text-xs text-ink-faint">{lesson.duration_minutes}′</span>
        ) : (
          <ShieldIcon width={16} height={16} className="shrink-0 text-ink-faint" />
        )}
      </>
    );
    return (
      <div className="relative flex gap-3">
        {!isLast && <span className="absolute start-4 top-8 bottom-[-0.75rem] w-px bg-line" aria-hidden="true" />}
        <span
          className={`relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
            isDone ? "border-success bg-success text-white" : "border-line bg-surface text-ink-soft"
          }`}
        >
          {isDone ? <CheckIcon width={14} height={14} /> : formatNumber(index + 1, locale)}
        </span>
        {unlocked ? (
          <MotionCard href={`/courses/${course.slug}/lessons/${lesson.id}`} tilt={false} className={`${rowClass} hover:bg-cream`}>
            {content}
          </MotionCard>
        ) : (
          <div className={`${rowClass} cursor-not-allowed opacity-70`} aria-disabled="true">
            {content}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-soft">{fmt(t.progress, { done: formatNumber(done, locale), total: formatNumber(total, locale) })}</span>
        {firstOpenId && (
          <Link href={`/courses/${course.slug}/lessons/${firstOpenId}`} className="font-semibold text-teal-deep">
            {done > 0 ? t.continueCta : t.startCta}
          </Link>
        )}
      </div>
      {/* Tabs (sketch callout #4): Overview / Lessons / Resources / Reviews — white track, saturated teal pill riding on top */}
      <div className="mt-4 flex gap-1 rounded-full bg-surface p-1 shadow-soft">
        {(["overview", "lessons", "resources", "reviews"] as Tab[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full px-2 py-2 text-xs font-medium transition sm:text-sm ${tab === key ? "bg-teal text-white shadow-soft" : "text-ink-soft"}`}
          >
            {t.detail.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-5 flex flex-col gap-7">
          <section>
            <h2 className="font-display text-lg font-semibold">{t.detail.about}</h2>
            {description ? (
              <>
                <p className={`mt-2 text-[15px] leading-7 text-ink-soft ${expanded ? "" : "line-clamp-3"}`} dir="auto">
                  {description}
                </p>
                <button onClick={() => setExpanded((v) => !v)} className="mt-1 flex items-center gap-1 text-sm font-semibold text-teal-deep">
                  {expanded ? t.detail.readLess : t.detail.readMore}
                  <ChevronIcon width={14} height={14} className={`transition ${expanded ? "-rotate-90" : "rotate-90"} rtl:scale-x-[-1]`} />
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-faint">—</p>
            )}
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">{t.detail.whatYouLearn}</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {skills.map((skill, i) => {
                const Icon = SKILL_ICONS[skill.icon];
                const title = locale === "en" ? skill.title_en || skill.title : skill.title;
                return (
                  <div key={i} className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-card bg-surface p-3 text-center shadow-soft">
                    <span className="grid size-9 place-items-center rounded-full bg-sage-soft text-teal-deep">
                      <Icon width={18} height={18} />
                    </span>
                    <span className="text-[12px] leading-4 font-semibold text-ink" dir="auto">
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{t.detail.courseContent}</h2>
              {flat.length > 3 && (
                <button onClick={() => setTab("lessons")} className="text-sm font-semibold text-teal-deep">
                  {t.detail.viewAllLessons} →
                </button>
              )}
            </div>
            {flat.length === 0 ? (
              <p className="mt-3 rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {flat.slice(0, 3).map((lesson, i, arr) => (
                  <li key={lesson.id}>
                    <LessonRow lesson={lesson} index={i} isLast={i === arr.length - 1} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === "lessons" && (
        <div className="mt-5 flex flex-col gap-6">
          {units.length === 0 ? (
            <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
          ) : (
            units.map((unit) => (
              <section key={unit.id}>
                <h2 className="mb-2 font-display text-lg font-semibold" dir="auto">
                  {locale === "en" ? unit.title_en || unit.title : unit.title}
                </h2>
                <ul className="flex flex-col gap-3">
                  {unit.lessons.map((lesson, i, arr) => (
                    <li key={lesson.id}>
                      <LessonRow lesson={{ ...lesson, unitTitle: unit.title, unitTitleEn: unit.title_en }} index={i} isLast={i === arr.length - 1} />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      )}

      {tab === "resources" && <ResourcesTab resources={resources} locale={locale} />}
      {tab === "reviews" && <ReviewsTab courseId={course.id} courseSlug={course.slug} reviews={reviews} currentUserId={currentUserId} locale={locale} />}
    </>
  );
}
