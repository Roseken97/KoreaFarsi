"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type Screen = { src: string; alt: string };

const DEPTH_LAYERS = 12;

/**
 * Scroll stage for the app section: a phone with real thickness turns in 3D while the
 * page scrolls, and the app screens scroll inside it, pausing on each one.
 * `children` render behind the phone (glow, orbits).
 */
export function Phone3D({ screens, children }: { screens: Screen[]; children?: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  const rotateY = useTransform(p, [0, 0.5, 1], [-38, 0, 26]);
  const rotateX = useTransform(p, [0, 0.5, 1], [16, 2, -8]);
  const rotateZ = useTransform(p, [0, 0.5, 1], [-7, 0, 5]);
  const scale = useTransform(p, [0, 0.25, 1], [0.86, 1, 0.96]);
  const glare = useTransform(p, [0, 1], ["-60%", "160%"]);

  const n = screens.length;
  const stops: number[] = [];
  const shifts: string[] = [];
  screens.forEach((_, i) => {
    const hold = (i + 0.15) / n;
    stops.push(Math.max(0, i / n), Math.min(1, hold + 0.55 / n));
    shifts.push(`${(-100 * i) / n}%`, `${(-100 * i) / n}%`);
  });
  const shift = useTransform(p, stops, shifts);

  return (
    <div ref={track} className="relative h-[260vh]">
      <div className="sticky top-0 z-10 flex h-dvh items-center justify-center overflow-clip">
        {children}
        <motion.div className="relative z-10 [perspective:1400px]" style={{ scale }}>
          <motion.div className="relative [transform-style:preserve-3d]" style={{ rotateY, rotateX, rotateZ }}>
            {Array.from({ length: DEPTH_LAYERS }, (_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-[46px]"
                style={{ transform: `translateZ(${-(i + 1) * 1.4}px)`, background: i === DEPTH_LAYERS - 1 ? "#120D24" : `hsl(258 ${30 - i}% ${26 - i}%)` }}
              />
            ))}
            <Body shift={shift} glare={glare} screens={screens} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Body({ screens, shift, glare }: { screens: Screen[]; shift: MotionValue<string>; glare: MotionValue<string> }) {
  return (
    <div
      className="relative w-[clamp(230px,24vw,300px)] rounded-[46px] bg-[#0E0A1C] p-2.5"
      style={{ boxShadow: "0 50px 100px rgba(0,0,0,0.55), 0 0 90px rgba(139,92,246,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.14)" }}
    >
      <div className="relative aspect-[780/1688] overflow-hidden rounded-[36px] bg-[#140E26]">
        <motion.div className="absolute inset-x-0 top-0" style={{ y: shift, height: `${screens.length * 100}%` }}>
          {screens.map((s) => (
            <div key={s.src} className="relative" style={{ height: `${100 / screens.length}%` }}>
              <Image src={s.src} alt={s.alt} fill sizes="300px" className="object-cover object-top" />
            </div>
          ))}
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          style={{ left: glare }}
        />
        <span aria-hidden="true" className="absolute top-2.5 left-1/2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
