import { formatNumber, type Locale, type Messages } from "@/lib/i18n/config";

/** "180,000 Toman" / "۱۸۰٬۰۰۰ تومان". All prices are stored in Toman (currency 'IRT'). */
export function formatPrice(amount: number, locale: Locale, m: Messages) {
  return `${formatNumber(amount, locale)} ${m.bookstore.currency}`;
}

export function levelLabel(level: string | null, m: Messages) {
  if (!level) return null;
  return m.bookstore.levels[level] ?? level;
}
