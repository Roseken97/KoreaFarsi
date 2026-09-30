import "server-only";

// Payment providers. Both expose the same two steps:
//   start()  → a URL to send the customer to
//   verify() → called from /api/pay/callback to confirm the money actually arrived
// Amounts are in Toman throughout the app.

export type StartResult = { ok: true; url: string; authority: string } | { ok: false; message: string };
export type VerifyResult = { ok: true; refId: string } | { ok: false; message: string };

export function appUrl(): string {
  return (process.env.APP_URL || "http://localhost:3100").replace(/\/$/, "");
}

export function providerName(): "mock" | "zarinpal" {
  return process.env.PAYMENT_PROVIDER === "zarinpal" ? "zarinpal" : "mock";
}

// ─── Mock (development) ──────────────────────────────────────────────────

function mockStart(code: string): StartResult {
  const authority = `MOCK-${code}-${Date.now()}`;
  return { ok: true, authority, url: `/pay/mock?authority=${encodeURIComponent(authority)}` };
}

// ─── Zarinpal (API v4) ───────────────────────────────────────────────────
// NOTE: written against Zarinpal's v4 REST API as documented at the time of writing
// (payment/request.json → StartPay/{authority} → payment/verify.json, codes 100/101).
// Verify against https://www.zarinpal.com/docs before going live.

function zpBase() {
  return process.env.ZARINPAL_SANDBOX === "false" ? "https://payment.zarinpal.com" : "https://sandbox.zarinpal.com";
}

async function zpPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${zpBase()}/pg/v4/payment/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  return (await res.json()) as {
    data?: { code?: number; authority?: string; ref_id?: number | string; message?: string };
    errors?: { code?: number; message?: string } | unknown[];
  };
}

async function zarinpalStart(amount: number, description: string, mobile: string): Promise<StartResult> {
  const merchant = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchant) return { ok: false, message: "درگاه پرداخت هنوز تنظیم نشده است." };
  try {
    const r = await zpPost("request.json", {
      merchant_id: merchant,
      amount,
      currency: "IRT", // Toman
      description,
      callback_url: `${appUrl()}/api/pay/callback`,
      metadata: { mobile },
    });
    if (r.data?.code === 100 && r.data.authority) {
      return { ok: true, authority: r.data.authority, url: `${zpBase()}/pg/StartPay/${r.data.authority}` };
    }
    console.error("[zarinpal] request failed", r);
    return { ok: false, message: "اتصال به درگاه پرداخت ممکن نشد. لطفاً دوباره تلاش کنید." };
  } catch (e) {
    console.error("[zarinpal] request error", e);
    return { ok: false, message: "اتصال به درگاه پرداخت ممکن نشد. لطفاً دوباره تلاش کنید." };
  }
}

async function zarinpalVerify(authority: string, amount: number): Promise<VerifyResult> {
  try {
    const r = await zpPost("verify.json", {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      currency: "IRT",
      authority,
    });
    // 100 = verified now, 101 = already verified earlier (e.g. callback refreshed)
    if ((r.data?.code === 100 || r.data?.code === 101) && r.data.ref_id != null) {
      return { ok: true, refId: String(r.data.ref_id) };
    }
    return { ok: false, message: "پرداخت تأیید نشد." };
  } catch (e) {
    console.error("[zarinpal] verify error", e);
    return { ok: false, message: "تأیید پرداخت ممکن نشد." };
  }
}

// ─── Public API ──────────────────────────────────────────────────────────

export async function startPayment(p: { code: string; amount: number; description: string; mobile: string }) {
  return providerName() === "zarinpal" ? zarinpalStart(p.amount, p.description, p.mobile) : mockStart(p.code);
}

export async function verifyPayment(p: { authority: string; amount: number }): Promise<VerifyResult> {
  if (providerName() === "zarinpal") return zarinpalVerify(p.authority, p.amount);
  return { ok: true, refId: `TEST-${Math.floor(Math.random() * 1e8)}` };
}
