import "server-only";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";

/** Shared access check for App Admin pages: "ok", or which notice to show instead. */
export async function appAdminAccess(next: string): Promise<"ok" | "notConfigured" | "forbidden"> {
  if (!isSupabaseConfigured || !hasServiceRole()) return "notConfigured";
  if (!(await getCurrentUser())) redirect(`/auth/login?next=${next}`);
  return (await getAdminUser()) ? "ok" : "forbidden";
}
