"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import {
  createVideoUploadTicket,
  deleteLesson,
  deleteUnit,
  saveLesson,
  saveUnit,
  type AdminResult,
  type LessonInput,
} from "@/lib/courses/admin-actions";
import type { Course, CourseLesson, CourseUnit, VocabularyEntry } from "@/lib/courses/types";
import { createClient } from "@/lib/supabase/client";

const EMPTY_LESSON = (unitId: string, courseId: string, sortOrder: number): LessonInput => ({
  id: null,
  unit_id: unitId,
  course_id: courseId,
  title: "",
  title_en: "",
  sort_order: sortOrder,
  duration_minutes: 0,
  video_path: null,
  script: "",
  script_en: "",
  vocabulary: [],
  notes: "",
});

function toLessonInput(l: CourseLesson): LessonInput {
  return {
    id: l.id,
    unit_id: l.unit_id,
    course_id: l.course_id,
    title: l.title,
    title_en: l.title_en ?? "",
    sort_order: l.sort_order,
    duration_minutes: l.duration_minutes,
    video_path: l.video_path,
    script: l.script ?? "",
    script_en: l.script_en ?? "",
    vocabulary: l.vocabulary,
    notes: l.notes ?? "",
  };
}

function vocabToText(v: VocabularyEntry[]) {
  return v.map((e) => [e.ko, e.fa, e.en].filter(Boolean).join(" | ")).join("\n");
}

function textToVocab(text: string): VocabularyEntry[] {
  return text
    .split("\n")
    .map((line) => line.split("|").map((s) => s.trim()))
    .filter((parts) => parts[0])
    .map(([ko, fa, en]) => ({ ko, fa: fa ?? "", en: en || undefined }));
}

const errorText = (r: AdminResult) =>
  r.ok ? "" : r.error === "forbidden" ? "This page is only available to KoreaFarsi admins." : r.error === "title" ? "Please enter a title." : "Couldn't save. Please try again.";

export function CourseContentAdmin({ course, units, lessons }: { course: Course; units: CourseUnit[]; lessons: CourseLesson[] }) {
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [newUnitTitleEn, setNewUnitTitleEn] = useState("");
  const [addingUnit, setAddingUnit] = useState(false);

  async function addUnit(e: FormEvent) {
    e.preventDefault();
    setAddingUnit(true);
    const result = await saveUnit({ id: null, course_id: course.id, title: newUnitTitle, title_en: newUnitTitleEn, sort_order: units.length });
    setAddingUnit(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setNewUnitTitle("");
    setNewUnitTitleEn("");
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {status && <Notice tone={status.tone}>{status.text}</Notice>}

      <form onSubmit={addUnit} className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-soft sm:flex-row sm:items-end">
        <Field label="New unit title (Persian)" value={newUnitTitle} onChange={(e) => setNewUnitTitle(e.target.value)} className="flex-1" />
        <Field label="Title (English)" value={newUnitTitleEn} onChange={(e) => setNewUnitTitleEn(e.target.value)} ltr className="flex-1" />
        <Button type="submit" loading={addingUnit} className="w-auto! shrink-0 px-6">
          Add unit
        </Button>
      </form>

      {units.map((unit) => (
        <UnitBlock key={unit.id} unit={unit} course={course} lessons={lessons.filter((l) => l.unit_id === unit.id)} onError={(text) => setStatus({ tone: "error", text })} />
      ))}
    </div>
  );
}

function UnitBlock({ unit, course, lessons, onError }: { unit: CourseUnit; course: Course; lessons: CourseLesson[]; onError: (text: string) => void }) {
  const [addingLesson, setAddingLesson] = useState(false);
  const [editing, setEditing] = useState<LessonInput | null>(null);

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold" dir="auto">
          {unit.title}
        </h3>
        <button
          onClick={async () => {
            if (!confirm(`Delete unit "${unit.title}" and all its lessons?`)) return;
            const result = await deleteUnit(unit.id, course.id);
            if (!result.ok) onError(errorText(result));
          }}
          aria-label="Delete unit"
          className="grid size-8 place-items-center rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {lessons.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-3 rounded-field bg-cream px-3 py-2">
            <span className="min-w-0 truncate text-sm font-medium" dir="auto">
              {l.title} {l.video_path ? "" : "· no video"}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => setEditing(toLessonInput(l))} className="text-xs font-medium text-teal-deep">
                Edit
              </button>
              <button
                onClick={async () => {
                  if (!confirm(`Delete lesson "${l.title}"?`)) return;
                  const result = await deleteLesson(l.id, course.id);
                  if (!result.ok) onError(errorText(result));
                }}
                aria-label="Delete lesson"
                className="grid size-7 place-items-center rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
              >
                <TrashIcon width={14} height={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <LessonForm
          key={editing.id ?? "new"}
          input={editing}
          courseSlug={course.slug}
          onCancel={() => setEditing(null)}
          onSaved={() => setEditing(null)}
          onError={onError}
        />
      ) : addingLesson ? (
        <LessonForm
          key="new"
          input={EMPTY_LESSON(unit.id, course.id, lessons.length)}
          courseSlug={course.slug}
          onCancel={() => setAddingLesson(false)}
          onSaved={() => setAddingLesson(false)}
          onError={onError}
        />
      ) : (
        <button onClick={() => setAddingLesson(true)} className="mt-3 text-sm font-medium text-teal-deep">
          + Add lesson
        </button>
      )}
    </section>
  );
}

