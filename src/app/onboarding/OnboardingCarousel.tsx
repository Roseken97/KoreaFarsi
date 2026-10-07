"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowForwardIcon } from "@/components/icons";
import { ONBOARDING_SCENES } from "@/components/illustrations/OnboardingArt";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/config";
import { markOnboarded } from "@/lib/onboarding";
import { SLIDE_COLORS, type OnboardingSlide } from "@/lib/onboarding-slides/types";

/**
 * Full-height slides: a palette tint at the top behind a two-tone headline, then the slide's photo
 * filling the rest and fading into the tint. One white pill button, the log-in line and the pager
 * float over the bottom of the photo.
 */
export function OnboardingCarousel({ slides }: { slides: OnboardingSlide[] }) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.onboarding;
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const current = SLIDE_COLORS[slides[index]?.color ?? "peach"];

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
  }, [slides.length]);

  function goTo(i: number) {
    slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function leave(path: string) {
    markOnboarded();
    router.replace(path);
  }

  return (
    <div className="min-h-dvh bg-white md:grid md:place-items-center md:bg-cream-deep md:p-8">
      <div className="relative h-dvh w-full overflow-hidden bg-white md:h-[min(860px,calc(100dvh-4rem))] md:max-w-[420px] md:rounded-[2rem] md:shadow-lift">
        <div
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
        >
          {slides.map((slide, i) => {
            const c = SLIDE_COLORS[slide.color];
            return (
              <section
                key={slide.key}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                data-index={i}
                aria-roledescription="slide"
                aria-label={fmt(t.slideLabel, { n: i + 1, total: slides.length })}
                className="relative flex h-full w-full shrink-0 snap-start flex-col"
                style={{ background: `linear-gradient(to bottom, ${c.tint} 0%, #ffffff 62%)` }}
              >
                {/* the text rises in again each time its slide becomes the current one */}
                <div className={`px-7 pt-[calc(env(safe-area-inset-top)+4.75rem)] ${i === index ? "kf-stagger" : "opacity-0"}`}>
                  {slide.badge && (
                    <span lang="ko" className="inline-flex rounded-full bg-white/80 px-3.5 py-1 text-sm font-bold shadow-[0_6px_16px_-10px_rgb(30_35_64/0.35)]" style={{ color: c.accent }}>
                      {slide.badge}
                    </span>
                  )}
                  <h2 className="mt-4 text-[30px] leading-[1.3] font-bold text-ink">
                    {slide.title}
                    {slide.accent && (
                      <>
                        <br />
                        <span style={{ color: c.accent }}>{slide.accent}</span>
                      </>
                    )}
                  </h2>
                  {slide.body && <p className="mt-3 max-w-[22rem] text-[15px] leading-7 text-ink-soft">{slide.body}</p>}
                  <span aria-hidden="true" className="mt-5 block h-1 w-9 rounded-full" style={{ background: c.accent }} />
                </div>

                <div className="relative mt-6 flex-1" aria-hidden="true">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 420px, 100vw"
                      priority={i === 0}
                      className="object-cover"
                      // the photo dissolves into the tint above instead of starting on a hard edge
                      style={{ maskImage: "linear-gradient(to bottom, transparent 0%, #000 22%)" }}
                    />
                  ) : (
                    <SlideArt index={i} base={c.base} />
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {!isLast && (
          <button
            onClick={() => leave("/auth/welcome")}
            className="absolute end-5 top-[calc(env(safe-area-inset-top)+1.25rem)] rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-ink shadow-[0_6px_16px_-10px_rgb(30_35_64/0.35)] backdrop-blur"
          >
            {t.skip}
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent via-white/85 to-white px-6 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto flex flex-col items-center gap-4">
            <button
              onClick={isLast ? () => leave("/auth/signup") : () => goTo(index + 1)}
              className="relative flex h-14 w-full items-center justify-center rounded-full bg-white text-[15px] font-semibold text-ink shadow-[0_14px_32px_-14px_rgb(30_35_64/0.35)] transition active:scale-[0.98]"
            >
              {isLast ? t.getStarted : t.next}
              <ArrowForwardIcon width={20} height={20} className="absolute end-6 transition-colors" style={{ color: current.accent }} />
            </button>
            <p className="text-sm text-ink-soft">
              {t.haveAccount}{" "}
              <button onClick={() => leave("/auth/login")} className="font-semibold underline underline-offset-4" style={{ color: current.accent }}>
                {t.loginLink}
              </button>
            </p>
            <div className="flex gap-2" role="tablist">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={fmt(t.slideLabel, { n: i + 1, total: slides.length })}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6" : "w-2 bg-line"}`}
                  style={i === index ? { background: current.accent } : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Stand-in until a photo is uploaded in /admin/onboarding: the slide's soft-3D scene, tinted by its color. */
function SlideArt({ index, base }: { index: number; base: string }) {
  const Scene = ONBOARDING_SCENES[index % ONBOARDING_SCENES.length];
  return (
    <div className="absolute inset-x-0 top-0 bottom-36 flex items-start justify-center px-4">
      <Scene base={base} className="h-full max-h-[26rem] w-full drop-shadow-[0_18px_30px_rgb(30_35_64/0.12)]" />
    </div>
  );
}
