"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";
import { motion, type PanInfo } from "motion/react";

export type ArcCard = {
  key: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  bg: string;
  text: string;
  href: string;
};

const ANGLE_STEP = 38; // degrees between adjacent cards
const RADIUS = 100;

/**
 * 5 cards fanned along a semicircle below the mascot, pivoting from a point
 * just above the row — the front (nearest-to-top) card is the active one.
 * Swipe left/right to rotate which card is in front; tapping the front card
 * navigates into that section's own page. Tapping a side card just brings it
 * to the front instead of navigating, so a swipe-past doesn't accidentally jump.
 */
export function ArcCarousel({ cards }: { cards: ArcCard[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(Math.floor(cards.length / 2));

  function go(delta: number) {
    setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -40) go(1);
    else if (info.offset.x > 40) go(-1);
  }

  return (
    <div className="relative mx-auto h-56 w-full max-w-xs">
      <motion.div
        className="absolute inset-x-0 top-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
      >
        {cards.map((card, i) => {
          const angle = (i - index) * ANGLE_STEP;
          const rad = (angle * Math.PI) / 180;
          const x = RADIUS * Math.sin(rad);
          const y = RADIUS * (1 - Math.cos(rad));
          const isActive = i === index;
          const scale = Math.max(0.72, 1 - Math.abs(angle) / 160);

          return (
            <motion.button
              key={card.key}
              type="button"
              onClick={() => (isActive ? router.push(card.href) : setIndex(i))}
              animate={{ x, y, scale, opacity: Math.abs(angle) > 100 ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`absolute left-1/2 top-0 flex w-24 -translate-x-1/2 flex-col items-center gap-2 rounded-card p-3.5 text-center ${card.bg} ${
                isActive ? "z-10 shadow-lift ring-2 ring-surface" : "shadow-soft"
              }`}
              style={{ zIndex: isActive ? 10 : 10 - Math.abs(i - index) }}
            >
              <span className={`grid size-10 place-items-center rounded-full bg-surface/70 ${card.text}`}>
                <card.Icon width={20} height={20} />
              </span>
              <span className={`text-xs font-semibold ${card.text}`}>{card.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
