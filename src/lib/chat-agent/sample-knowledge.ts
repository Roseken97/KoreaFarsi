import type { KnowledgeSource } from "./types";

/**
 * Used only when Supabase is not connected, so the chat can be demoed.
 * Deliberately limited to facts about KoreaFarsi itself: no university,
 * visa or scholarship facts are invented here. Real sources are added by
 * Rose through /admin/knowledge.
 */
export const SAMPLE_KNOWLEDGE: KnowledgeSource[] = [
  {
    id: "sample-about",
    title: "درباره‌ی کره‌فارسی (نمونه)",
    category: "general",
    content: [
      "کره‌فارسی (KoreaFarsi) یک برند آموزشی فارسی–کره‌ای برای فارسی‌زبان‌هایی است که زبان کره‌ای یاد می‌گیرند.",
      "در این وب‌اپ می‌توان کتاب‌ها و دوره‌های کره‌فارسی را در بخش «کتاب‌فروشی» دید و درخواست خرید فرستاد.",
      "پرداخت آنلاین هنوز فعال نیست؛ پس از ارسال درخواست خرید، تیم کره‌فارسی برای تکمیل سفارش تماس می‌گیرد.",
      "این دستیار به پرسش‌ها درباره‌ی یادگیری زبان کره‌ای، دانشگاه‌ها و بورسیه‌های کره، و موضوعات جانبی مثل سیم‌کارت پاسخ می‌دهد، اما فقط بر اساس منابعی که تیم کره‌فارسی اضافه کرده است.",
    ].join("\n"),
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];
