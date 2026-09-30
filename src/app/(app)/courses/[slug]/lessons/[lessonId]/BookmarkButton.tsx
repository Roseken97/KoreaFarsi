"use client";

import { useState } from "react";
import { BookmarkIcon } from "@/components/icons";
import { toggleLessonBookmark } from "@/lib/courses/actions";

export function BookmarkButton({ lessonId, initialBookmarked }: { lessonId: string; initialBookmarked: boolean }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !bookmarked;
    setBookmarked(next);
    setPending(true);
    const result = await toggleLessonBookmark(lessonId, next);
    setPending(false);
    if (!result.ok) setBookmarked(!next);
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label="Bookmark"
      className={`grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface shadow-soft transition disabled:opacity-60 ${bookmarked ? "text-teal-deep" : "text-ink-soft hover:text-ink"}`}
    >
      <BookmarkIcon width={18} height={18} fill={bookmarked ? "currentColor" : "none"} />
    </button>
  );
}
