"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { toggleLessonDone } from "@/lib/courses/actions";
import type { CourseLesson } from "@/lib/courses/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

type Tab = "video" | "script" | "vocabulary" | "notes";
type VideoError = "unauthenticated" | "forbidden" | "unavailable" | "generic" | null;

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
  const [tab, setTab] = useState<Tab>("video");
  const [done, setDone] = useState(isDone);
  const [pending, startTransition] = useTransition();

  const script = locale === "en" ? lesson.script_en || lesson.script : lesson.script;

  function toggle() {
    const next = !done;
    setDone(next);
    startTransition(async () => {
      const result = await toggleLessonDone(lesson.id, next, courseSlug);
      if (!result.ok) setDone(!next);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-full bg-cream-deep p-1">
        {(["video", "script", "vocabulary", "notes"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${tab === key ? "bg-surface text-ink shadow-soft" : "text-ink-soft"}`}
          >
            {t.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "video" &&
        (videoUrl ? (
          <video src={videoUrl} controls className="aspect-video w-full rounded-card bg-ink shadow-soft" />
        ) : (
          <div className="grid aspect-video w-full place-items-center rounded-card bg-cream-deep">
            <Notice tone={videoError === "generic" ? "error" : "info"}>
              {videoError === "unauthenticated" ? t.errors.unauthenticated : videoError === "forbidden" ? t.errors.forbidden : videoError === "generic" ? t.errors.generic : t.noVideo}
            </Notice>
          </div>
        ))}

      {tab === "script" && <p className="rounded-card bg-surface p-4 text-sm leading-7 whitespace-pre-line shadow-soft" dir="auto">{script || t.noScript}</p>}

      {tab === "vocabulary" &&
        (lesson.vocabulary.length === 0 ? (
          <p className="rounded-card bg-surface p-4 text-sm text-ink-soft shadow-soft">{t.noVocabulary}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lesson.vocabulary.map((v, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-field bg-surface px-4 py-3 shadow-soft">
                <span lang="ko" className="font-medium text-ink">
                  {v.ko}
                </span>
                <span className="text-sm text-ink-soft" dir="auto">
                  {locale === "en" && v.en ? v.en : v.fa}
                </span>
              </li>
            ))}
          </ul>
        ))}

      {tab === "notes" && <p className="rounded-card bg-surface p-4 text-sm leading-7 whitespace-pre-line shadow-soft" dir="auto">{lesson.notes || t.noNotes}</p>}

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
