export type KoreaLifeCategory = "culture" | "travel" | "food" | "life";

/** Mirrors public.korea_life_posts (supabase/migrations/0018_korea_life.sql). */
export type KoreaLifePost = {
  id: string;
  slug: string;
  category: KoreaLifeCategory;
  title: string;
  title_en: string | null;
  excerpt: string | null;
  excerpt_en: string | null;
  body: string | null;
  body_en: string | null;
  cover_image_url: string | null;
  is_available: boolean;
  sort_order: number;
};
