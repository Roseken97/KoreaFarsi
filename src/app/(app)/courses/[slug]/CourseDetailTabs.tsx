"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronIcon, ShieldIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import { SKILL_ICONS } from "@/lib/courses/skillIcons";
import type { CourseResource, CourseReview, CourseSkill } from "@/lib/courses/types";
import { flattenLessons, isLessonUnlocked, type CourseOutline } from "@/lib/courses/types";
import { UNIT_ICONS } from "@/lib/courses/unitIcons";
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

  // Each unit gets one identity color, cycling through the palette, so the
  // timeline marker and the badge inside its lessons' cards read as one group.
  const UNIT_COLORS = [
    { badge: "bg-violet", ring: "border-violet" },
    { badge: "bg-clay", ring: "border-clay" },
    { badge: "bg-indigo", ring: "border-indigo" },
    { badge: "bg-gold", ring: "border-gold" },
  ] as const;
  function colorFor(unitId: string) {
    const i = units.findIndex((u) => u.id === unitId);
    return UNIT_COLORS[(i < 0 ? 0 : i) % UNIT_COLORS.length];
  }
  function iconFor(unitId: string) {
    return UNIT_ICONS[units.find((u) => u.id === unitId)?.icon ?? "book"];
  }

  // Fallback for courses created before skills were editable per-course (0015).
  const defaultSkills: CourseSkill[] = [
    { icon: "listening", title: t.detail.skills.listening.title },
    { icon: "reading", title: t.detail.skills.reading.title },
    { icon: "writing", title: t.detail.skills.writing.title },
    { icon: "speaking", title: t.detail.skills.speaking.title },
  ];
  const skills = course.skills && course.skills.length > 0 ? course.skills : defaultSkills;

  /**
   * A hollow colored ring sits on the connecting timeline; the card itself
   * carries a rotated, overlapping "folder tab" icon badge in that same
   * color, plus a 3-segment progress indicator (0/1/3 lit = locked/current/done).
   */
  function LessonRow({ lesson, isLast }: { lesson: (typeof flat)[number]; isLast: boolean }) {
    const isDone = Boolean(progress[lesson.id]);
    const isCurrent = !isDone && lesson.id === firstOpenId;
    const unlocked = isDone || isLessonUnlocked(units, progress, lesson.id);
    const color = colorFor(lesson.unit_id);
    const Icon = iconFor(lesson.unit_id);
    const litSegments = isDone ? 3 : isCurrent ? 1 : 0;
    const rowClass = "flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-surface py-2.5 pe-4 ps-2.5 shadow-soft";
    const content = (
      <>
        <span
          className={`relative -my-1 -ms-5 grid size-14 shrink-0 rotate-[-4deg] place-items-center overflow-hidden rounded-tl-2xl rounded-tr-lg rounded-br-2xl rounded-bl-lg text-white shadow-lift ${
            unlocked ? color.badge : "bg-line"
          }`}
        >
          <span className="absolute top-2 start-2.5 size-2 rounded-full bg-white/25" aria-hidden="true" />
          <span className="absolute end-2.5 bottom-2.5 size-1.5 rounded-full bg-white/20" aria-hidden="true" />
          <Icon width={20} height={20} className="relative rotate-[4deg]" />
        </span>
        <span className={`min-w-0 flex-1 truncate text-[15px] font-bold ${unlocked ? "text-ink" : "text-ink-faint"}`} dir="auto">
          {locale === "en" ? lesson.title_en || lesson.title : lesson.title}
        </span>
        {unlocked ? (
          <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 w-4 rounded-full ${i < litSegments ? color.badge : "bg-line"}`} />
            ))}
          </div>
        ) : (
          <ShieldIcon width={16} height={16} className="shrink-0 text-ink-faint" />
        )}
      </>
    );
    return (
      <div className="relative flex items-center gap-4">
        {!isLast && <span className="absolute start-[7px] top-1/2 -bottom-3 w-px bg-line" aria-hidden="true" />}
        <span
          className={`relative z-10 size-4 shrink-0 rounded-full border-[3px] bg-surface ${unlocked ? color.ring : "border-line"}`}
          aria-hidden="true"
        />
        {unlocked ? (
          <MotionCard href={`/courses/${course.slug}/lessons/${lesson.id}`} tilt={false} className={rowClass}>
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
              <ul className="mt-3 flex flex-col gap-4">
                {flat.slice(0, 3).map((lesson, i, arr) => (
                  <li key={lesson.id}>
                    <LessonRow lesson={lesson} isLast={i === arr.length - 1} />
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
                <div className="mb-3 flex items-center gap-4">
                  <span className="size-4 shrink-0 rounded-full border-[3px] border-line bg-surface" aria-hidden="true" />
                  <h2 className="flex-1 font-display text-lg font-semibold" dir="auto">
                    {locale === "en" ? unit.title_en || unit.title : unit.title}
                  </h2>
                  <ChevronIcon width={16} height={16} className="shrink-0 rotate-90 text-ink-faint rtl:-rotate-90" />
                </div>
                <ul className="flex flex-col gap-4">
                  {unit.lessons.map((lesson, i, arr) => (
                    <li key={lesson.id}>
                      <LessonRow lesson={{ ...lesson, unitTitle: unit.title, unitTitleEn: unit.title_en, unitIcon: unit.icon }} isLast={i === arr.length - 1} />
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
