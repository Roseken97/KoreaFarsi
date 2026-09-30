"use client";

import { useState } from "react";
import { decomposeWord, romanize, type Jamo } from "@/lib/hangul";

const ROLE_STYLE: Record<Jamo["role"], string> = {
  initial: "bg-teal-deep text-cream",
  medial: "bg-blush text-white",
  final: "bg-sage text-ink",
};

/** Tap a syllable to see it split into its consonant/vowel parts — pure Unicode math, no image assets. */
export function HangulBreakdown({ word, className = "" }: { word: string; className?: string }) {
  const syllables = decomposeWord(word);
  const [split, setSplit] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setSplit((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex flex-wrap items-end justify-center gap-2">
        {syllables.map(({ char, jamo }, i) =>
          !jamo ? (
            <span key={i} lang="ko" className="self-center px-1 text-3xl text-ink">
              {char}
            </span>
          ) : (
            <button
              key={i}
              onClick={() => toggle(i)}
              lang="ko"
              className="grid size-16 place-items-center rounded-2xl bg-cream-deep text-3xl font-semibold text-ink shadow-soft transition hover:bg-cream"
            >
              {split.has(i) ? (
                <span className="flex flex-col items-center gap-0.5">
                  {jamo.map((j, k) => (
                    <span key={k} className={`grid h-4 w-8 place-items-center rounded text-[10px] font-bold ${ROLE_STYLE[j.role]}`}>
                      {j.char}
                    </span>
                  ))}
                </span>
              ) : (
                char
              )}
            </button>
          ),
        )}
      </div>
      <p dir="ltr" className="text-sm text-ink-faint">
        {romanize(word)}
      </p>
    </div>
  );
}
