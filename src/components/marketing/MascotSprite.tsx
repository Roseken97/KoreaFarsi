"use client";

import { motion } from "motion/react";

/** Small round mascot in the app's own palette — no stock assets, built to match the brand tokens. */
export function MascotSprite() {
  return (
    <motion.svg
      width={60}
      height={60}
      viewBox="0 0 52 52"
      fill="none"
      animate={{ scale: [1, 1.06, 1], rotate: [-3, 3, -3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <ellipse cx="26" cy="43" rx="13" ry="3.4" fill="var(--color-ink)" opacity="0.08" />
      <circle cx="15" cy="13" r="6.4" fill="var(--color-blush-soft)" />
      <circle cx="37" cy="13" r="6.4" fill="var(--color-blush-soft)" />
      <circle cx="15" cy="13" r="3.6" fill="var(--color-teal)" />
      <circle cx="37" cy="13" r="3.6" fill="var(--color-teal)" />
      <circle cx="26" cy="27" r="18" fill="var(--color-cream)" stroke="var(--color-line)" strokeWidth="1.5" />
      <circle cx="17.5" cy="31" r="2.8" fill="var(--color-blush)" opacity="0.7" />
      <circle cx="34.5" cy="31" r="2.8" fill="var(--color-blush)" opacity="0.7" />
      <path d="M18 24.5q2.7 3.6 5.4 0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
      <path d="M28.6 24.5q2.7 3.6 5.4 0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 33.5q5 3.6 10 0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </motion.svg>
  );
}
