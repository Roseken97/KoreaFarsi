import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isAvatarKey, type AvatarKey } from "@/lib/avatars";

export type Profile = { user: User; name: string | null; avatarKey: AvatarKey | null; customAvatarUrl?: string | null };

/**
 * Signed-in user + display name. `profiles.name` is the source of truth;
 * auth metadata (set at signup / by Google) is the fallback until the
 * profiles row exists.
 */
export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: row } = await supabase.from("profiles").select("name, avatar_key, custom_avatar_url").eq("id", auth.user.id).maybeSingle();
  const meta = auth.user.user_metadata ?? {};
  const name = (row?.name as string | null) || (meta.name as string | undefined) || (meta.full_name as string | undefined) || null;
  const avatarKey = isAvatarKey(row?.avatar_key) ? row.avatar_key : null;
  const customAvatarUrl = (row?.custom_avatar_url as string | null) || null;
  return { user: auth.user, name, avatarKey, customAvatarUrl };
}
