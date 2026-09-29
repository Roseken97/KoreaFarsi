"use client";

import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Hangul jamo — the alphabet KoreaFarsi actually teaches, not decorative filler text. */
const HANGUL = [
  "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  "ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ",
];

const GLOW = ["var(--color-teal)", "var(--color-blush)", "var(--color-sage)"] as const;

/** 8 fixed regions (outer ring of a 3x3 grid) so letters spread out instead of clustering. */
const SLOTS = [
  { x: 16, y: 18 },
  { x: 50, y: 13 },
  { x: 84, y: 18 },
  { x: 14, y: 50 },
  { x: 86, y: 50 },
  { x: 16, y: 84 },
  { x: 50, y: 89 },
  { x: 84, y: 84 },
];

/** The mascot's wandering loop — visits every slot's neighborhood once per lap. */
const PATH_X = [16, 50, 84, 86, 84, 50, 16, 14, 16];
const PATH_Y = [18, 13, 18, 50, 84, 89, 84, 50, 18];

const COLLISION_RADIUS = 10;

let uid = 0;

function randomChar() {
  return HANGUL[Math.floor(Math.random() * HANGUL.length)];
}

function jitter(base: number, amount = 4) {
  return base + (Math.random() * 2 - 1) * amount;
}

type LetterNode = {
  id: number;
  slot: number;
  char: string;
  x: number;
  y: number;
  glow: string;
  status: "idle" | "bursting";
  floatDur: number;
  floatDelay: number;
  tiltDur: number;
  tiltDelay: number;
};

type Particle = { id: number; x: number; y: number; angle: number; distance: number; color: string };

function makeLetter(slot: number): LetterNode {
  const base = SLOTS[slot];
  return {
    id: uid++,
    slot,
    char: randomChar(),
    x: jitter(base.x),
    y: jitter(base.y),
    glow: GLOW[Math.floor(Math.random() * GLOW.length)],
    status: "idle",
    floatDur: 3 + Math.random() * 2.5,
    floatDelay: Math.random() * 2,
    tiltDur: 6 + Math.random() * 4,
    tiltDelay: Math.random() * 2,
  };
}

/**
 * Hero centerpiece: Hangul letters tumble in 3D as if adrift in zero gravity;
 * a wandering mascot "pops" whichever one it drifts into into a burst of light,
 * and a new letter fades back in in its place a moment later.
 */
export function HeroLetterScene() {
  const [letters, setLetters] = useState<LetterNode[]>(() => SLOTS.map((_, i) => makeLetter(i)));
  const [particles, setParticles] = useState<Particle[]>([]);
  const lettersRef = useRef(letters);
  useEffect(() => {
    lettersRef.current = letters;
  }, [letters]);

  const mascotX = useMotionValue(PATH_X[0]);
  const mascotY = useMotionValue(PATH_Y[0]);
  const left = useTransform(mascotX, (v) => `${v}%`);
  const top = useTransform(mascotY, (v) => `${v}%`);

  useEffect(() => {
    const cx = animate(mascotX, PATH_X, { duration: 24, repeat: Infinity, repeatType: "loop", ease: "easeInOut" });
    const cy = animate(mascotY, PATH_Y, { duration: 24, repeat: Infinity, repeatType: "loop", ease: "easeInOut" });
    return () => {
      cx.stop();
      cy.stop();
    };
  }, [mascotX, mascotY]);

  function burst(letter: LetterNode) {
    setLetters((prev) => prev.map((l) => (l.id === letter.id ? { ...l, status: "bursting" } : l)));
    const bits: Particle[] = Array.from({ length: 9 }, (_, i) => ({
      id: uid++,
      x: letter.x,
      y: letter.y,
      angle: (360 / 9) * i + Math.random() * 18,
      distance: 24 + Math.random() * 28,
      color: letter.glow,
    }));
    setParticles((prev) => [...prev, ...bits]);
    window.setTimeout(
      () => setLetters((prev) => prev.map((l) => (l.id === letter.id ? makeLetter(l.slot) : l))),
      1500 + Math.random() * 900,
    );
  }

  useAnimationFrame(() => {
    const mx = mascotX.get();
    const my = mascotY.get();
    for (const letter of lettersRef.current) {
      if (letter.status !== "idle") continue;
      if (Math.hypot(letter.x - mx, letter.y - my) < COLLISION_RADIUS) burst(letter);
    }
  });

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: 900 }} aria-hidden="true">
      {letters.map((letter) => (
        <motion.div
          key={letter.id}
          className="absolute grid place-items-center rounded-2xl text-lg font-bold text-white select-none md:text-xl"
          style={{
            left: `${letter.x}%`,
            top: `${letter.y}%`,
            width: 38,
            height: 38,
            marginLeft: -19,
            marginTop: -19,
            background: letter.glow,
            boxShadow: `0 6px 18px -4px ${letter.glow}`,
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={
            letter.status === "bursting"
              ? { opacity: 0, scale: 0.2 }
              : { opacity: 1, scale: 1, y: [0, -10, 0], rotateY: [0, 180, 360], rotateX: [0, 90, 0] }
          }
          transition={
            letter.status === "bursting"
              ? { duration: 0.22 }
              : {
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5, type: "spring", stiffness: 260, damping: 18 },
                  y: { duration: letter.floatDur, delay: letter.floatDelay, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: letter.tiltDur, delay: letter.tiltDelay, repeat: Infinity, ease: "linear" },
                  rotateX: { duration: letter.tiltDur * 1.3, delay: letter.tiltDelay, repeat: Infinity, ease: "easeInOut" },
                }
          }
        >
          {letter.char}
        </motion.div>
      ))}

      <motion.div className="absolute z-10" style={{ left, top, x: "-50%", y: "-50%" }}>
        <MascotSprite />
      </motion.div>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: 6,
              height: 6,
              marginLeft: -3,
              marginTop: -3,
              background: p.color,
              boxShadow: `0 0 8px 2px ${p.color}`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
              scale: 0.2,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => setParticles((prev) => prev.filter((x) => x.id !== p.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Small round mascot in the app's own palette — no stock assets, built to match the brand tokens. */
function MascotSprite() {
  return (
    <motion.svg
      width={52}
      height={52}
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
