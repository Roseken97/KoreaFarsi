"use client";

import { useEffect, useRef } from "react";

type Word = { ko: string; gloss: string };

const ACCENTS = ["bg-teal-mist text-teal-deep", "bg-blush-soft text-blush", "bg-sage-soft text-teal-deep"];

function Tile({ w, i }: { w: Word; i: number }) {
  return (
    <div className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl px-6 py-4 ${ACCENTS[i % ACCENTS.length]}`}>
      <span className="font-display text-xl font-semibold">{w.ko}</span>
      <span className="text-xs font-medium opacity-80">{w.gloss}</span>
    </div>
  );
}

/**
 * Same scroll-offset formula as the reference: offset = (scrollY - sectionTop + innerHeight) * 0.3,
 * applied continuously off the raw page scroll position (not normalized to the section's own transit),
 * so it keeps the same big, continuous sweep instead of a short in-view-only drift.
 */
export function VocabMarquee({ eyebrow, words }: { eyebrow: string; words: Word[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  const mid = Math.ceil(words.length / 2);
  const row1 = [...words.slice(0, mid), ...words.slice(0, mid), ...words.slice(0, mid)];
  const row2 = [...words.slice(mid), ...words.slice(mid), ...words.slice(mid)];

  useEffect(() => {
    let ticking = false;
    function apply() {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      if (track1Ref.current) track1Ref.current.style.transform = `translateX(${offset - 400}px)`;
      if (track2Ref.current) track2Ref.current.style.transform = `translateX(${-(offset - 400)}px)`;
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
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-14">
      <p className="mb-6 text-center text-xs font-semibold tracking-wide text-ink-faint uppercase">{eyebrow}</p>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden">
          <div ref={track1Ref} className="flex w-max gap-3" style={{ willChange: "transform" }}>
            {row1.map((w, i) => (
              <Tile key={i} w={w} i={i} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div ref={track2Ref} className="flex w-max gap-3" style={{ willChange: "transform" }}>
            {row2.map((w, i) => (
              <Tile key={i} w={w} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
