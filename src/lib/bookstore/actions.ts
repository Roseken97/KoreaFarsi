"use server";

import { getProducts } from "@/lib/bookstore/catalog";
import { isPurchasable, priceFor, type Format } from "@/lib/bookstore/types";
import { getLocale } from "@/lib/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type PurchaseRequestInput = {
  name: string;
  contact: string;
  message: string;
  website: string; // honeypot — must stay empty
  lines: { slug: string; format: Format; quantity: number }[];
};

export type PurchaseRequestResult =
  | { ok: true }
  | { ok: false; error: "name" | "contact" | "empty" | "not_configured" | "generic" };

/**
 * Stores a purchase request (Phase 1 has no payment gateway).
 * Prices are recomputed from the catalog on the server, never trusted from the client.
 */
export async function submitPurchaseRequest(input: PurchaseRequestInput): Promise<PurchaseRequestResult> {
  const name = input.name?.trim().slice(0, 120) ?? "";
  const contact = input.contact?.trim().slice(0, 160) ?? "";
  const message = input.message?.trim().slice(0, 1000) ?? "";

  // Bots fill every field; pretend success so they don't retry.
  if (input.website) return { ok: true };
  if (!name) return { ok: false, error: "name" };
  if (contact.length < 3) return { ok: false, error: "contact" };
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };

  const catalog = await getProducts();
  const items = (input.lines ?? [])
    .slice(0, 50)
    .map((line) => {
      const product = catalog.find((p) => p.slug === line.slug);
      const quantity = Math.min(Math.max(Math.floor(Number(line.quantity) || 0), 0), 20);
      if (!product || !isPurchasable(product) || !product.format.includes(line.format) || quantity === 0) return null;
      return {
        slug: product.slug,
        title: product.title_en ? `${product.title} / ${product.title_en}` : product.title,
        format: line.format,
        quantity,
        unit_price: priceFor(product, line.format),
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  if (items.length === 0) return { ok: false, error: "empty" };
  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("purchase_requests").insert({
    user_id: auth.user?.id ?? null,
    name,
    contact,
    message: message || null,
    items,
    total,
    locale: await getLocale(),
  });

  if (error) {
    console.error("[bookstore] purchase request failed:", error.message);
    return { ok: false, error: "generic" };
  }
  return { ok: true };
}
