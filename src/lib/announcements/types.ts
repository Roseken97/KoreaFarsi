export type AnnouncementPlacement = "all" | "home" | "courses";

/** Mirrors public.announcements (supabase/migrations/0012_announcements.sql). */
export type Announcement = {
  id: string;
  placement: AnnouncementPlacement;
  title: string;
  title_en: string | null;
  body: string | null;
  body_en: string | null;
  href: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};
