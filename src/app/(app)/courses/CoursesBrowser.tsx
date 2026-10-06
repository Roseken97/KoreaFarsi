"use client";

import Image from "next/image";
import { useState } from "react";
import { BooksStackIcon, ChevronIcon, LayersIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";
import { levelBucket, type LevelBucket } from "@/lib/courses/types";
import type { Course } from "@/lib/courses/types";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { MESH, MESH_SHADOW, type MeshColor } from "@/lib/ui/mesh";

const LEVELS: LevelBucket[] = ["beginner", "intermediate", "advanced"];

/** Each level gets its own identity color so the course list reads at a glance, not just by label. */
const LEVEL_MESH: Record<LevelBucket, MeshColor> = { beginner: "indigo", intermediate: "clay", advanced: "violet" };

/** Course list, matching UX_SPECS sketch 06: All/Beginner/Intermediate/Advanced tabs + bigger cards with a description line. */
export function CoursesBrowser({ courses, lessonCounts }: { courses: Course[]; lessonCounts: Record<string, number> }) {
  const { m, locale } = useI18n();
  const t = m.courses;
  const [active, setActive] = useState<LevelBucket | null>(null);

  const filtered = active ? courses.filter((c) => levelBucket(c.level) === active) : courses;

  return (
    <div>
      {/* Filter tabs — two layers per the sketch: an outer track, and the active pill riding on top of it */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-full bg-cream-deep p-1">
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
            const meshColor = LEVEL_MESH[levelBucket(c.level) ?? "beginner"];
            return (
              <li key={c.id}>
                <MotionCard href={`/courses/${c.slug}`} tilt={false} className="flex items-center gap-4 rounded-2xl bg-surface py-3.5 pe-4 ps-3 shadow-soft">
                  {c.cover_image_url ? (
                    <div className="relative size-[92px] shrink-0 overflow-hidden rounded-2xl bg-cream-deep">
                      <Image src={c.cover_image_url} alt="" fill sizes="92px" className="object-cover" />
                    </div>
                  ) : (
                    <div
                      style={{ backgroundImage: MESH[meshColor] }}
                      className={`card-grain relative -my-1 -ms-2 grid size-[92px] shrink-0 rotate-[-4deg] place-items-center overflow-hidden rounded-tl-3xl rounded-tr-xl rounded-br-3xl rounded-bl-xl text-ink ${MESH_SHADOW[meshColor]}`}
                    >
                      <span className="absolute top-2.5 start-2.5 size-2 rounded-full bg-white/25" aria-hidden="true" />
                      <span className="absolute end-2.5 bottom-2.5 size-1.5 rounded-full bg-white/20" aria-hidden="true" />
                      <BooksStackIcon width={30} height={30} className="relative rotate-[4deg]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-semibold text-ink" dir="auto">
                      {title}
                    </p>
                    {description && (
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-ink-soft" dir="auto">
                        {description}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-ink-faint">
                      <LayersIcon width={13} height={13} />
                      {fmt(t.lessonsCount, { n: formatNumber(lessonCounts[c.id] ?? 0, locale) })}
                      {c.level && (
                        <>
                          <span className="opacity-50">|</span>
                          {t.levels[levelBucket(c.level) ?? "beginner"] ?? c.level}
                        </>
                      )}
                    </p>
                  </div>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream-deep text-ink-faint">
                    <ChevronIcon width={16} height={16} className="rtl:-scale-x-100" />
                  </span>
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
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${selected ? "bg-surface text-ink shadow-soft" : "text-ink-soft hover:text-ink"}`}
    >
      {label}
    </button>
  );
}
