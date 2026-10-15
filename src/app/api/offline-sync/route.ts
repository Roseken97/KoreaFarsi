import { toggleLessonDone } from "@/lib/courses/actions";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Receives lesson progress the app recorded while offline (lib/offline/progress-queue).
 * Each op sets an absolute state, so replaying it twice is harmless.
 */

const MAX_OPS = 200;
const ID = /^[0-9a-f-]{36}$/i;
const SLUG = /^[^/?#\s]{1,200}$/u;

type LessonDoneOp = { type: "lessonDone"; lessonId: string; courseSlug: string; done: boolean; at: number };

function isLessonDoneOp(op: unknown): op is LessonDoneOp {
  if (!op || typeof op !== "object") return false;
  const o = op as Record<string, unknown>;
  return (
    o.type === "lessonDone" &&
    typeof o.lessonId === "string" &&
    ID.test(o.lessonId) &&
    typeof o.courseSlug === "string" &&
    SLUG.test(o.courseSlug) &&
    typeof o.done === "boolean" &&
    typeof o.at === "number"
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  const ops = (body as { ops?: unknown } | null)?.ops;
  if (!Array.isArray(ops) || ops.length > MAX_OPS) return Response.json({ error: "bad_request" }, { status: 400 });

  const valid = ops.filter(isLessonDoneOp).sort((a, b) => a.at - b.at);
  let failed = 0;
  for (const op of valid) {
    const result = await toggleLessonDone(op.lessonId, op.done, op.courseSlug);
    if (!result.ok) failed += 1;
  }
  // Malformed ops are dropped rather than retried forever; failed writes are retried.
  if (failed > 0) return Response.json({ error: "partial", failed }, { status: 502 });
  return Response.json({ ok: true, applied: valid.length });
}
