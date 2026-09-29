"use client";

import Link from "next/link";
import { useState, useTransition, type ComponentType, type ReactNode, type SVGProps } from "react";
import { CheckIcon, ChevronIcon, DictionaryIcon, PencilIcon, ShieldIcon, TagIcon } from "@/components/icons";
import { HangulBreakdown } from "@/components/courses/HangulBreakdown";
import { HangulChart } from "@/components/courses/HangulChart";
import { VocabFlashcards } from "@/components/courses/VocabFlashcards";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { toggleLessonDone } from "@/lib/courses/actions";
import type { CourseLesson } from "@/lib/courses/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

type VideoError = "unauthenticated" | "forbidden" | "unavailable" | "generic" | null;
type SectionKey = "script" | "vocabulary" | "notes";

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
  const [unlockedIndex, setUnlockedIndex] = useState(0);

  const script = locale === "en" ? lesson.script_en || lesson.script : lesson.script;
  const slide = lesson.slides[slideIndex];

  // `render` (not a ready-made element) so a locked section's content is never built — nothing about it
  // is evaluated, let alone mounted — until the user actually reaches it.
  const sections: { key: SectionKey; Icon: ComponentType<SVGProps<SVGSVGElement>>; render: () => ReactNode }[] = [];
  if (script) {
    sections.push({
      key: "script",
      Icon: PencilIcon,
      render: () => (
        <p className="text-[15px] leading-7 whitespace-pre-line text-ink-soft" dir="auto">
          {script}
        </p>
      ),
    });
  }
  if (lesson.vocabulary.length > 0) {
    sections.push({ key: "vocabulary", Icon: TagIcon, render: () => <VocabFlashcards entries={lesson.vocabulary} locale={locale} /> });
  }
  if (lesson.notes) {
    sections.push({
      key: "notes",
      Icon: DictionaryIcon,
      render: () => (
        <p className="text-[15px] leading-7 whitespace-pre-line text-ink-soft" dir="auto">
          {lesson.notes}
        </p>
      ),
    });
  }

  function toggle() {
    const next = !done;
    setDone(next);
    startTransition(async () => {
      const result = await toggleLessonDone(lesson.id, next, courseSlug);
      if (!result.ok) setDone(!next);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Display — the lesson's main teaching content (video or slides), always shown up top */}
      {isSlides ? (
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
                onClick={() => setSlideIndex((i) => Math.min(lesson.slides.length - 1, i + 1))}
                disabled={slideIndex === lesson.slides.length - 1}
                className="grid size-9 place-items-center rounded-full border border-line text-ink-soft disabled:opacity-30"
              >
                <ChevronIcon width={16} height={16} className="rtl:rotate-180" />
              </button>
            </div>
          </div>
        )
      ) : videoUrl ? (
        <video src={videoUrl} controls className="aspect-video w-full rounded-card bg-ink shadow-soft" />
      ) : (
        <div className="grid aspect-video w-full place-items-center rounded-card bg-cream-deep">
          <Notice tone={videoError === "generic" ? "error" : "info"}>
            {videoError === "unauthenticated" ? t.errors.unauthenticated : videoError === "forbidden" ? t.errors.forbidden : videoError === "generic" ? t.errors.generic : t.noVideo}
          </Notice>
        </div>
      )}

      {/* Lesson content — a locked path: each section unlocks once the one before it has been opened */}
      {sections.length > 0 && (
        <div className="flex flex-col gap-3">
          {sections.map((section, i, arr) => (
            <SectionCard
              key={section.key}
              index={i}
              isLast={i === arr.length - 1}
              title={t.tabs[section.key]}
              Icon={section.Icon}
              state={i < unlockedIndex ? "done" : i === unlockedIndex ? "current" : "locked"}
              continueLabel={t.continueSection}
              onContinue={() => setUnlockedIndex((u) => Math.max(u, i + 1))}
              render={section.render}
            />
          ))}
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

function SectionCard({
  index,
  isLast,
  title,
  Icon,
  state,
  continueLabel,
  onContinue,
  render,
}: {
  index: number;
  isLast: boolean;
  title: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  state: "done" | "current" | "locked";
  continueLabel: string;
  onContinue: () => void;
  render: () => ReactNode;
}) {
  const unlocked = state !== "locked";
  return (
    <div className="relative flex gap-3">
      {!isLast && <span className="absolute start-4 top-8 bottom-[-0.75rem] w-px bg-line" aria-hidden="true" />}
      <span
        className={`relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
          state === "done" ? "border-success bg-success text-white" : "border-line bg-surface text-ink-soft"
        }`}
      >
        {state === "done" ? <CheckIcon width={14} height={14} /> : index + 1}
      </span>
      <div className={`min-w-0 flex-1 rounded-field border p-3.5 ${unlocked ? "border-line bg-surface" : "border-line bg-cream-deep opacity-70"}`}>
        <div className="flex items-center gap-2">
          <Icon width={16} height={16} className="shrink-0 text-ink-soft" />
          <span className="text-sm font-semibold text-ink">{title}</span>
          {!unlocked && <ShieldIcon width={14} height={14} className="ms-auto shrink-0 text-ink-faint" />}
        </div>
        {unlocked && (
          <div className="mt-3">
            {render()}
            {state === "current" && !isLast && (
              <button onClick={onContinue} className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal-deep">
                {continueLabel}
                <ChevronIcon width={14} height={14} className="rtl:-scale-x-100" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
