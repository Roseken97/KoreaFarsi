"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { markOnboarded } from "@/lib/onboarding";
import { SLIDES, type Slide } from "./slides";

const TONE: Record<Slide["tone"], string> = {
  teal: "bg-teal text-white",
  blush: "bg-blush text-ink",
  sage: "bg-sage text-ink",
  cream: "bg-cream-deep text-teal-deep",
};

export default function OnboardingPage() {
  const router = useRouter();
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

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

  function finish(to: string) {
    markOnboarded();
    router.replace(to);
  }

  return (
    <div className="flex min-h-dvh flex-col md:items-center md:justify-center md:p-8">
      <div className="flex w-full flex-1 flex-col md:max-w-md md:flex-none md:rounded-[2rem] md:bg-surface/80 md:py-8 md:shadow-lift">
        <div className="flex h-11 items-center justify-end px-6 pt-6 md:pt-0">
          <button
            onClick={() => finish("/home")}
            className={`text-sm font-medium text-ink-soft hover:text-ink ${isLast ? "invisible" : ""}`}
            tabIndex={isLast ? -1 : undefined}
          >
            رد شدن
          </button>
        </div>

        <div
          className="flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
        >
          {SLIDES.map((slide, i) => (
            <section
              key={slide.glyph}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-index={i}
              aria-roledescription="slide"
              aria-label={`${i + 1} از ${SLIDES.length}`}
              className="flex w-full shrink-0 snap-start flex-col items-center justify-center px-8 text-center"
            >
              <div
                className={`grid size-52 place-items-center rounded-[3rem] shadow-lift md:size-44 ${TONE[slide.tone]}`}
              >
                <span lang="ko" className="text-6xl font-bold md:text-5xl">
                  {slide.glyph}
                </span>
              </div>
              <p className="mt-3 text-xs text-ink-faint">{slide.glyphMeaning}</p>
              <h2 className="mt-8 text-2xl font-bold text-ink">{slide.title}</h2>
              <p className="mt-3 max-w-xs text-[15px] leading-7 text-ink-soft">{slide.body}</p>
            </section>
          ))}
        </div>

        <div className="flex justify-center gap-2 py-6" role="tablist" aria-label="اسلایدها">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`اسلاید ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-teal" : "w-2 bg-line"}`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 px-6 pb-8 md:pb-0">
          {isLast ? (
            <>
              <ButtonLink href="/auth/signup" onClick={markOnboarded}>
                ساخت حساب کاربری
              </ButtonLink>
              <ButtonLink href="/auth/login" variant="secondary" onClick={markOnboarded}>
                ورود
              </ButtonLink>
              <Link
                href="/home"
                onClick={markOnboarded}
                className="py-2 text-center text-sm font-medium text-ink-soft hover:text-ink"
              >
                فعلاً بدون ثبت‌نام ادامه می‌دهم
              </Link>
            </>
          ) : (
            <Button onClick={() => goTo(index + 1)}>بعدی</Button>
          )}
        </div>
      </div>
    </div>
  );
}
