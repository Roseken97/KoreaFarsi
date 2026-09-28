"use client";

import Image from "next/image";
import { useState } from "react";
import { BooksStackIcon, ChevronIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import { levelBucket, type LevelBucket } from "@/lib/courses/types";
import type { Course } from "@/lib/courses/types";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

const LEVELS: LevelBucket[] = ["beginner", "intermediate", "advanced"];

/** Course list, matching UX_SPECS sketch 06: All/Beginner/Intermediate/Advanced tabs + bigger cards with a description line. */
export function CoursesBrowser({ courses, lessonCounts }: { courses: Course[]; lessonCounts: Record<string, number> }) {
  const { m, locale } = useI18n();
  const t = m.courses;
  const [active, setActive] = useState<LevelBucket | null>(null);

  const filtered = active ? courses.filter((c) => levelBucket(c.level) === active) : courses;

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <Tab label={t.allLevels} selected={active === null} onClick={() => setActive(null)} />
        {LEVELS.map((level) => (
          <Tab key={level} label={t.levels[level]} selected={active === level} onClick={() => setActive(level)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => {
            const title = locale === "en" ? c.title_en || c.title : c.title;
            const description = locale === "en" ? c.description_en || c.description : c.description;
            return (
              <li key={c.id}>
                <MotionCard href={`/courses/${c.slug}`} tilt={false} className="flex items-center gap-4 rounded-[24px] bg-surface p-4 shadow-soft">
                  {c.cover_image_url ? (
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-[18px] bg-cream-deep">
                      <Image src={c.cover_image_url} alt="" fill sizes="96px" className="object-cover" />
                    </div>
                  ) : (
                    <span className="grid size-24 shrink-0 place-items-center rounded-[18px] bg-sage-soft text-teal-deep">
                      <BooksStackIcon width={34} height={34} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-semibold text-ink" dir="auto">
                      {title}
                    </p>
                    {description && (
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-ink-soft" dir="auto">
                        {description}
                      </p>
                    )}
                    <p className="mt-1.5 text-[12px] font-medium text-ink-faint">
                      {[fmt(t.lessonsCount, { n: formatNumber(lessonCounts[c.id] ?? 0, locale) }), c.level].filter(Boolean).join(" · ")}
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
