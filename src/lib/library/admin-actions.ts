"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type GrantResult = { ok: true } | { ok: false; error: "forbidden" | "no_account" | "generic" };

/**
 * Grants library access for every item in a purchase_request to its buyer,
 * then marks the request done. This is the manual stand-in for a payment
 * webhook (PROJECT_BRIEF §8: no gateway yet) — an admin confirms the payment
 * happened outside the app, then clicks this.
 */
export async function grantPurchaseRequestAccess(requestId: string): Promise<GrantResult> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { ok: false, error: "forbidden" };

  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "generic" };

  const { data: request, error: fetchError } = await admin
    .from("purchase_requests")
    .select("id, user_id, items")
    .eq("id", requestId)
    .single();
  if (fetchError || !request) return { ok: false, error: "generic" };
  if (!request.user_id) return { ok: false, error: "no_account" };

  const slugs = [...new Set((request.items as { slug: string }[]).map((i) => i.slug))];
  const { data: products, error: productsError } = await admin.from("products").select("id, slug, title, title_en").in("slug", slugs);
  if (productsError) return { ok: false, error: "generic" };

  const rows = (products ?? []).map((p) => ({
    user_id: request.user_id as string,
    product_id: p.id,
    source: "purchase_request" as const,
    purchase_request_id: request.id,
    granted_by: adminUser.id,
  }));

  if (rows.length > 0) {
    // Re-granting an already-fulfilled request is harmless (unique constraint on user_id+product_id).
    const { error: insertError } = await admin.from("user_library").upsert(rows, { onConflict: "user_id,product_id" });
    if (insertError) {
      console.error("[admin/orders] grant failed:", insertError.message);
      return { ok: false, error: "generic" };
    }

    await admin.from("notifications").insert(
      (products ?? []).map((p) => ({
        user_id: request.user_id as string,
        title: `«${p.title}» به کتابخانه‌ات اضافه شد`,
        title_en: `"${p.title_en || p.title}" was added to your library`,
        href: "/library",
      })),
    );
  }

  await admin.from("purchase_requests").update({ status: "done" }).eq("id", requestId);
  revalidatePath("/admin/orders");
  return { ok: true };
}
