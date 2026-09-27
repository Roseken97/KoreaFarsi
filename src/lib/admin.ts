import "server-only";
import { getCurrentUser } from "@/lib/supabase/server";

/** Emails allowed into /admin (ADMIN_EMAILS, comma-separated). */
function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** The signed-in admin user, or null. Every admin page and server action must call this. */
export async function getAdminUser() {
  const user = await getCurrentUser();
  if (!user?.email) return null;
  return adminEmails().includes(user.email.toLowerCase()) ? user : null;
}
