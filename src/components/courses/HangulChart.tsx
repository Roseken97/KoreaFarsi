"use client";

import { useState } from "react";
import { CONSONANT_CHART, VOWEL_CHART } from "@/lib/hangul";

/** Full consonant or vowel table for an alphabet-teaching slide — tap a letter to see its romanization. */
export function HangulChart({ chart }: { chart: "consonants" | "vowels" }) {
  const letters = chart === "consonants" ? CONSONANT_CHART : VOWEL_CHART;
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-6 grid grid-cols-5 gap-2">
      {letters.map(({ char, roman }, i) => (
        <button
          key={i}
          onClick={() => setActive(active === i ? null : i)}
          lang="ko"
          className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl text-2xl font-semibold transition ${
            active === i ? "bg-teal text-white" : "bg-cream-deep text-ink hover:bg-cream"
          }`}
        >
          {char}
          {active === i && (
            <span dir="ltr" className="text-[10px] font-normal opacity-90">
              {roman}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
