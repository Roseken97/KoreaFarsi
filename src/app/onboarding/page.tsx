"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ArrowForwardIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/client";
import { markOnboarded } from "@/lib/onboarding";

/**
 * PROVISIONAL slide visuals: a Korean word on a brand-colored panel.
 * UX_SPECS asks for illustrations (Seoul, learning, culture) — swap each
 * panel for an <Image> once the 4 artworks exist. Copy lives in the i18n files.
 */
const VISUALS = [
  "bg-violet text-white",
  "bg-blush-soft text-ink",
  "bg-sage-soft text-teal-deep",
  "bg-cream-deep text-ink",
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function OnboardingPage() {
  const router = useRouter();
  const { m } = useI18n();
  const slides = m.onboarding.slides;
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  // Track the visible slide from native swipe/scroll (direction-agnostic, RTL-safe).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIndex(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { threshold: 0.6 },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function goTo(i: number) {
    slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  // Onboarding → Auth Welcome (Create account / Log in / Continue as guest).
  function finish() {
    markOnboarded();
    router.replace("/auth/welcome");
  }

  return (
    <div className="flex min-h-dvh flex-col md:items-center md:justify-center md:p-8">
      <div className="flex w-full flex-1 flex-col md:max-w-md md:flex-none md:rounded-[2rem] md:bg-surface/80 md:py-8 md:shadow-lift">
        <header className="flex items-center justify-between px-6 pt-6 md:pt-0">
          <Logo size={36} />
          <button
            onClick={finish}
            className={`text-sm font-medium text-ink-soft hover:text-ink ${isLast ? "invisible" : ""}`}
            tabIndex={isLast ? -1 : undefined}
          >
            {m.onboarding.skip}
          </button>
        </header>

        <div
          className="flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
        >
          {slides.map((slide, i) => (
            <section
              key={slide.glyph}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-index={i}
              aria-roledescription="slide"
              aria-label={`${pad(i + 1)} / ${pad(slides.length)}`}
              className="flex w-full shrink-0 snap-start flex-col justify-center px-6 py-6"
            >
              <div
                className={`relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[2rem] shadow-soft ${VISUALS[i]}`}
              >
                <span lang="ko" className="text-7xl font-bold md:text-6xl">
                  {slide.glyph}
                </span>
              </div>
              <p dir="ltr" className="mt-8 text-start text-xs font-semibold tracking-[0.2em] text-blush rtl:text-end">
                {pad(i + 1)} / {pad(slides.length)}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-ink">{slide.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-soft">{slide.body}</p>
            </section>
          ))}
        </div>

        <div className="flex items-center justify-between gap-6 px-6 pb-8 md:pb-0">
          <div className="flex gap-2" role="tablist">
            {slides.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`${pad(i + 1)} / ${pad(slides.length)}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-ink" : "w-2 bg-line"}`}
              />
            ))}
          </div>
          <Button onClick={isLast ? finish : () => goTo(index + 1)} className="w-auto! px-7">
            {isLast ? m.onboarding.getStarted : m.onboarding.next}
            <ArrowForwardIcon width={18} height={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
