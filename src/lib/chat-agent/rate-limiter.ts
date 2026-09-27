import { createHash } from "node:crypto";
import { chatConfig } from "./config";
import { chatStore } from "./store";

/**
 * Daily question limit per visitor (PROJECT_BRIEF §4: ~10/day), counted both
 * by session cookie and by hashed IP, so clearing cookies doesn't reset it.
 * "Day" = calendar day in Iran (Asia/Tehran), where most users are.
 *
 * With Supabase: counts rows in chat_messages. Without it: in-memory fallback
 * (fine for local dev; not reliable on serverless, where instances don't share memory).
 */

export function hashIp(ip: string) {
  return createHash("sha256").update(`${chatConfig.ipSalt}:${ip}`).digest("hex").slice(0, 32);
}

export function startOfTehranDay(now = new Date()) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .split("-");
  // Iran has used a fixed UTC+03:30 offset since DST was abolished in 2022.
  return new Date(`${y}-${m}-${d}T00:00:00+03:30`);
}

const memory = new Map<string, number>(); // key: `${day}|${id}`

export type Usage = { used: number; limit: number; remaining: number };

export async function getUsage(sessionId: string, ipHash: string): Promise<Usage> {
  const limit = chatConfig.dailyLimit;
  const since = startOfTehranDay();
  const store = chatStore();
  let used: number;

  if (store) {
    const count = async (column: "session_id" | "ip_hash", value: string) => {
      const { count, error } = await store
        .from("chat_messages")
        .select("id", { count: "exact", head: true })
        .eq("role", "user")
        .eq(column, value)
        .gte("created_at", since.toISOString());
      if (error) throw new Error(`rate-limit count: ${error.message}`);
      return count ?? 0;
    };
    const [bySession, byIp] = await Promise.all([count("session_id", sessionId), count("ip_hash", ipHash)]);
    used = Math.max(bySession, byIp);
  } else {
    const day = since.toISOString();
    used = Math.max(memory.get(`${day}|s:${sessionId}`) ?? 0, memory.get(`${day}|i:${ipHash}`) ?? 0);
  }

  return { used, limit, remaining: Math.max(0, limit - used) };
}

/** Records one question for the in-memory fallback (the DB path counts logged rows instead). */
export function countQuestionInMemory(sessionId: string, ipHash: string) {
  if (chatStore()) return;
  const day = startOfTehranDay().toISOString();
  for (const key of [`${day}|s:${sessionId}`, `${day}|i:${ipHash}`]) memory.set(key, (memory.get(key) ?? 0) + 1);
}
