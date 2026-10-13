"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { LevelBucket } from "@/lib/courses/types";
import { useI18n } from "@/lib/i18n/client";

export type LevelCourse = { slug: string; title: string; title_en: string | null; level: LevelBucket | null };

const LEVELS: LevelBucket[] = ["beginner", "intermediate", "advanced"];

/**
 * Shown when the signup screen opens: the learner picks a level. Beginners go
 * straight on to the form; anyone further along first sees the courses for
 * their level (shop pages), with a button back to signing up.
 */
export function LevelPrompt({ courses }: { courses: LevelCourse[] }) {
  const { m, locale } = useI18n();
  const t = m.site.level;
  const [open, setOpen] = useState(true);
  const [level, setLevel] = useState<LevelBucket | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const matches = level ? courses.filter((c) => c.level === level) : [];

  function choose(l: LevelBucket) {
    if (l === "beginner") return setOpen(false);
    setLevel(l);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-5 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-prompt-title"
        tabIndex={-1}
        className="animate-fade-up relative w-full max-w-[380px] rounded-hero bg-surface p-6 text-center shadow-[0_30px_60px_-20px_rgb(30_35_64/0.45)] outline-none"
      >
        <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="absolute end-3 top-3 grid size-9 place-items-center rounded-full text-ink-faint hover:bg-cream">
          <CloseIcon width={18} height={18} />
        </button>
        <span lang="ko" aria-hidden="true" className="font-display text-3xl font-bold text-violet">
          레벨
        </span>
        <h2 id="level-prompt-title" className="mt-1 font-display text-xl font-bold text-ink">
          {level ? t.matches : t.title}
        </h2>

        {!level ? (
          <>
            <p className="mt-1 text-sm text-ink-soft">{t.body}</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {LEVELS.map((l) => (
                <Button key={l} type="button" variant={l === "beginner" ? "navy" : "secondary"} onClick={() => choose(l)}>
                  {t.options[l]}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {matches.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">{t.none}</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2 text-start">
                {matches.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop/${c.slug}`} className="block rounded-field border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink transition hover:border-violet" dir="auto">
                      {locale === "en" ? c.title_en || c.title : c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex flex-col gap-2.5">
              <Button type="button" variant="navy" onClick={() => setOpen(false)}>
                {t.continue}
              </Button>
              <button type="button" onClick={() => setLevel(null)} className="text-sm font-semibold text-violet-deep hover:underline">
                {t.back}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
