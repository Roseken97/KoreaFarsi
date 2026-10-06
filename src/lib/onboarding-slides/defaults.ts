import type { Locale } from "@/lib/i18n/config";
import type { OnboardingSlide, SlideColor } from "./types";

type DefaultSlide = {
  color: SlideColor;
  badge: string;
  image: string | null;
  fa: { title: string; accent: string; body: string };
  en: { title: string; accent: string; body: string };
};

/**
 * Shown until Rose saves her own slides in /admin/onboarding (and the starting
 * point when she does). Kept out of the i18n dictionaries so the slides have one editor.
 */
export const DEFAULT_SLIDES: DefaultSlide[] = [
  {
    color: "peach",
    badge: "안녕",
    image: null,
    fa: { title: "سفری تازه", accent: "در انتظار توست", body: "زبان کره‌ای را با مسیری یاد بگیر که برای فارسی‌زبان‌ها طراحی شده است." },
    en: { title: "A new journey", accent: "awaits you", body: "Learn Korean with a path designed for Persian speakers." },
  },
  {
    color: "sky",
    badge: "책",
    image: null,
    fa: { title: "به روش خودت", accent: "یاد بگیر", body: "کتاب‌ها، دوره‌ها و منابعی متناسب با سطح و سرعت تو." },
    en: { title: "Learn", accent: "your way", body: "Books, courses and materials that fit your level and your pace." },
  },
  {
    color: "lavender",
    badge: "연습",
    image: null,
    fa: { title: "تمرین واقعی،", accent: "پیشرفت واقعی", body: "آنچه یاد می‌گیری را تمرین کن و پیشرفتت را ببین." },
    en: { title: "Real practice,", accent: "real progress", body: "Practise what you learn and see how far you've come." },
  },
  {
    color: "rose",
    badge: "함께",
    image: null,
    fa: { title: "بخشی از یک", accent: "داستان بزرگ‌تر باش", body: "به جمع رو به رشد فارسی‌زبان‌هایی بپیوند که کره‌ای یاد می‌گیرند." },
    en: { title: "Be part of", accent: "a bigger story", body: "Join a growing community of Persian-speaking Korean learners." },
  },
];

export function defaultSlides(locale: Locale): OnboardingSlide[] {
  return DEFAULT_SLIDES.map((s, i) => ({ key: `default-${i}`, color: s.color, badge: s.badge, image: s.image, ...s[locale] }));
}
