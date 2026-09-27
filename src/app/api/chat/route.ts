import { cookies, headers } from "next/headers";
import { CONTACT } from "@/config/contact";
import { getChatUsage, handleChat, hashIp, isChatConfigured } from "@/lib/chat-agent";
import { getLocale } from "@/lib/i18n/server";
import { getCurrentUser } from "@/lib/supabase/server";

/** Thin HTTP layer over lib/chat-agent (PROJECT_BRIEF §4b). */

const SESSION_COOKIE = "kf_chat_sid";

async function visitor() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId || !/^[0-9a-f-]{36}$/.test(sessionId)) {
    sessionId = crypto.randomUUID();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return { sessionId, ipHash: hashIp(ip) };
}

function contactLine() {
  const parts = [
    CONTACT.instagram && `Instagram @${CONTACT.instagram}`,
    CONTACT.telegram && `Telegram @${CONTACT.telegram}`,
    CONTACT.email && `email ${CONTACT.email}`,
  ].filter(Boolean);
  return parts.length
    ? `KoreaFarsi contact: ${parts.join(", ")}.`
    : "Point them to the Help & Support section of the app for contact details.";
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  if (!isChatConfigured()) return json({ configured: false });
  const { sessionId, ipHash } = await visitor();
  const usage = await getChatUsage(sessionId, ipHash);
  return json({ configured: true, ...usage });
}

export async function POST(request: Request) {
  let body: { question?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid" }, 400);
  }

  const [{ sessionId, ipHash }, user, locale] = await Promise.all([visitor(), getCurrentUser(), getLocale()]);

  try {
    const result = await handleChat({
      sessionId,
      ipHash,
      userId: user?.id ?? null,
      locale,
      question: typeof body.question === "string" ? body.question : "",
      history: Array.isArray(body.history) ? body.history : [],
      contactLine: contactLine(),
    });

    switch (result.type) {
      case "not_configured":
        return json({ error: "not_configured" }, 503);
      case "invalid":
        return json({ error: "invalid" }, 400);
      case "limited":
        return json({ error: "limit", ...result.usage }, 429);
      case "stream":
        return new Response(result.stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Chat-Remaining": String(result.usage.remaining),
            "X-Chat-Limit": String(result.usage.limit),
          },
        });
    }
  } catch (error) {
    console.error("[api/chat]", error);
    return json({ error: "server" }, 500);
  }
}
