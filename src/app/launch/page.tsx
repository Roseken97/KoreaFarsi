"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { useI18n } from "@/lib/i18n/client";
import { hasOnboarded } from "@/lib/onboarding";

const SPLASH_MS = 2600;
const PARTICLE_COUNT = 20;
const PARTICLE_COLORS = ["var(--color-violet)", "var(--color-clay)", "var(--color-indigo)", "var(--color-gold)"];

/** Deterministic (no Math.random) so server and client render the same positions — avoids hydration mismatch. */
function useParticles() {
  return useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radius = 130 + (i % 4) * 18;
        return {
          id: i,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          size: 6 + (i % 3) * 2,
          color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
          delay: (i % 6) * 0.035,
        };
      }),
    [],
  );
}

/** Splash (sketch 01): brand moment, then first-run → onboarding, otherwise → home. This is the PWA's start_url — installed-app opens land here, not on the public marketing page at "/". */
export default function SplashPage() {
  const router = useRouter();
  const { m } = useI18n();
  const particles = useParticles();
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    const target = hasOnboarded() ? "/home" : "/onboarding";
    router.prefetch(target);
    const toRisen = setTimeout(() => setRisen(true), 1350);
    const toNext = setTimeout(() => router.replace(target), SPLASH_MS);
    return () => {
      clearTimeout(toRisen);
      clearTimeout(toNext);
    };
  }, [router]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden">
      <div aria-hidden="true" className="absolute top-1/5 -left-24 size-80 rounded-full bg-blush/20 blur-3xl" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-40 text-center">
        {/* Particles converge toward the center, then the mark is revealed with a diagonal wipe */}
        <div className="relative grid h-32 w-32 place-items-center">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden="true"
              className="absolute rounded-full"
              style={{ width: p.size, height: p.size, background: p.color }}
              initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.5 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.4] }}
              transition={{ duration: 0.85, delay: p.delay, times: [0, 0.3, 0.75, 1], ease: "easeInOut" }}
            />
          ))}

          <motion.div animate={{ y: risen ? -14 : 0 }} transition={{ type: "spring", stiffness: 140, damping: 15 }}>
            <div className="kf-splash-reveal">
              <LogoMark size={96} priority />
            </div>
          </motion.div>
        </div>

        <motion.h1
          dir="ltr"
          initial={{ opacity: 0, y: 10 }}
          animate={risen ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-6 font-[family-name:var(--font-playfair)] text-5xl font-semibold tracking-tight text-ink"
        >
          KoreaFarsi
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={risen ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <p className="mt-3 font-display text-lg text-ink-soft italic rtl:not-italic">{m.splash.tagline}</p>
          <span aria-hidden="true" className="my-5 h-px w-12 bg-blush" />
          <p className="text-sm text-ink-faint">{m.splash.subline}</p>

          <div className="mt-12 flex flex-col items-center gap-3" role="status">
            <span className="size-6 animate-spin rounded-full border-2 border-blush/30 border-t-blush" />
            <span className="text-xs tracking-wide text-ink-soft">{m.splash.loading}</span>
          </div>
        </motion.div>
      </div>

      <SeoulSkyline className="pointer-events-none absolute! inset-x-0 bottom-0 h-44 md:h-52" />
    </div>
  );
}
