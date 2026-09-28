"use client";

import Link from "next/link";
import { useState, type ComponentType, type SVGProps } from "react";
import { CheckIcon, ChevronIcon, HeadphonesIcon, LibraryIcon, MicIcon, PencilIcon, ShieldIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import { flattenLessons, isLessonUnlocked, type CourseOutline } from "@/lib/courses/types";
import { fmt, formatNumber, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

type Tab = "overview" | "lessons" | "resources" | "reviews";

export function CourseDetailTabs({
  course,
  units,
  progress,
  locale,
  description,
  total,
  done,
}: {
  course: CourseOutline["course"];
  units: CourseOutline["units"];
  progress: CourseOutline["progress"];
  locale: Locale;
  description: string | null;
  total: number;
  done: number;
}) {
  const { m } = useI18n();
  const t = m.courses;
  const [tab, setTab] = useState<Tab>("overview");
  const [expanded, setExpanded] = useState(false);

  const flat = flattenLessons(units);
  const firstOpenId = flat.find((l) => !progress[l.id])?.id ?? flat[0]?.id ?? null;

  const skills: { Icon: ComponentType<SVGProps<SVGSVGElement>>; key: "listening" | "reading" | "writing" | "speaking" }[] = [
    { Icon: HeadphonesIcon, key: "listening" },
    { Icon: LibraryIcon, key: "reading" },
    { Icon: PencilIcon, key: "writing" },
    { Icon: MicIcon, key: "speaking" },
  ];

  function LessonRow({ lesson, index }: { lesson: (typeof flat)[number]; index: number }) {
    const isDone = Boolean(progress[lesson.id]);
    const isCurrent = !isDone && lesson.id === firstOpenId;
    const unlocked = isDone || isLessonUnlocked(units, progress, lesson.id);
    const rowClass = `flex items-center gap-3 rounded-field border p-3 ${isCurrent ? "border-teal bg-teal/5" : "border-line bg-surface"}`;
    const content = (
      <>
        <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${isDone ? "bg-success text-white" : "bg-cream-deep text-ink-soft"}`}>
          {isDone ? <CheckIcon width={14} height={14} /> : formatNumber(index + 1, locale)}
        </span>
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
    return unlocked ? (
      <MotionCard href={`/courses/${course.slug}/lessons/${lesson.id}`} tilt={false} className={`${rowClass} hover:bg-cream`}>
        {content}
      </MotionCard>
    ) : (
      <div className={`${rowClass} cursor-not-allowed opacity-70`} aria-disabled="true">
        {content}
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
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-teal" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>

      {/* Tabs (sketch callout #4): Overview / Lessons / Resources / Reviews — two-layer track + riding pill */}
      <div className="mt-6 flex gap-1 rounded-full bg-cream-deep p-1">
        {(["overview", "lessons", "resources", "reviews"] as Tab[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full px-2 py-2 text-xs font-medium transition sm:text-sm ${tab === key ? "bg-surface text-ink shadow-soft" : "text-ink-soft"}`}
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
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {skills.map(({ Icon, key }) => (
                <div key={key} className="flex flex-col gap-2 rounded-[18px] bg-surface p-3.5 shadow-soft">
                  <span className="grid size-9 place-items-center rounded-full bg-sage-soft text-teal-deep">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{t.detail.skills[key].title}</span>
                  <span className="text-[12px] leading-4 text-ink-faint">{t.detail.skills[key].body}</span>
                </div>
              ))}
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
              <ul className="mt-3 flex flex-col gap-2">
                {flat.slice(0, 3).map((lesson, i) => (
                  <li key={lesson.id}>
                    <LessonRow lesson={lesson} index={i} />
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
                <ul className="flex flex-col gap-2">
                  {unit.lessons.map((lesson, i) => (
                    <li key={lesson.id}>
                      <LessonRow lesson={{ ...lesson, unitTitle: unit.title, unitTitleEn: unit.title_en }} index={i} />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      )}

      {tab === "resources" && <p className="mt-5 rounded-card bg-surface p-5 text-center text-sm text-ink-soft shadow-soft">{t.detail.resourcesSoon}</p>}
      {tab === "reviews" && <p className="mt-5 rounded-card bg-surface p-5 text-center text-sm text-ink-soft shadow-soft">{t.detail.reviewsSoon}</p>}
    </>
  );
}
