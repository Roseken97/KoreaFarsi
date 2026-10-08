"use client";

import { useEffect, useRef, useState } from "react";

/** Counts the number inside a stat like "+11K" up from 0 the first time it scrolls into view. Server HTML keeps the final value. */
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = m ? Number(m[2]) : 0;
  const [n, setN] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!m || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 1800);
          setN(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per value
  }, [value]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {m && n !== null ? `${m[1]}${Math.round(n)}${m[3]}` : value}
    </span>
  );
}
