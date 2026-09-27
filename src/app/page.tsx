"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { hasOnboarded } from "@/lib/onboarding";

const SPLASH_MS = 1600;

/** Splash (sketch 01): brand moment, then first-run → onboarding, otherwise → home. */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const target = hasOnboarded() ? "/home" : "/onboarding";
    router.prefetch(target);
    const t = setTimeout(() => router.replace(target), SPLASH_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden">
      <div aria-hidden="true" className="absolute top-1/4 -left-24 size-80 rounded-full bg-blush/40 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 bottom-1/4 size-80 rounded-full bg-sage/40 blur-3xl" />

      <div className="animate-fade-up relative flex flex-col items-center text-center">
        <LogoMark size={96} />
        <h1 className="mt-6 text-3xl font-bold text-ink">کره‌فارسی</h1>
        <p className="mt-1 text-sm font-medium tracking-[0.2em] text-ink-soft" dir="ltr">
          KOREAFARSI
        </p>
      </div>

      <p className="animate-fade-up absolute bottom-10 text-xs text-ink-faint [animation-delay:300ms]">
        یادگیری کره‌ای، به زبان خودت
      </p>
    </div>
  );
}
