/**
 * Lesson progress recorded while the server can't be reached. Kept in
 * localStorage and sent to /api/offline-sync once the connection is back.
 * A route handler (not the Server Action) receives it, because Server Action ids
 * change with every deploy and a queue can outlive the page that wrote it.
 */

export type OfflineOp = { type: "lessonDone"; lessonId: string; courseSlug: string; done: boolean; at: number };

const KEY = "kf_offline_queue_v1";
const MAX_OPS = 200;

function read(): OfflineOp[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(ops: OfflineOp[]) {
  try {
    if (ops.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(ops.slice(-MAX_OPS)));
  } catch {
    // Storage blocked or full: the progress stays only on screen.
  }
}

/** Queues a lesson's done state; a later change to the same lesson replaces the earlier one. */
export function queueLessonDone(lessonId: string, courseSlug: string, done: boolean) {
  const ops = read().filter((op) => !(op.type === "lessonDone" && op.lessonId === lessonId));
  write([...ops, { type: "lessonDone", lessonId, courseSlug, done, at: Date.now() }]);
}

export function pendingOfflineOps() {
  return read().length;
}

export function clearOfflineQueue() {
  write([]);
}

let flushing: Promise<boolean> | null = null;

/** Sends queued progress. Resolves true when the queue is empty afterwards. */
export function flushOfflineQueue(): Promise<boolean> {
  flushing ??= (async () => {
    const ops = read();
    if (ops.length === 0) return true;
    try {
      const res = await fetch("/api/offline-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ops }),
      });
      if (!res.ok) return false;
      // Keep anything queued while the request was in flight.
      const sent = new Set(ops.map((op) => `${op.lessonId}:${op.at}`));
      write(read().filter((op) => !sent.has(`${op.lessonId}:${op.at}`)));
      return read().length === 0;
    } catch {
      return false;
    }
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}
