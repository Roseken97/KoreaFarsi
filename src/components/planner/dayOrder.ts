import type { Locale } from "@/lib/i18n/config";

/** Display order of weekdays (values are JS Date.getDay() indices). Persian calendars start the week on Saturday. */
export function dayOrder(locale: Locale): number[] {
  return locale === "fa" ? [6, 0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6];
}
