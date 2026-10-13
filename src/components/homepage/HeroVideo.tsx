"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed, muted, looping hero film (no on-screen control, at Rose's request).
 * Stays on the poster frame under prefers-reduced-motion.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src="/landing/hero.mp4"
      poster="/landing/hero-poster.webp"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
    />
  );
}
