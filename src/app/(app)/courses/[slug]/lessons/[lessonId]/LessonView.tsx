"use client";

import Link from "next/link";
import { useState, useTransition, type ComponentType, type SVGProps } from "react";
import { CheckIcon, ChevronIcon, DictionaryIcon, PencilIcon, PlayIcon, ShieldIcon, TagIcon } from "@/components/icons";
import { HangulBreakdown } from "@/components/courses/HangulBreakdown";
import { HangulChart } from "@/components/courses/HangulChart";
import { VocabFlashcards } from "@/components/courses/VocabFlashcards";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { toggleLessonDone } from "@/lib/courses/actions";
import type { CourseLesson } from "@/lib/courses/types";
import { fmt, formatNumber, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

type VideoError = "unauthenticated" | "forbidden" | "unavailable" | "generic" | null;
type StepKey = "content" | "script" | "vocabulary" | "notes";
type Step = { key: StepKey; title: string; subtitle: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

export function LessonView({
  lesson,
  courseSlug,
  locale,
  isDone,
  videoUrl,
  videoError,
  prevHref,
  nextHref,
}: {
  lesson: CourseLesson;
  courseSlug: string;
  locale: Locale;
  isDone: boolean;
  videoUrl: string | null;
  videoError: VideoError;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const { m } = useI18n();
  const t = m.courses.lesson;
  const isSlides = lesson.content_type === "slides";
  const [slideIndex, setSlideIndex] = useState(0);
  const [done, setDone] = useState(isDone);
  const [pending, startTransition] = useTransition();
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0);

  const script = locale === "en" ? lesson.script_en || lesson.script : lesson.script;
  const slide = lesson.slides[slideIndex];

  const steps: Step[] = [{ key: "content", title: isSlides ? t.tabs.slides : t.tabs.video, subtitle: t.pathHints.content, Icon: PlayIcon }];
  if (script) steps.push({ key: "script", title: t.tabs.script, subtitle: t.pathHints.script, Icon: PencilIcon });
  if (lesson.vocabulary.length > 0) {
    steps.push({ key: "vocabulary", title: t.tabs.vocabulary, subtitle: fmt(t.pathHints.vocabulary, { n: formatNumber(lesson.vocabulary.length, locale) }), Icon: TagIcon });
  }
  if (lesson.notes) steps.push({ key: "notes", title: t.tabs.notes, subtitle: t.pathHints.notes, Icon: DictionaryIcon });

  function toggle() {
    const next = !done;
    setDone(next);
    startTransition(async () => {
      const result = await toggleLessonDone(lesson.id, next, courseSlug);
      if (!result.ok) setDone(!next);
    });
  }

  /** Called once the current step has actually been seen (video ended, last slide/flashcard, or the reader taps Next). */
  function advance() {
    const next = Math.min(activeIndex + 1, steps.length - 1);
    setUnlockedIndex((u) => Math.max(u, next));
    setActiveIndex(next);
  }

  const activeKey = steps[activeIndex].key;
  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Display — content switches to whichever step is active in the path below */}
      {activeKey === "content" &&
        (isSlides ? (
          lesson.slides.length === 0 ? (
            <p className="rounded-card bg-surface p-4 text-sm text-ink-soft shadow-soft">{t.noSlides}</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="min-h-64 rounded-card bg-surface p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold text-ink" dir="auto">
                  {locale === "en" ? slide.title_en || slide.title : slide.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 whitespace-pre-line text-ink-soft" dir="auto">
                  {locale === "en" ? slide.body_en || slide.body : slide.body}
                </p>
                {slide.chart && <HangulChart chart={slide.chart} />}
                {slide.ko && <HangulBreakdown word={slide.ko} className="mt-6" />}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                  disabled={slideIndex === 0}
                  className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30"
                >
                  <ChevronIcon width={16} height={16} className="rotate-180 rtl:rotate-0" />
                </button>
                <div className="flex gap-1.5">
                  {lesson.slides.map((_, i) => (
                    <span key={i} className={`size-1.5 rounded-full ${i === slideIndex ? "bg-teal" : "bg-line"}`} />
                  ))}
                </div>
                <button
                  onClick={() => (slideIndex === lesson.slides.length - 1 ? advance() : setSlideIndex((i) => i + 1))}
                  disabled={slideIndex === lesson.slides.length - 1 && isLastStep}
                  className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30"
                >
                  <ChevronIcon width={16} height={16} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          )
        ) : videoUrl ? (
          <video src={videoUrl} controls onEnded={isLastStep ? undefined : advance} className="aspect-video w-full rounded-card bg-ink shadow-soft" />
        ) : (
          <div className="grid aspect-video w-full place-items-center rounded-card bg-cream-deep">
            <Notice tone={videoError === "generic" ? "error" : "info"}>
              {videoError === "unauthenticated" ? t.errors.unauthenticated : videoError === "forbidden" ? t.errors.forbidden : videoError === "generic" ? t.errors.generic : t.noVideo}
            </Notice>
          </div>
        ))}

      {activeKey === "script" && (
        <div className="rounded-card bg-surface p-4 shadow-soft">
          <p className="text-[15px] leading-7 whitespace-pre-line text-ink-soft" dir="auto">
            {script || t.noScript}
          </p>
          {!isLastStep && (
            <button onClick={advance} className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal-deep">
              {t.continueSection}
              <ChevronIcon width={14} height={14} className="rtl:-scale-x-100" />
            </button>
          )}
        </div>
      )}

      {activeKey === "vocabulary" && <VocabFlashcards entries={lesson.vocabulary} locale={locale} onFinished={isLastStep ? undefined : advance} />}

      {activeKey === "notes" && (
        <div className="rounded-card bg-surface p-4 shadow-soft">
          <p className="text-[15px] leading-7 whitespace-pre-line text-ink-soft" dir="auto">
            {lesson.notes || t.noNotes}
          </p>
          {!isLastStep && (
            <button onClick={advance} className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal-deep">
              {t.continueSection}
              <ChevronIcon width={14} height={14} className="rtl:-scale-x-100" />
            </button>
          )}
        </div>
      )}

      {/* Learning path — vertical, connected; each box shows its own topic + details, next stays locked until the current one has been seen */}
      {steps.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-faint">{t.pathTitle}</p>
          <div className="flex flex-col gap-3">
            {steps.map((step, i, arr) => {
              const locked = i > unlockedIndex;
              const passed = i < unlockedIndex;
              const current = i === activeIndex;
              const unlocked = !locked;
              const litSegments = passed ? 3 : current ? 1 : 0;
              return (
                <div key={step.key} className="relative flex items-center gap-4">
                  {i < arr.length - 1 && <span className={`absolute start-[7px] top-1/2 -bottom-3 w-px ${passed ? "bg-teal" : "bg-line"}`} aria-hidden="true" />}
                  <span
                    className={`relative z-10 size-4 shrink-0 rounded-full border-[3px] bg-surface ${unlocked ? "border-teal" : "border-line"}`}
                    aria-hidden="true"
                  />
                  <button
                    onClick={() => !locked && setActiveIndex(i)}
                    disabled={locked}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-surface py-2.5 pe-4 ps-2.5 text-start shadow-soft transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span
                      className={`relative -my-1 -ms-5 grid size-14 shrink-0 rotate-[-4deg] place-items-center overflow-hidden rounded-tl-2xl rounded-tr-lg rounded-br-2xl rounded-bl-lg text-white shadow-lift ${
                        unlocked ? "bg-teal" : "bg-line"
                      }`}
                    >
                      <span className="absolute top-2 start-2.5 size-2 rounded-full bg-white/25" aria-hidden="true" />
                      <span className="absolute end-2.5 bottom-2.5 size-1.5 rounded-full bg-white/20" aria-hidden="true" />
                      <step.Icon width={20} height={20} className="relative rotate-[4deg]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[15px] font-bold ${unlocked ? "text-ink" : "text-ink-faint"}`} dir="auto">
                        {step.title}
                      </span>
                      <span className="block truncate text-[12px] text-ink-faint" dir="auto">
                        {step.subtitle}
                      </span>
                    </span>
                    {unlocked ? (
                      <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
                        {[0, 1, 2].map((s) => (
                          <span key={s} className={`h-1.5 w-4 rounded-full ${s < litSegments ? "bg-teal" : "bg-line"}`} />
                        ))}
                      </div>
                    ) : (
                      <ShieldIcon width={16} height={16} className="shrink-0 text-ink-faint" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Button variant={done ? "secondary" : "primary"} onClick={toggle} disabled={pending}>
        <CheckIcon width={18} height={18} />
        {done ? t.markNotDone : t.markDone}
      </Button>

      <div className="mt-2 flex items-center justify-between">
        {prevHref ? (
          <Link href={prevHref} className="flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
            <ChevronIcon width={16} height={16} className="rotate-180 rtl:rotate-0" />
            {t.prev}
          </Link>
        ) : (
          <span />
        )}
        {nextHref && (
          <Link href={nextHref} className="flex items-center gap-1 text-sm font-medium text-teal-deep">
            {t.next}
            <ChevronIcon width={16} height={16} className="rtl:rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
}
