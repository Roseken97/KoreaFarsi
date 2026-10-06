"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { hasOnboarded } from "@/lib/onboarding";

/**
 * The film's background gradient, redrawn in CSS so the page around the film matches it. The film is always
 * 100dvh tall and centred, so stops are in dvh. Keep in sync with scripts/splash_gradient.py.
 */
const SPLASH_BG = [
  "radial-gradient(45dvh circle at 50% 45%, rgb(255 249 242 / 0.85) 0, rgb(255 249 242 / 0.6) 18dvh, rgb(255 249 242 / 0.2) 33.75dvh, rgb(255 249 242 / 0) 45dvh)",
  "radial-gradient(55dvh circle at 50% 100%, rgb(242 199 209 / 0.45) 0, rgb(242 199 209 / 0.2) 27.5dvh, rgb(242 199 209 / 0) 55dvh)",
  "linear-gradient(#fff9f2 0%, #f8dde3 55%, #f3e7d7 100%)",
].join(", ");
/** If the film hasn't started by then (slow network, autoplay blocked), show the finished logo instead. */
const STALL_MS = 3000;
/** How long the still logo stays before moving on. */
const STILL_MS = 2200;
/** Leave no matter what (the film runs 6s). */
const MAX_MS = 12000;

/**
 * Splash: the logo intro film with its sound, then first-run → onboarding, otherwise → home.
 * This is the PWA's start_url — installed-app opens land here, not on the public marketing page at "/".
 * Browsers block autoplay with sound until the user has interacted, so when the unmuted play is
 * refused the film plays muted and a small button offers the sound. When even muted playback is
 * refused (iOS Low Power Mode, data saver) or the film is slow to arrive, the finished logo shows as
 * a still for a moment instead of a blank screen.
 */
export default function SplashPage() {
  const router = useRouter();
  const { m } = useI18n();
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const target = hasOnboarded() ? "/home" : "/onboarding";
    router.prefetch(target);
    const el = video.current;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let settled = false;

    const leave = () => router.replace(target);
    const showStill = () => {
      if (settled) return;
      settled = true;
      el?.pause();
      setStill(true);
      timers.push(setTimeout(leave, STILL_MS));
    };
    const onPlaying = () => clearTimeout(stall);
    const stall = setTimeout(showStill, STALL_MS);
    timers.push(stall, setTimeout(leave, MAX_MS));

    // With <source> children, a load failure fires on the last source, not on the video.
    const lastSource = el?.querySelector("source:last-of-type");
    if (el) {
      el.addEventListener("playing", onPlaying);
      el.addEventListener("ended", leave);
      lastSource?.addEventListener("error", showStill);
      el.play().catch(() => {
        el.muted = true;
        setMuted(true);
        el.play().catch(showStill);
      });
    }
    return () => {
      timers.forEach(clearTimeout);
      el?.removeEventListener("playing", onPlaying);
      el?.removeEventListener("ended", leave);
      lastSource?.removeEventListener("error", showStill);
    };
  }, [router]);

  function unmute() {
    if (!video.current) return;
    video.current.muted = false;
    setMuted(false);
  }

  return (
    <div className="relative grid h-dvh place-items-center overflow-hidden" style={{ background: SPLASH_BG }}>
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
        // On wide screens the film is a column; softening its sides hides any seam with the CSS gradient.
        style={{ maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)" }}
      >
        {/* WebM is half the size; Safari takes the MP4. */}
        <source src="/splash/logo-intro.webm" type="video/webm" />
        <source src="/splash/logo-intro.mp4" type="video/mp4" />
      </video>
      {still && (
        // eslint-disable-next-line @next/next/no-img-element -- a fixed-size local still; next/image adds nothing here
        <img
          src="/splash/logo-still.jpg"
          alt=""
          className="absolute inset-0 mx-auto h-dvh w-full max-w-[min(100%,calc(100dvh*9/16))] object-cover"
          style={{ maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)" }}
        />
      )}
      {muted && !still && (
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
