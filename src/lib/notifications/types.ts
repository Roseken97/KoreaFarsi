/** Mirrors public.notifications (supabase/migrations/0017_notifications.sql). */
export type AppNotification = {
  id: string;
  user_id: string;
  title: string;
  title_en: string | null;
  body: string | null;
  body_en: string | null;
  href: string | null;
  is_read: boolean;
  created_at: string;
};
