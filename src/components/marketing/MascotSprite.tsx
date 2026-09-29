"use client";

import { motion } from "motion/react";

/** Fur tufts ring the head/shoulders (three interleaved lengths for a denser look), leaving a gap at the bottom for the legs. */
const TUFTS = [
  { x1: 53.0, y1: 32.0, x2: 59.0, y2: 32.0, o: 0.55 },
  { x1: 52.6, y1: 36.2, x2: 61.4, y2: 38.0, o: 0.7 },
  { x1: 51.3, y1: 40.1, x2: 54.9, y2: 41.8, o: 0.85 },
  { x1: 49.2, y1: 43.8, x2: 54.0, y2: 47.3, o: 0.55 },
  { x1: 16.8, y1: 43.8, x2: 12.0, y2: 47.3, o: 0.55 },
  { x1: 14.7, y1: 40.1, x2: 6.5, y2: 43.8, o: 0.7 },
  { x1: 13.4, y1: 36.2, x2: 9.5, y2: 37.0, o: 0.85 },
  { x1: 13.0, y1: 32.0, x2: 7.0, y2: 32.0, o: 0.55 },
  { x1: 13.4, y1: 27.8, x2: 4.6, y2: 26.0, o: 0.7 },
  { x1: 14.7, y1: 23.9, x2: 11.1, y2: 22.2, o: 0.85 },
  { x1: 16.8, y1: 20.2, x2: 12.0, y2: 16.7, o: 0.55 },
  { x1: 19.6, y1: 17.1, x2: 13.6, y2: 10.4, o: 0.7 },
  { x1: 23.0, y1: 14.7, x2: 21.0, y2: 11.2, o: 0.85 },
  { x1: 26.8, y1: 13.0, x2: 25.0, y2: 7.3, o: 0.55 },
  { x1: 30.9, y1: 12.1, x2: 30.0, y2: 3.2, o: 0.7 },
  { x1: 35.1, y1: 12.1, x2: 35.5, y2: 8.1, o: 0.85 },
  { x1: 39.2, y1: 13.0, x2: 41.0, y2: 7.3, o: 0.55 },
  { x1: 43.0, y1: 14.7, x2: 47.5, y2: 6.9, o: 0.7 },
  { x1: 46.4, y1: 17.1, x2: 49.1, y2: 14.2, o: 0.85 },
  { x1: 49.2, y1: 20.2, x2: 54.0, y2: 16.7, o: 0.55 },
  { x1: 51.3, y1: 23.9, x2: 59.5, y2: 20.2, o: 0.7 },
  { x1: 52.6, y1: 27.8, x2: 56.5, y2: 27.0, o: 0.85 },
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
