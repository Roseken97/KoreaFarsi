"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import {
  createVideoUploadTicket,
  deleteLesson,
  deleteResource,
  deleteUnit,
  saveLesson,
  saveResource,
  saveUnit,
  type AdminResult,
  type LessonInput,
  type ResourceInput,
} from "@/lib/courses/admin-actions";
import type { Course, CourseLesson, CourseResource, CourseUnit, LessonMaterial, SlideContent, UnitIconKey, VocabularyEntry } from "@/lib/courses/types";
import { UNIT_ICON_KEYS, UNIT_ICONS } from "@/lib/courses/unitIcons";
import { createClient } from "@/lib/supabase/client";

const EMPTY_LESSON = (unitId: string, courseId: string, sortOrder: number): LessonInput => ({
  id: null,
  unit_id: unitId,
  course_id: courseId,
  title: "",
  title_en: "",
  title_ko: "",
  sort_order: sortOrder,
  duration_minutes: 0,
  content_type: "video",
  video_path: null,
  slides: [],
  script: "",
  script_en: "",
  vocabulary: [],
  notes: "",
  objectives: "",
  objectives_en: "",
  materials: [],
});

function toLessonInput(l: CourseLesson): LessonInput {
  return {
    id: l.id,
    unit_id: l.unit_id,
    course_id: l.course_id,
    title: l.title,
    title_en: l.title_en ?? "",
    title_ko: l.title_ko ?? "",
    sort_order: l.sort_order,
    duration_minutes: l.duration_minutes,
    content_type: l.content_type,
    video_path: l.video_path,
    slides: l.slides,
    script: l.script ?? "",
    script_en: l.script_en ?? "",
    vocabulary: l.vocabulary,
    notes: l.notes ?? "",
    objectives: l.objectives ?? "",
    objectives_en: l.objectives_en ?? "",
    materials: l.materials,
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

export function CourseContentAdmin({ course, units, lessons, resources }: { course: Course; units: CourseUnit[]; lessons: CourseLesson[]; resources: CourseResource[] }) {
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [newUnitTitleEn, setNewUnitTitleEn] = useState("");
  const [newUnitIcon, setNewUnitIcon] = useState<UnitIconKey>("book");
  const [addingUnit, setAddingUnit] = useState(false);

  async function addUnit(e: FormEvent) {
    e.preventDefault();
    setAddingUnit(true);
    const result = await saveUnit({ id: null, course_id: course.id, title: newUnitTitle, title_en: newUnitTitleEn, sort_order: units.length, icon: newUnitIcon });
    setAddingUnit(false);
    if (!result.ok) return setStatus({ tone: "error", text: errorText(result) });
    setNewUnitTitle("");
    setNewUnitTitleEn("");
    setNewUnitIcon("book");
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {status && <Notice tone={status.tone}>{status.text}</Notice>}

      <form onSubmit={addUnit} className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-soft sm:flex-row sm:items-end">
        <Field label="New unit title (Persian)" value={newUnitTitle} onChange={(e) => setNewUnitTitle(e.target.value)} className="flex-1" />
        <Field label="Title (English)" value={newUnitTitleEn} onChange={(e) => setNewUnitTitleEn(e.target.value)} ltr className="flex-1" />
        <Labeled label="Icon">
          <select value={newUnitIcon} onChange={(e) => setNewUnitIcon(e.target.value as UnitIconKey)} className={selectClass}>
            {UNIT_ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Labeled>
        <Button type="submit" loading={addingUnit} className="w-auto! shrink-0 px-6">
          Add unit
        </Button>
      </form>

      {units.map((unit) => (
        <UnitBlock key={unit.id} unit={unit} course={course} lessons={lessons.filter((l) => l.unit_id === unit.id)} onError={(text) => setStatus({ tone: "error", text })} />
      ))}

      <ResourcesSection course={course} resources={resources} onError={(text) => setStatus({ tone: "error", text })} />
    </div>
  );
}

function ResourcesSection({ course, resources, onError }: { course: Course; resources: CourseResource[]; onError: (text: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ResourceInput | null>(null);

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-soft">
      <h3 className="font-display text-lg font-semibold">Resources (Resources tab)</h3>
      <p className="mt-0.5 text-xs text-ink-soft">Downloadable files (PDF, audio, worksheets, …) shown on the course&apos;s Resources tab.</p>

      {resources.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {resources.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 rounded-field bg-cream px-3 py-2">
              <span className="min-w-0 truncate text-sm font-medium" dir="auto">
                {r.title}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => setEditing({ id: r.id, course_id: course.id, title: r.title, title_en: r.title_en ?? "", file_path: r.file_path, sort_order: r.sort_order })} className="text-xs font-medium text-teal-deep">
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete resource "${r.title}"?`)) return;
                    const result = await deleteResource(r.id, course.id);
                    if (!result.ok) onError(errorText(result));
                  }}
                  aria-label="Delete resource"
                  className="grid size-7 place-items-center rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <ResourceForm key={editing.id ?? "new"} input={editing} courseSlug={course.slug} onCancel={() => setEditing(null)} onSaved={() => setEditing(null)} onError={onError} />
      ) : adding ? (
        <ResourceForm key="new" input={{ id: null, course_id: course.id, title: "", title_en: "", file_path: null, sort_order: resources.length }} courseSlug={course.slug} onCancel={() => setAdding(false)} onSaved={() => setAdding(false)} onError={onError} />
      ) : (
        <button onClick={() => setAdding(true)} className="mt-3 text-sm font-medium text-teal-deep">
          + Add resource
        </button>
      )}
    </section>
  );
}

function ResourceForm({
  input,
  courseSlug,
  onCancel,
  onSaved,
  onError,
}: {
  input: ResourceInput;
  courseSlug: string;
  onCancel: () => void;
  onSaved: () => void;
  onError: (text: string) => void;
}) {
  const [form, setForm] = useState(input);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof ResourceInput>(key: K, value: ResourceInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const ticket = await createVideoUploadTicket(courseSlug, file.name);
    if (!ticket.ok) {
      setUploading(false);
      return onError("Couldn't start the file upload.");
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    setUploading(false);
    if (error) return onError(`Upload failed: ${error.message}`);
    set("file_path", ticket.path);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveResource(form);
    setSaving(false);
    if (!result.ok) return onError(errorText(result));
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3 rounded-field border border-line bg-cream p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title (Persian)" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        <Field label="Title (English)" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} ltr />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">File</span>
        {form.file_path ? (
          <div className="flex items-center gap-2 rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink-soft">
            <span className="min-w-0 flex-1 truncate" dir="ltr">
              {form.file_path}
            </span>
            <button type="button" onClick={() => set("file_path", null)} className="shrink-0 font-medium text-danger">
              Remove
            </button>
          </div>
        ) : (
          <input type="file" onChange={onFile} disabled={uploading} className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink disabled:opacity-50" />
        )}
        {uploading && <span className="text-xs text-ink-faint">Uploading…</span>}
      </label>

      <div className="flex gap-2">
        <Button type="submit" loading={saving} disabled={uploading} className="w-auto! px-6">
          Save resource
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-auto! px-6">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function UnitBlock({ unit, course, lessons, onError }: { unit: CourseUnit; course: Course; lessons: CourseLesson[]; onError: (text: string) => void }) {
  const [addingLesson, setAddingLesson] = useState(false);
  const [editing, setEditing] = useState<LessonInput | null>(null);
  const [savingIcon, setSavingIcon] = useState(false);
  const Icon = UNIT_ICONS[unit.icon];

  async function changeIcon(icon: UnitIconKey) {
    setSavingIcon(true);
    const result = await saveUnit({ id: unit.id, course_id: course.id, title: unit.title, title_en: unit.title_en ?? "", sort_order: unit.sort_order, icon });
    setSavingIcon(false);
    if (!result.ok) onError(errorText(result));
  }

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon width={18} height={18} className="shrink-0 text-ink-faint" />
          <h3 className="min-w-0 truncate font-display text-lg font-semibold" dir="auto">
            {unit.title}
          </h3>
        </div>
        <select value={unit.icon} disabled={savingIcon} onChange={(e) => changeIcon(e.target.value as UnitIconKey)} className={`${selectClass} h-9 shrink-0 text-xs`}>
          {UNIT_ICON_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <button
          onClick={async () => {
            if (!confirm(`Delete unit "${unit.title}" and all its lessons?`)) return;
            const result = await deleteUnit(unit.id, course.id);
            if (!result.ok) onError(errorText(result));
          }}
          aria-label="Delete unit"
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-faint hover:bg-danger-soft hover:text-danger"
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
        <Field label="Korean phrase (shown big on Lesson Overview, optional)" value={form.title_ko} onChange={(e) => set("title_ko", e.target.value)} ltr />
        <Field label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={(e) => set("duration_minutes", Number(e.target.value))} ltr />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Learning objectives (Persian) — one per line, &quot;In this lesson you will be able to…&quot;</span>
        <textarea rows={3} value={form.objectives} onChange={(e) => set("objectives", e.target.value)} dir="auto" className={textareaClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Learning objectives (English) — one per line</span>
        <textarea rows={3} value={form.objectives_en} onChange={(e) => set("objectives_en", e.target.value)} dir="ltr" className={textareaClass} />
      </label>

      <div className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Content</span>
        <div className="flex gap-2">
          {(["video", "slides"] as const).map((ct) => (
            <button
              key={ct}
              type="button"
              onClick={() => set("content_type", ct)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${form.content_type === ct ? "bg-violet text-white" : "border border-line bg-surface text-ink-soft"}`}
            >
              {ct === "video" ? "Video (upload)" : "Slides (no recording)"}
            </button>
          ))}
        </div>
      </div>

      {form.content_type === "video" ? (
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
      ) : (
        <SlideEditor slides={form.slides} onChange={(slides) => set("slides", slides)} />
      )}

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

      <MaterialsEditor materials={form.materials} courseSlug={courseSlug} onChange={(materials) => set("materials", materials)} onError={onError} />

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

function SlideEditor({ slides, onChange }: { slides: SlideContent[]; onChange: (slides: SlideContent[]) => void }) {
  function update(i: number, patch: Partial<SlideContent>) {
    onChange(slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function remove(i: number) {
    onChange(slides.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...slides, { title: "", body: "" }]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="font-medium">Slides ({slides.length})</span>
      {slides.map((s, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-field border border-line bg-surface p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-faint">Slide {i + 1}</span>
            <div className="flex gap-1 text-xs">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="disabled:opacity-30">
                ↓
              </button>
              <button type="button" onClick={() => remove(i)} className="ms-2 font-medium text-danger">
                Remove
              </button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Title (Persian)" value={s.title} onChange={(e) => update(i, { title: e.target.value })} />
            <Field label="Title (English)" value={s.title_en ?? ""} onChange={(e) => update(i, { title_en: e.target.value })} ltr />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <textarea rows={2} value={s.body} onChange={(e) => update(i, { body: e.target.value })} placeholder="Body (Persian)" dir="auto" className={textareaClass} />
            <textarea rows={2} value={s.body_en ?? ""} onChange={(e) => update(i, { body_en: e.target.value })} placeholder="Body (English)" dir="ltr" className={textareaClass} />
          </div>
          <Field label="Korean text on this slide (optional)" value={s.ko ?? ""} onChange={(e) => update(i, { ko: e.target.value })} ltr />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium">Alphabet chart on this slide (optional)</span>
            <select
              value={s.chart ?? ""}
              onChange={(e) => update(i, { chart: (e.target.value || undefined) as SlideContent["chart"] })}
              className="h-11 rounded-field border border-line bg-surface px-3 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
            >
              <option value="">— None —</option>
              <option value="consonants">Consonants (19)</option>
              <option value="vowels">Vowels (21)</option>
            </select>
          </label>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start text-sm font-medium text-teal-deep">
        + Add slide
      </button>
    </div>
  );
}

function MaterialsEditor({
  materials,
  courseSlug,
  onChange,
  onError,
}: {
  materials: LessonMaterial[];
  courseSlug: string;
  onChange: (materials: LessonMaterial[]) => void;
  onError: (text: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  function update(i: number, patch: Partial<LessonMaterial>) {
    onChange(materials.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }
  function remove(i: number) {
    onChange(materials.filter((_, idx) => idx !== i));
  }

  async function addFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const ticket = await createVideoUploadTicket(courseSlug, file.name);
    if (!ticket.ok) {
      setUploading(false);
      return onError("Couldn't start the file upload.");
    }
    const supabase = createClient();
    const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file);
    setUploading(false);
    if (error) return onError(`Upload failed: ${error.message}`);
    onChange([...materials, { title: file.name, file_path: ticket.path }]);
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="font-medium">Useful Materials (PDF, audio, …) shown on the Lesson Overview screen</span>
      {materials.map((mat, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-field border border-line bg-surface p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-xs text-ink-faint" dir="ltr">
              {mat.file_path}
            </span>
            <button type="button" onClick={() => remove(i)} className="shrink-0 font-medium text-danger">
              Remove
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input placeholder="Title (Persian)" value={mat.title} onChange={(e) => update(i, { title: e.target.value })} dir="auto" className={inputClass} />
            <input placeholder="Title (English)" value={mat.title_en ?? ""} onChange={(e) => update(i, { title_en: e.target.value })} dir="ltr" className={inputClass} />
          </div>
        </div>
      ))}
      <input type="file" onChange={addFile} disabled={uploading} className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-ink disabled:opacity-50" />
      {uploading && <span className="text-xs text-ink-faint">Uploading…</span>}
    </div>
  );
}

const inputClass = "h-10 rounded-field border border-line bg-cream px-3 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";
const textareaClass = "rounded-field border border-line bg-surface px-3 py-2 text-sm leading-6 outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";
const selectClass = "h-13 rounded-field border border-line bg-surface px-4 text-[15px] outline-none focus:border-teal focus:ring-4 focus:ring-teal/15";

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}
