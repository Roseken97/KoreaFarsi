import type { Locale } from "@/lib/i18n/config";
import { copyEntries, type CopyEntry } from "./entries";

/** One part of the app in the App Admin editor, made of one or more top-level message sections. */
export type CopyArea = { id: string; label: Record<Locale, string>; sections: string[] };

/** Ordered as a learner meets the app. Message sections not listed here land in "general". */
export const COPY_AREAS: CopyArea[] = [
  { id: "landing", label: { en: "Landing page", fa: "صفحه‌ی معرفی" }, sections: ["marketing", "splash"] },
  { id: "auth", label: { en: "Sign in & onboarding", fa: "ورود، ثبت‌نام و شروع" }, sections: ["auth", "onboarding", "welcome"] },
  { id: "home", label: { en: "Home & menu", fa: "خانه و منو" }, sections: ["home", "nav"] },
  { id: "courses", label: { en: "Courses", fa: "دوره‌ها" }, sections: ["courses"] },
  { id: "library", label: { en: "Library", fa: "کتابخانه" }, sections: ["library"] },
  { id: "bookstore", label: { en: "Bookstore & orders", fa: "کتاب‌فروشی و سفارش‌ها" }, sections: ["bookstore", "orders"] },
  { id: "planner", label: { en: "Planner", fa: "برنامه‌ریز" }, sections: ["planner"] },
  { id: "ai", label: { en: "AI Practice & chat", fa: "تمرین با هوش مصنوعی و چت" }, sections: ["aiPractice", "chat"] },
  { id: "korea-life", label: { en: "Korea Life", fa: "زندگی در کره" }, sections: ["koreaLife"] },
  { id: "dictionary", label: { en: "Dictionary", fa: "دیکشنری" }, sections: ["dictionaryPage"] },
  { id: "notifications", label: { en: "Notifications", fa: "اعلان‌ها" }, sections: ["notifications"] },
  { id: "account", label: { en: "Account & settings", fa: "حساب کاربری و تنظیمات" }, sections: ["account", "language"] },
  { id: "general", label: { en: "General & errors", fa: "عمومی و پیام‌های خطا" }, sections: ["common", "errors", "placeholders", "notFound"] },
  { id: "admin", label: { en: "Admin pages", fa: "صفحه‌های ادمین" }, sections: ["admin", "productsAdmin", "coursesAdmin"] },
];

const GENERAL = "general";

export function areaOf(section: string) {
  return COPY_AREAS.find((a) => a.sections.includes(section))?.id ?? GENERAL;
}

export function getCopyArea(id: string) {
  return COPY_AREAS.find((a) => a.id === id) ?? null;
}

export function entriesForArea(id: string): CopyEntry[] {
  return copyEntries().filter((e) => areaOf(e.section) === id);
}
