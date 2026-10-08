"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed, muted, looping hero film with a pause/play control
 * (moving content longer than 5s must be stoppable — WCAG 2.2.2).
 * Starts paused under prefers-reduced-motion; the poster frame shows instead.
 */
export function HeroVideo({ playLabel, pauseLabel }: { playLabel: string; pauseLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Mirrors the element's real state via its play/pause events.
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  return (
    <>
      <video
        ref={ref}
        src="/landing/hero.mp4"
        poster="/landing/hero-poster.webp"
        muted
        loop
        playsInline
        preload="auto"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? playLabel : pauseLabel}
        className="absolute bottom-7 end-6 z-30 grid size-11 place-items-center rounded-full border border-white/35 bg-[#140E26]/40 text-white backdrop-blur-md"
      >
        {paused ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4l13 8-13 8z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        )}
      </button>
    </>
  );
}
