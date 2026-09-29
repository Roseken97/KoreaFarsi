"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function StackCard({
  title,
  detail,
  index,
  total,
}: {
  title: string;
  detail: string;
  index: number;
  total: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={wrapperRef} className="relative h-[46vh] sm:h-[40vh]">
      <div className="sticky" style={{ top: `${88 + index * 16}px` }}>
        <motion.div
          style={{ scale }}
          className="origin-top rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-8"
        >
          <div className="flex items-start gap-5">
            <span className="shrink-0 font-display text-4xl font-black text-sage sm:text-5xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">{detail}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Sticky-stacking cards (same scale-down-as-you-scroll-past technique as the reference's project stack), applied to the real 7-step vocabulary methodology instead of project renders. */
export function MethodStack({ steps, details }: { steps: string[]; details: string[] }) {
  return (
    <div className="mx-auto max-w-xl">
      {steps.map((title, i) => (
        <StackCard key={title} title={title} detail={details[i]} index={i} total={steps.length} />
      ))}
    </div>
  );
}
