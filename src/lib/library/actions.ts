"use server";

import { createClient } from "@/lib/supabase/server";
import { hasServiceRole, supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type DownloadLinkResult = { ok: true; url: string } | { ok: false; error: "unauthenticated" | "forbidden" | "unavailable" | "generic" };

const SIGNED_URL_TTL_SECONDS = 60;

/**
 * Signed, time-limited download URL for a library item's file. Verifies the
 * caller actually owns the entitlement before touching Storage, so this
 * cannot be used to fetch someone else's purchase by guessing a product id.
 */
export async function getLibraryDownloadUrl(productId: string): Promise<DownloadLinkResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "unauthenticated" };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const { data: entry } = await supabase
    .from("user_library")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq("product_id", productId)
    .maybeSingle();
  if (!entry) return { ok: false, error: "forbidden" };

  if (!hasServiceRole()) return { ok: false, error: "generic" };
  const admin = supabaseAdmin()!;

  const { data: product, error: productError } = await admin
    .from("products")
    .select("digital_file_path")
    .eq("id", productId)
    .single();
  if (productError || !product?.digital_file_path) return { ok: false, error: "unavailable" };

  const { data: signed, error: signError } = await admin.storage
    .from("library")
    .createSignedUrl(product.digital_file_path, SIGNED_URL_TTL_SECONDS);
  if (signError || !signed) {
    console.error("[library] failed to sign URL:", signError?.message);
    return { ok: false, error: "generic" };
  }
  return { ok: true, url: signed.signedUrl };
}
