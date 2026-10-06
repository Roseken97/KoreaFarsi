/** Brand-palette tints a slide can use (see SLIDE_COLORS). */
export type SlideColor = "peach" | "sky" | "lavender" | "rose" | "mint";

/** Mirrors public.onboarding_slides (supabase/migrations/0024_onboarding_slides.sql). */
export type OnboardingSlideRow = {
  id: string;
  sort_order: number;
  color: SlideColor;
  badge: string | null;
  title: string;
  title_accent: string | null;
  body: string | null;
  title_en: string | null;
  title_accent_en: string | null;
  body_en: string | null;
  image_url: string | null;
  is_active: boolean;
};

/** One slide in the learner's language, ready to render. */
export type OnboardingSlide = {
  key: string;
  color: SlideColor;
  badge: string;
  title: string;
  accent: string;
  body: string;
  image: string | null;
};

/**
 * Per color: `tint` washes the top of the slide, `accent` colors the second headline line,
 * dash and arrow (dark enough to read on white), `dot` is the active pager dot.
 * Rose's palette: sand #F8D4A6, periwinkle #7690EA, lavender #AE8AD2, rose #F8A8A8, mint #AAEEDD.
 */
export const SLIDE_COLORS: Record<SlideColor, { tint: string; base: string; accent: string; label: string }> = {
  peach: { tint: "#fbe4c6", base: "#f8d4a6", accent: "#b06a1c", label: "Sand" },
  sky: { tint: "#dfe5fb", base: "#7690ea", accent: "#4c5fb5", label: "Periwinkle" },
  lavender: { tint: "#ece2f7", base: "#ae8ad2", accent: "#7550aa", label: "Lavender" },
  rose: { tint: "#fde0e0", base: "#f8a8a8", accent: "#b24e58", label: "Rose" },
  mint: { tint: "#d9f6ee", base: "#aaeedd", accent: "#1f7a66", label: "Mint" },
};

export const SLIDE_COLOR_KEYS = Object.keys(SLIDE_COLORS) as SlideColor[];
