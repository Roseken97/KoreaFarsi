"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ChevronIcon } from "@/components/icons";
import type { VocabularyEntry } from "@/lib/courses/types";
import type { Locale } from "@/lib/i18n/config";
import { HangulBreakdown } from "./HangulBreakdown";

/** Tap the card for a real 3D flip between the Korean word (with a tappable jamo breakdown) and its meaning. */
export function VocabFlashcards({ entries, locale, onFinished }: { entries: VocabularyEntry[]; locale: Locale; onFinished?: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState(1);
  const entry = entries[index];

  function go(delta: number) {
    setDir(delta);
    setIndex((i) => Math.max(0, Math.min(entries.length - 1, i + delta)));
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-sm overflow-hidden" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.button
            key={index}
            onClick={() => setFlipped((f) => !f)}
            custom={dir}
            initial={{ x: dir > 0 ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1, rotateY: flipped ? 180 : 0 }}
            exit={{ x: dir > 0 ? -60 : 60, opacity: 0 }}
            transition={{ rotateY: { duration: 0.45 }, default: { type: "spring", stiffness: 300, damping: 26 } }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative block h-44 w-full"
          >
            <span
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-card bg-surface p-6 shadow-soft"
            >
              <HangulBreakdown word={entry.ko} />
            </span>
            <span
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-card bg-surface p-6 shadow-soft"
            >
              <p dir="auto" className="text-xl font-semibold text-ink">
                {locale === "en" && entry.en ? entry.en : entry.fa}
              </p>
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => go(-1)}
          disabled={index === 0}
          className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30"
        >
          <ChevronIcon width={16} height={16} className="rotate-180 rtl:rotate-0" />
        </motion.button>
        <span className="text-sm text-ink-faint" dir="ltr">
          {index + 1} / {entries.length}
        </span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => (index === entries.length - 1 ? onFinished?.() : go(1))}
          disabled={index === entries.length - 1 && !onFinished}
          className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30"
        >
          <ChevronIcon width={16} height={16} className="rtl:rotate-180" />
        </motion.button>
      </div>
    </div>
  );
}
