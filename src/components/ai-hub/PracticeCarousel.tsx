"use client";

import { motion } from "motion/react";
import type { ComponentType, SVGProps } from "react";

export type PracticeCard = {
  key: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  bg: string;
  text: string;
};

/**
 * Horizontal snap carousel of colored practice-mode cards — each a different
 * tone so the row reads as a set of distinct "spaces" rather than a plain tab
 * list. Picking one hands the key back to the caller, which decides what
 * "entering that space" means (scroll to the real Chat feature, or show the
 * coming-soon notice for the rest).
 */
export function PracticeCarousel({ cards, active, onSelect }: { cards: PracticeCard[]; active: string | null; onSelect: (key: string) => void }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex snap-x snap-mandatory gap-3">
        {cards.map(({ key, label, Icon, bg, text }, i) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: active === key ? -6 : 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            whileTap={{ scale: 0.95 }}
            className={`flex w-24 shrink-0 snap-start flex-col items-center gap-2 rounded-card p-3.5 text-center transition-shadow ${bg} ${
              active === key ? "shadow-lift ring-2 ring-surface" : "shadow-soft"
            }`}
          >
            <span className={`grid size-10 place-items-center rounded-full bg-surface/70 ${text}`}>
              <Icon width={20} height={20} />
            </span>
            <span className={`text-xs font-semibold ${text}`}>{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
