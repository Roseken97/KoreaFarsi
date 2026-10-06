"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { hasOnboarded } from "@/lib/onboarding";

/** Paper colour the intro film was recoloured to; the page matches it so the film's edges disappear. */
const FILM_BG = "#fdf5ed";
/** Leave anyway if the film can't load or stalls (it runs 6s). */
const MAX_MS = 8000;

/**
 * Splash: the logo intro film with its sound, then first-run → onboarding, otherwise → home.
 * This is the PWA's start_url — installed-app opens land here, not on the public marketing page at "/".
 * Browsers block autoplay with sound until the user has interacted, so when the unmuted play is
 * refused the film plays muted and a small button offers the sound.
 */
export default function SplashPage() {
  const router = useRouter();
  const { m } = useI18n();
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const target = hasOnboarded() ? "/home" : "/onboarding";
    router.prefetch(target);
    const leave = () => router.replace(target);
    const el = video.current;
    const fallback = setTimeout(leave, MAX_MS);

    // With <source> children, a load failure fires on the last source, not on the video.
    const lastSource = el?.querySelector("source:last-of-type");
    if (el) {
      el.addEventListener("ended", leave);
      lastSource?.addEventListener("error", leave);
      el.play().catch(() => {
        el.muted = true;
        setMuted(true);
        el.play().catch(leave);
      });
    }
    return () => {
      clearTimeout(fallback);
      el?.removeEventListener("ended", leave);
      lastSource?.removeEventListener("error", leave);
    };
  }, [router]);

  function unmute() {
    if (!video.current) return;
    video.current.muted = false;
    setMuted(false);
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden" style={{ background: FILM_BG }}>
      <h1 className="sr-only">KoreaFarsi</h1>
      <p className="sr-only" role="status">
        {m.splash.loading}
      </p>
      <video
        ref={video}
        poster="/splash/logo-intro-poster.jpg"
        playsInline
        preload="auto"
        aria-hidden="true"
        className="h-dvh w-full max-w-[min(100%,calc(100dvh*9/16))] object-cover"
        // On wide screens the film is a column; fading its sides hides the paper texture's edge.
        style={{ maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)" }}
      >
        {/* WebM is half the size; Safari takes the MP4. */}
        <source src="/splash/logo-intro.webm" type="video/webm" />
        <source src="/splash/logo-intro.mp4" type="video/mp4" />
      </video>
      {muted && (
        <button
          type="button"
          onClick={unmute}
          aria-label={m.splash.sound}
          className="absolute end-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] grid size-11 place-items-center rounded-full bg-white/70 text-ink shadow-soft backdrop-blur"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
            <path d="m16 9.5 5 5M21 9.5l-5 5" />
          </svg>
        </button>
      )}
    </div>
  );
}
