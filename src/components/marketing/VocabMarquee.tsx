"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Word = { ko: string; gloss: string };

const ACCENTS = ["bg-teal-mist text-teal-deep", "bg-blush-soft text-blush", "bg-sage-soft text-teal-deep"];

function Row({ words, direction }: { words: Word[]; direction: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, direction * -280]);
  const tripled = [...words, ...words, ...words];

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div className="flex w-max gap-3" style={{ x }}>
        {tripled.map((w, i) => (
          <div
            key={i}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl px-6 py-4 ${ACCENTS[i % ACCENTS.length]}`}
          >
            <span className="font-display text-xl font-semibold">{w.ko}</span>
            <span className="text-xs font-medium opacity-80">{w.gloss}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** A scroll-driven two-row marquee previewing real vocabulary from the curriculum — same scroll-linked technique as the reference, real content instead of stock images. */
export function VocabMarquee({ eyebrow, words }: { eyebrow: string; words: Word[] }) {
  const mid = Math.ceil(words.length / 2);
  const row1 = words.slice(0, mid);
  const row2 = words.slice(mid);

  return (
    <section className="relative py-14">
      <p className="mb-6 text-center text-xs font-semibold tracking-wide text-ink-faint uppercase">{eyebrow}</p>
      <div className="flex flex-col gap-3">
        <Row words={row1} direction={1} />
        <Row words={row2} direction={-1} />
      </div>
    </section>
  );
}
