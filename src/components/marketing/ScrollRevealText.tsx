"use client";

import { useEffect, useRef } from "react";

/**
 * Same scroll-progress formula as the reference (progress mapped from the paragraph's position
 * between 80% and 20% of the viewport height, driven by a raw scroll listener), applied at the
 * WORD level instead of per character — Persian letters join within a word, so splitting per
 * character like the English reference would break that joining.
 */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLSpanElement>("span[data-word]");
    let ticking = false;

    function apply() {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.2;
      let progress = (start - r.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      const n = spans.length;
      spans.forEach((span, i) => {
        const wordProgress = i / n;
        span.style.opacity = progress >= wordProgress ? "1" : "0.25";
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} data-word style={{ opacity: 0.25, transition: "opacity 0.15s linear" }} className="inline-block">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
