"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BooksStackIcon, ChevronIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import type { Course } from "@/lib/courses/types";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

/** Level filter tabs from sketch 06, built from whichever level values the catalog actually has (levels are free text, set per-course in /admin/courses). */
export function CoursesBrowser({ courses, lessonCounts }: { courses: Course[]; lessonCounts: Record<string, number> }) {
  const { m, locale } = useI18n();
  const t = m.courses;
  const levels = useMemo(() => Array.from(new Set(courses.map((c) => c.level).filter((l): l is string => Boolean(l)))), [courses]);
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? courses.filter((c) => c.level === active) : courses;

  return (
    <div>
      {levels.length > 1 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          <Tab label="All" selected={active === null} onClick={() => setActive(null)} />
          {levels.map((level) => (
            <Tab key={level} label={level} selected={active === level} onClick={() => setActive(level)} />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => {
            const title = locale === "en" ? c.title_en || c.title : c.title;
            return (
              <li key={c.id}>
                <MotionCard href={`/courses/${c.slug}`} tilt={false} className="flex items-center gap-4 rounded-[20px] bg-surface p-4 shadow-soft">
                  {c.cover_image_url ? (
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream-deep">
                      <Image src={c.cover_image_url} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  ) : (
                    <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-sage-soft text-teal-deep">
                      <BooksStackIcon width={28} height={28} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink" dir="auto">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink-soft">
                      {[c.level, fmt(t.lessonsCount, { n: formatNumber(lessonCounts[c.id] ?? 0, locale) })].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <ChevronIcon width={18} height={18} className="shrink-0 text-ink-faint rtl:-scale-x-100" />
                </MotionCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Tab({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${selected ? "bg-ink text-cream" : "border border-line bg-surface text-ink-soft hover:text-ink"}`}
    >
      {label}
    </button>
  );
}
