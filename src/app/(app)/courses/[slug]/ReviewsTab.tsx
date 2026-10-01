"use client";

import { useState } from "react";
import { StarIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { isAvatarKey } from "@/lib/avatars";
import { deleteCourseReview, submitCourseReview } from "@/lib/courses/actions";
import type { CourseReview } from "@/lib/courses/types";
import { fmt, formatNumber, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-blush">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} width={size} height={size} fill={n <= value ? "currentColor" : "none"} className={n <= value ? "" : "text-line"} />
      ))}
    </span>
  );
}

export function ReviewsTab({
  courseId,
  courseSlug,
  reviews,
  currentUserId,
  locale,
}: {
  courseId: string;
  courseSlug: string;
  reviews: CourseReview[];
  currentUserId: string | null;
  locale: Locale;
}) {
  const { m } = useI18n();
  const t = m.courses.detail.reviews;
  const myReview = reviews.find((r) => r.user_id === currentUserId) ?? null;
  const others = reviews.filter((r) => r.id !== myReview?.id);
  const average = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mt-5 flex flex-col gap-5">
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-soft">
          <span className="font-display text-3xl font-bold text-ink" dir="ltr">
            {average.toFixed(1)}
          </span>
          <div className="flex flex-col gap-0.5">
            <Stars value={Math.round(average)} size={16} />
            <span className="text-xs text-ink-faint">{fmt(t.countLabel, { n: formatNumber(reviews.length, locale) })}</span>
          </div>
        </div>
      )}

      {currentUserId && (
        <ReviewForm courseId={courseId} courseSlug={courseSlug} existing={myReview} formTitleNew={t.formTitleNew} formTitleEdit={t.formTitleEdit} labels={t} />
      )}

      {others.length === 0 && !myReview ? (
        <p className="rounded-card bg-surface p-5 text-center text-sm text-ink-soft shadow-soft">{t.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {others.map((r) => (
            <li key={r.id} className="flex gap-3 rounded-card bg-surface p-4 shadow-soft">
              <Avatar name={r.reviewer_name} avatarKey={isAvatarKey(r.reviewer_avatar_key) ? r.reviewer_avatar_key : null} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-ink" dir="auto">
                    {r.reviewer_name || "—"}
                  </span>
                  <Stars value={r.rating} />
                </div>
                {r.comment && (
                  <p className="mt-1 text-[13px] leading-6 text-ink-soft" dir="auto">
                    {r.comment}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReviewForm({
  courseId,
  courseSlug,
  existing,
  formTitleNew,
  formTitleEdit,
  labels,
}: {
  courseId: string;
  courseSlug: string;
  existing: CourseReview | null;
  formTitleNew: string;
  formTitleEdit: string;
  labels: { ratingLabel: string; commentPlaceholder: string; submit: string; update: string; delete: string; saved: string; errors: { forbidden: string; generic: string } };
}) {
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    setSaving(true);
    setStatus(null);
    const result = await submitCourseReview(courseId, courseSlug, rating, comment);
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: result.error === "forbidden" ? labels.errors.forbidden : labels.errors.generic });
    setStatus({ tone: "success", text: labels.saved });
  }

  async function remove() {
    setSaving(true);
    const result = await deleteCourseReview(courseId, courseSlug);
    setSaving(false);
    if (!result.ok) return setStatus({ tone: "error", text: labels.errors.generic });
    setRating(5);
    setComment("");
    setStatus(null);
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <h3 className="font-display text-base font-semibold">{existing ? formTitleEdit : formTitleNew}</h3>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">{labels.ratingLabel}</span>
        <span className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={String(n)} className="text-blush">
              <StarIcon width={24} height={24} fill={n <= rating ? "currentColor" : "none"} className={n <= rating ? "" : "text-line"} />
            </button>
          ))}
        </span>
      </label>
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={labels.commentPlaceholder}
        dir="auto"
        className="rounded-field border border-line bg-cream px-3.5 py-2.5 text-sm leading-6 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
      />
      {status && <p className={`text-xs font-medium ${status.tone === "error" ? "text-danger" : "text-success"}`}>{status.text}</p>}
      <div className="flex items-center gap-3">
        <button onClick={submit} disabled={saving} className="rounded-full bg-violet px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-deep disabled:opacity-50">
          {existing ? labels.update : labels.submit}
        </button>
        {existing && (
          <button onClick={remove} disabled={saving} className="text-sm font-medium text-danger disabled:opacity-50">
            {labels.delete}
          </button>
        )}
      </div>
    </div>
  );
}
