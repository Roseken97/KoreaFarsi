"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import type { LevelCourse } from "@/components/auth/LevelPrompt";
import type { LevelBucket } from "@/lib/courses/types";
import { useI18n } from "@/lib/i18n/client";

const LEVELS: LevelBucket[] = ["beginner", "intermediate", "advanced"];

/** The signup level question in the website's look (the app's sheet keeps LevelPrompt). Beginners skip; others see their level's courses. */
export function SiteLevelPrompt({ courses }: { courses: LevelCourse[] }) {
  const { m, locale } = useI18n();
  const t = m.site.level;
  const [open, setOpen] = useState(true);
  const [level, setLevel] = useState<LevelBucket | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const matches = level ? courses.filter((c) => c.level === level) : [];

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#140E26]/70 p-5 backdrop-blur-md">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-level-title"
        tabIndex={-1}
        className="kf-page-in relative w-full max-w-[420px] rounded-[30px] border border-white/15 bg-[#1C1336]/95 p-7 text-center text-white shadow-[0_40px_90px_rgba(0,0,0,0.5)] outline-none"
      >
        <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="absolute end-4 top-4 grid size-9 place-items-center rounded-full text-[#A99FC4] hover:bg-white/10 hover:text-white">
          <CloseIcon width={18} height={18} />
        </button>
        <span lang="ko" aria-hidden="true" className="text-4xl font-black text-[#B79CFF]">
          레벨
        </span>
        <h2 id="site-level-title" className="m-0 mt-1 text-xl font-black">
          {level ? t.matches : t.title}
        </h2>
        {!level ? (
          <>
            <p className="m-0 mt-1 text-sm text-[#C9BEE3]">{t.body}</p>
            <div className="mt-6 flex flex-col gap-2.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => (l === "beginner" ? setOpen(false) : setLevel(l))}
                  className={
                    l === "beginner"
                      ? "h-12 rounded-full bg-white/90 font-extrabold text-[#1C1336] hover:bg-white"
                      : "h-12 rounded-full border border-white/20 bg-white/[0.05] font-bold text-white hover:bg-white/[0.1]"
                  }
                >
                  {t.options[l]}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {matches.length === 0 ? (
              <p className="m-0 mt-3 text-sm text-[#C9BEE3]">{t.none}</p>
            ) : (
              <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0 text-start">
                {matches.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop/${c.slug}`} className="block rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white hover:border-[#B79CFF]" dir="auto">
                      {locale === "en" ? c.title_en || c.title : c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-col gap-2.5">
              <button type="button" onClick={() => setOpen(false)} className="h-12 rounded-full bg-white/90 font-extrabold text-[#1C1336] hover:bg-white">
                {t.continue}
              </button>
              <button type="button" onClick={() => setLevel(null)} className="text-sm font-bold text-[#6FF3EE] hover:underline">
                {t.back}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
