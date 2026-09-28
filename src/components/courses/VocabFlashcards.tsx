"use client";

import { useState } from "react";
import { ChevronIcon } from "@/components/icons";
import type { VocabularyEntry } from "@/lib/courses/types";
import type { Locale } from "@/lib/i18n/config";
import { HangulBreakdown } from "./HangulBreakdown";

/** Tap the card to flip between the Korean word (with a tappable jamo breakdown) and its meaning. */
export function VocabFlashcards({ entries, locale }: { entries: VocabularyEntry[]; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const entry = entries[index];

  function go(delta: number) {
    setIndex((i) => Math.max(0, Math.min(entries.length - 1, i + delta)));
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-44 w-full max-w-sm flex-col items-center justify-center rounded-card bg-surface p-6 shadow-soft"
      >
        {flipped ? (
          <p dir="auto" className="text-xl font-semibold text-ink">
            {locale === "en" && entry.en ? entry.en : entry.fa}
          </p>
        ) : (
          <HangulBreakdown word={entry.ko} />
        )}
      </button>

      <div className="flex items-center gap-4">
        <button onClick={() => go(-1)} disabled={index === 0} className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30">
          <ChevronIcon width={16} height={16} className="rotate-180 rtl:rotate-0" />
        </button>
        <span className="text-sm text-ink-faint" dir="ltr">
          {index + 1} / {entries.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={index === entries.length - 1}
          className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30"
        >
          <ChevronIcon width={16} height={16} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
