import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { defaultSlides } from "./defaults";
import type { OnboardingSlide, OnboardingSlideRow } from "./types";

/** Active slides in display order, in the learner's language; the code defaults when none are saved. */
export async function getOnboardingSlides(locale: Locale): Promise<OnboardingSlide[]> {
  if (!isSupabaseConfigured) return defaultSlides(locale);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("onboarding_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) console.error("[onboarding] slides:", error.message);
  const rows = (data ?? []) as OnboardingSlideRow[];
  if (rows.length === 0) return defaultSlides(locale);

  // English falls back to the Persian text for any field left empty.
  const en = locale === "en";
  return rows.map((r) => ({
    key: r.id,
    color: r.color,
    badge: r.badge ?? "",
    title: (en && r.title_en) || r.title,
    accent: (en && r.title_accent_en) || r.title_accent || "",
    body: (en && r.body_en) || r.body || "",
    image: r.image_url,
  }));
}
