"use client";

import { useEffect, useRef } from "react";

/**
 * Same sticky-stack math as the reference: each card sits in an 85vh sticky wrapper offset by
 * index*28px, and scales down toward targetScale = 1 - (total-1-index)*0.03 as the viewport
 * scrolls past it — driven by a raw scroll listener + rAF, not a normalized scroll-progress hook,
 * so the pacing matches exactly instead of feeling compressed.
 */
export function MethodStack({ steps, details }: { steps: string[]; details: string[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const total = steps.length;

  useEffect(() => {
    let ticking = false;
    function apply() {
      for (let i = 0; i < total; i++) {
        const card = cardRefs.current[i];
        const sticky = stickyRefs.current[i];
        if (!card || !sticky) continue;
        const r = sticky.getBoundingClientRect();
        const stickyTop = 96 + i * 28;
        const progress = Math.max(0, Math.min(1, (stickyTop - r.top) / (r.height * 0.6)));
        const targetScale = 1 - (total - 1 - i) * 0.03;
        const scale = 1 - (1 - targetScale) * progress;
        card.style.transform = `scale(${scale})`;
      }
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
  }, [total]);

  return (
    <div className="mx-auto max-w-xl">
      {steps.map((title, i) => (
        <div
          key={title}
          ref={(el) => {
            stickyRefs.current[i] = el;
          }}
          className="sticky h-[85vh]"
          style={{ top: `${96 + i * 28}px`, zIndex: i + 1 }}
        >
          <div
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="origin-top rounded-[28px] border-2 border-ink bg-surface p-6 shadow-lift will-change-transform sm:p-8"
          >
            <div className="flex items-start gap-5">
              <span className="shrink-0 font-display text-4xl font-black text-sage sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">{details[i]}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
