"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { useI18n } from "@/lib/i18n/client";
import { hasOnboarded } from "@/lib/onboarding";

const SPLASH_MS = 1800;

/** Splash (sketch 01): brand moment, then first-run → onboarding, otherwise → home. */
export default function SplashPage() {
  const router = useRouter();
  const { m } = useI18n();

  useEffect(() => {
    const target = hasOnboarded() ? "/home" : "/onboarding";
    router.prefetch(target);
    const t = setTimeout(() => router.replace(target), SPLASH_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden">
      <div aria-hidden="true" className="absolute top-1/5 -left-24 size-80 rounded-full bg-blush/20 blur-3xl" />

      <div className="animate-fade-up relative flex flex-1 flex-col items-center justify-center px-6 pb-40 text-center">
        <LogoMark size={128} priority />
        <h1 dir="ltr" className="mt-6 font-[family-name:var(--font-playfair)] text-5xl font-semibold tracking-tight text-ink">
          KoreaFarsi
        </h1>
        <p className="mt-3 font-display text-lg text-ink-soft italic rtl:not-italic">{m.splash.tagline}</p>
        <span aria-hidden="true" className="my-5 h-px w-12 bg-blush" />
        <p className="text-sm text-ink-faint">{m.splash.subline}</p>

        <div className="mt-12 flex flex-col items-center gap-3" role="status">
          <span className="size-6 animate-spin rounded-full border-2 border-blush/30 border-t-blush" />
          <span className="text-xs tracking-wide text-ink-soft">{m.splash.loading}</span>
        </div>
      </div>

      <SeoulSkyline className="pointer-events-none absolute! inset-x-0 bottom-0 h-44 md:h-52" />
    </div>
  );
}
