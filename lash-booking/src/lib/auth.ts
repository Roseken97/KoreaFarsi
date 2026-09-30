import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Single-owner admin: one password from the environment, a signed, httpOnly
// session cookie. Enough for a one-person salon; swap for real accounts if staff grow.

const COOKIE = "lash_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

const isProd = process.env.NODE_ENV === "production";

/** Password in use, or null when admin is disabled (production without ADMIN_PASSWORD). */
export function adminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (p) return p;
  return isProd ? null : "admin"; // dev convenience only
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  // Fallback derived from the password, so changing the password logs everyone out.
  return createHash("sha256").update(`lash-session:${adminPassword() ?? ""}`).digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  const p = adminPassword();
  return p !== null && safeEqual(input, p);
}

export async function startSession() {
  const exp = String(Date.now() + TTL_MS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw || adminPassword() === null) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

/** For admin pages: bounce to the login screen when not signed in. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/settings/admin/login");
}

// Naive in-memory brute-force brake (per process): 8 failures → 10-minute lockout.
const attempts = new Map<string, { n: number; until: number }>();

export function loginLocked(key: string): boolean {
  const a = attempts.get(key);
  return !!a && a.n >= 8 && a.until > Date.now();
}

export function recordLoginFailure(key: string) {
  const a = attempts.get(key);
  const expired = !a || a.until < Date.now();
  attempts.set(key, { n: expired ? 1 : a.n + 1, until: Date.now() + 10 * 60_000 });
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
