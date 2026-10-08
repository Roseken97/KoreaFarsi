import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

/** Emails allowed into /admin (ADMIN_EMAILS, comma-separated). */
function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  return Boolean(email) && adminEmails().includes(email!.toLowerCase());
}

/**
 * Admins must pass a second factor (an authenticator-app code) before /admin opens.
 * ADMIN_MFA=off switches this off, as a break-glass if the authenticator is lost.
 */
export function adminMfaRequired() {
  return process.env.ADMIN_MFA !== "off";
}

/** The signed-in user if their email is on the admin list, whether or not they passed 2FA yet. */
export async function getAdminCandidate() {
  const user = await getCurrentUser();
  return user && isAdminEmail(user.email) ? user : null;
}

/** True once this session has passed the second factor (Supabase "aal2"). */
export async function hasSecondFactor() {
  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return data?.currentLevel === "aal2";
}

/** The signed-in admin user, or null. Every admin page and server action must call this. */
export async function getAdminUser() {
  const user = await getAdminCandidate();
  if (!user) return null;
  if (adminMfaRequired() && !(await hasSecondFactor())) return null;
  return user;
}
