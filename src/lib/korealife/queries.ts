import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { KoreaLifePost } from "./types";

export async function getKoreaLifePosts(): Promise<KoreaLifePost[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("korea_life_posts")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[korea-life] list:", error.message);
    return [];
  }
  return (data ?? []) as KoreaLifePost[];
}

export async function getKoreaLifePost(slug: string): Promise<KoreaLifePost | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("korea_life_posts").select("*").eq("slug", slug).eq("is_available", true).maybeSingle();
  if (error) {
    console.error("[korea-life] get:", error.message);
    return null;
  }
  return (data as KoreaLifePost | null) ?? null;
}
