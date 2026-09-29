"use client";

import { motion } from "motion/react";

/** Denser fur ring than the small hero mascot — three interleaved lengths, wider gap left clear for the arms/legs. */
const TUFTS = [
  { x1: 109.0, y1: 64.0, x2: 117.0, y2: 64.0, o: 0.55 },
  { x1: 108.3, y1: 71.2, x2: 121.1, y2: 73.6, o: 0.7 },
  { x1: 106.4, y1: 78.1, x2: 112.0, y2: 80.3, o: 0.85 },
  { x1: 103.2, y1: 84.5, x2: 110.0, y2: 88.7, o: 0.55 },
  { x1: 36.8, y1: 84.5, x2: 31.7, y2: 87.7, o: 0.85 },
  { x1: 33.6, y1: 78.1, x2: 26.2, y2: 81.0, o: 0.55 },
  { x1: 31.7, y1: 71.2, x2: 18.9, y2: 73.6, o: 0.7 },
  { x1: 31.0, y1: 64.0, x2: 25.0, y2: 64.0, o: 0.85 },
  { x1: 31.7, y1: 56.8, x2: 23.8, y2: 55.4, o: 0.55 },
  { x1: 33.6, y1: 49.9, x2: 21.5, y2: 45.2, o: 0.7 },
  { x1: 36.8, y1: 43.5, x2: 31.7, y2: 40.3, o: 0.85 },
  { x1: 41.2, y1: 37.7, x2: 35.3, y2: 32.3, o: 0.55 },
  { x1: 46.5, y1: 32.9, x2: 38.7, y2: 22.5, o: 0.7 },
  { x1: 52.6, y1: 29.1, x2: 49.9, y2: 23.7, o: 0.85 },
  { x1: 59.3, y1: 26.5, x2: 57.1, y2: 18.8, o: 0.55 },
  { x1: 66.4, y1: 25.2, x2: 65.2, y2: 12.2, o: 0.7 },
  { x1: 73.6, y1: 25.2, x2: 74.2, y2: 19.2, o: 0.85 },
  { x1: 80.7, y1: 26.5, x2: 82.9, y2: 18.8, o: 0.55 },
  { x1: 87.4, y1: 29.1, x2: 93.2, y2: 17.5, o: 0.7 },
  { x1: 93.5, y1: 32.9, x2: 97.1, y2: 28.1, o: 0.85 },
  { x1: 98.8, y1: 37.7, x2: 104.7, y2: 32.3, o: 0.55 },
  { x1: 103.2, y1: 43.5, x2: 114.2, y2: 36.6, o: 0.7 },
  { x1: 106.4, y1: 49.9, x2: 112.0, y2: 47.7, o: 0.85 },
  { x1: 108.3, y1: 56.8, x2: 116.2, y2: 55.4, o: 0.55 },
] as const;

/** Bigger, seated pose: sits in its own little nook and waves — replaces the wandering site-wide mascot. */
export function MascotCorner() {
  return (
    <motion.svg
      width={132}
      height={150}
      viewBox="0 0 140 150"
      fill="none"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* ground */}
      <ellipse cx="70" cy="140" rx="48" ry="6" fill="var(--color-ink)" opacity="0.08" />
      <ellipse cx="70" cy="136" rx="54" ry="11" fill="var(--color-sage-soft)" />

      {/* sitting legs */}
      <ellipse cx="52" cy="119" rx="14" ry="10" fill="var(--color-teal-deep)" transform="rotate(-12 52 119)" />
      <ellipse cx="88" cy="119" rx="14" ry="10" fill="var(--color-teal-deep)" transform="rotate(12 88 119)" />

      {/* resting arm */}
      <ellipse cx="27" cy="82" rx="9.5" ry="14" fill="var(--color-teal)" transform="rotate(-14 27 82)" />

      {/* body */}
      <circle cx="70" cy="64" r="40" fill="var(--color-teal)" />
      <ellipse cx="55" cy="42" rx="17" ry="12" fill="var(--color-teal-mist)" opacity="0.35" />

      {/* fur */}
      {TUFTS.map((t, i) => (
        <path
          key={i}
          d={`M${t.x1} ${t.y1} L${t.x2} ${t.y2}`}
          stroke="var(--color-teal-deep)"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity={t.o}
        />
      ))}

      {/* eyes */}
      <circle cx="58" cy="60" r="17" fill="var(--color-cream)" />
      <circle cx="91" cy="66" r="13" fill="var(--color-cream)" />
      <circle cx="61" cy="64" r="9.5" fill="var(--color-ink)" />
      <circle cx="94" cy="70" r="7" fill="var(--color-ink)" />
      <circle cx="55" cy="56" r="2.8" fill="var(--color-cream)" />
      <circle cx="90" cy="64" r="2.2" fill="var(--color-cream)" />

      {/* smile */}
      <path d="M52 90 Q70 102 92 88" stroke="var(--color-teal-deep)" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* waving arm, pivoting from the shoulder */}
      <motion.g
        style={{ transformOrigin: "106px 60px" }}
        animate={{ rotate: [0, -8, 24, -8, 24, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
      >
        <ellipse cx="106" cy="82" rx="10" ry="15" fill="var(--color-teal)" />
      </motion.g>
    </motion.svg>
  );
}