function LessonForm({
  input,
  courseSlug,
  onCancel,
  onSaved,
  onError,
}: {
  input: LessonInput;
  courseSlug: string;
  onCancel: () => void;
  onSaved: () => void;
  onError: (text: string) => void;
}) {
  const [form, setForm] = useState(input);
  const [vocabText, setVocabText] = useState(vocabToText(input.vocabulary));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof LessonInput>(key: K, value: LessonInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onVideo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const ticket = await createVideoUploadTicket(courseSlug, file.name);
    if (!ticket.ok) {
      setUploading(false);
      return onError("Couldn't start the video upload.");
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    setUploading(false);
    if (error) return onError(`Video upload failed: ${error.message}`);
    set("video_path", ticket.path);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveLesson({ ...form, vocabulary: textToVocab(vocabText) });
    setSaving(false);
    if (!result.ok) return onError(errorText(result));
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3 rounded-field border border-line bg-cream p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title (Persian)" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        <Field label="Title (English)" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} ltr />
        <Field label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={(e) => set("duration_minutes", Number(e.target.value))} ltr />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Video</span>
        {form.video_path ? (
          <div className="flex items-center gap-2 rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink-soft">
            <span className="min-w-0 flex-1 truncate" dir="ltr">
              {form.video_path}
            </span>
            <button type="button" onClick={() => set("video_path", null)} className="shrink-0 font-medium text-danger">
              Remove
            </button>
          </div>
        ) : (
          <input type="file" accept="video/*" onChange={onVideo} disabled={uploading} className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink disabled:opacity-50" />
        )}
        {uploading && <span className="text-xs text-ink-faint">Uploading video…</span>}
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Script (Persian)</span>
        <textarea rows={3} value={form.script} onChange={(e) => set("script", e.target.value)} dir="auto" className={textareaClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Script (English)</span>
        <textarea rows={3} value={form.script_en} onChange={(e) => set("script_en", e.target.value)} dir="ltr" className={textareaClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Vocabulary — one per line: korean | persian | english (optional)</span>
        <textarea rows={4} value={vocabText} onChange={(e) => setVocabText(e.target.value)} dir="ltr" className={textareaClass} placeholder={"안녕하세요 | سلام | hello"} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Notes</span>
        <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} dir="auto" className={textareaClass} />
      </label>

      <div className="flex gap-2">
        <Button type="submit" loading={saving} disabled={uploading} className="w-auto! px-6">
          Save lesson
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-auto! px-6">
          Cancel
        </Button>
      </div>
    </form>
  );
}

const textareaClass = "rounded-field border border-line bg-surface px-3 py-2 text-sm leading-6 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";
