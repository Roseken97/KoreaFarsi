import { timingSafeEqual, createHash } from "node:crypto";
import { runReminders } from "@/lib/notify";

// Optional external trigger (e.g. a host cron hitting this every 10 minutes).
// The in-process scheduler in src/instrumentation.ts already covers a normal
// single-server deploy; this is for hosts that sleep idle processes.
//   GET /api/cron/reminders   with header  Authorization: Bearer <CRON_SECRET>
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const h = (v: string) => createHash("sha256").update(v).digest();
  if (!secret || !timingSafeEqual(h(given), h(secret))) return new Response("Unauthorized", { status: 401 });
  return Response.json(await runReminders());
}
