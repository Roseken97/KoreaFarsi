"use client";

import { motion } from "motion/react";

/** Fur tufts ring the head/shoulders, leaving a gap at the bottom for the legs. */
const TUFTS = [
  { x1: 53.0, y1: 32.0, x2: 60.0, y2: 32.0, o: 0.85 },
  { x1: 52.4, y1: 36.8, x2: 62.6, y2: 39.3, o: 0.65 },
  { x1: 50.7, y1: 41.3, x2: 56.9, y2: 44.5, o: 0.85 },
  { x1: 48.0, y1: 45.3, x2: 55.8, y2: 52.2, o: 0.65 },
  { x1: 18.0, y1: 45.3, x2: 12.8, y2: 49.9, o: 0.85 },
  { x1: 15.3, y1: 41.3, x2: 6.0, y2: 46.2, o: 0.65 },
  { x1: 13.6, y1: 36.8, x2: 6.8, y2: 38.5, o: 0.85 },
  { x1: 13.0, y1: 32.0, x2: 2.5, y2: 32.0, o: 0.65 },
  { x1: 13.6, y1: 27.2, x2: 6.8, y2: 25.5, o: 0.85 },
  { x1: 15.3, y1: 22.7, x2: 6.0, y2: 17.8, o: 0.65 },
  { x1: 18.0, y1: 18.7, x2: 12.8, y2: 14.1, o: 0.85 },
  { x1: 21.6, y1: 15.5, x2: 15.7, y2: 6.9, o: 0.65 },
  { x1: 25.9, y1: 13.3, x2: 23.4, y2: 6.8, o: 0.85 },
  { x1: 30.6, y1: 12.1, x2: 29.3, y2: 1.7, o: 0.65 },
  { x1: 35.4, y1: 12.1, x2: 36.3, y2: 5.2, o: 0.85 },
  { x1: 40.1, y1: 13.3, x2: 43.8, y2: 3.5, o: 0.65 },
  { x1: 44.4, y1: 15.5, x2: 48.3, y2: 9.8, o: 0.85 },
  { x1: 48.0, y1: 18.7, x2: 55.8, y2: 11.8, o: 0.65 },
  { x1: 50.7, y1: 22.7, x2: 56.9, y2: 19.5, o: 0.85 },
  { x1: 52.4, y1: 27.2, x2: 62.6, y2: 24.7, o: 0.65 },
] as const;

/** Fluffy round monster mascot (Rose's reference image), redrawn as brand-colored SVG so it stays crisp and animatable. */
export function MascotSprite() {
  return (
    <motion.svg
      width={58}
      height={68}
      viewBox="0 0 66 78"
      fill="none"
      animate={{ scale: [1, 1.05, 1], rotate: [-2.5, 2.5, -2.5] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* legs */}
      <rect x="21" y="49" width="11" height="21" rx="5.5" fill="var(--color-teal)" />
      <rect x="34" y="49" width="11" height="21" rx="5.5" fill="var(--color-teal)" />
      <ellipse cx="26.5" cy="70" rx="7.5" ry="4.2" fill="var(--color-teal-deep)" />
      <ellipse cx="39.5" cy="70" rx="7.5" ry="4.2" fill="var(--color-teal-deep)" />

      {/* arms */}
      <ellipse cx="10" cy="40" rx="6.5" ry="8.5" fill="var(--color-teal)" transform="rotate(-18 10 40)" />
      <ellipse cx="56" cy="40" rx="6.5" ry="8.5" fill="var(--color-teal)" transform="rotate(18 56 40)" />

      {/* fur */}
      {TUFTS.map((t, i) => (
        <path
          key={i}
          d={`M${t.x1} ${t.y1} L${t.x2} ${t.y2}`}
          stroke="var(--color-teal-deep)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={t.o}
        />
      ))}

      {/* body */}
      <circle cx="33" cy="32" r="21" fill="var(--color-teal)" />
      <ellipse cx="26" cy="20" rx="10" ry="7" fill="var(--color-teal-mist)" opacity="0.35" />

      {/* eyes */}
      <circle cx="24" cy="30" r="9" fill="var(--color-cream)" />
      <circle cx="41" cy="33" r="7" fill="var(--color-cream)" />
      <circle cx="25.5" cy="31.5" r="5" fill="var(--color-ink)" />
      <circle cx="42.5" cy="34.5" r="4" fill="var(--color-ink)" />
      <circle cx="23.5" cy="28.5" r="1.6" fill="var(--color-cream)" />
      <circle cx="40.5" cy="31.5" r="1.3" fill="var(--color-cream)" />

      {/* smile */}
      <path d="M25 43 Q33 50 41 43" stroke="var(--color-teal-deep)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </motion.svg>
  );
}
