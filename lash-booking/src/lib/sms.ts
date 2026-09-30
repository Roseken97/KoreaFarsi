import "server-only";

// SMS providers. Same idea as payment.ts: one tiny interface, pick by env.
//   SMS_PROVIDER=mock       → nothing leaves the server; messages only show in the admin log
//   SMS_PROVIDER=kavenegar  → KAVENEGAR_API_KEY (+ optional KAVENEGAR_SENDER line)
//   SMS_PROVIDER=smsir      → SMSIR_API_KEY + SMSIR_LINE_NUMBER
//
// NOTE: both real providers are written against their public REST APIs as known at
// the time of writing (their docs were unreachable from the build environment).
// Send one test message from the admin panel before relying on them.

export type SmsResult = { ok: true } | { ok: false; error: string };

export type SmsProvider = "mock" | "kavenegar" | "smsir";

export function smsProvider(): SmsProvider {
  const p = process.env.SMS_PROVIDER;
  return p === "kavenegar" || p === "smsir" ? p : "mock";
}

async function kavenegar(to: string, text: string): Promise<SmsResult> {
  const key = process.env.KAVENEGAR_API_KEY;
  if (!key) return { ok: false, error: "KAVENEGAR_API_KEY تنظیم نشده" };
  const body = new URLSearchParams({ receptor: to, message: text });
  if (process.env.KAVENEGAR_SENDER) body.set("sender", process.env.KAVENEGAR_SENDER);
  const res = await fetch(`https://api.kavenegar.com/v1/${encodeURIComponent(key)}/sms/send.json`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => null)) as { return?: { status?: number; message?: string } } | null;
  if (json?.return?.status === 200) return { ok: true };
  return { ok: false, error: `kavenegar ${json?.return?.status ?? res.status}: ${json?.return?.message ?? res.statusText}` };
}

async function smsir(to: string, text: string): Promise<SmsResult> {
  const key = process.env.SMSIR_API_KEY;
  const line = process.env.SMSIR_LINE_NUMBER;
  if (!key || !line) return { ok: false, error: "SMSIR_API_KEY / SMSIR_LINE_NUMBER تنظیم نشده" };
  const res = await fetch("https://api.sms.ir/v1/send/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "X-API-KEY": key },
    body: JSON.stringify({ lineNumber: Number(line), messageText: text, mobiles: [to] }),
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => null)) as { status?: number; message?: string } | null;
  if (json?.status === 1) return { ok: true };
  return { ok: false, error: `sms.ir ${json?.status ?? res.status}: ${json?.message ?? res.statusText}` };
}

export async function sendSms(to: string, text: string): Promise<SmsResult> {
  try {
    switch (smsProvider()) {
      case "kavenegar":
        return await kavenegar(to, text);
      case "smsir":
        return await smsir(to, text);
      default:
        console.info(`[sms:mock] → ${to}\n${text}`);
        return { ok: true };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
