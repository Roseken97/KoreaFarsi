/**
 * The Planner's header gets a seasonal (or holiday) accent, derived
 * automatically from the system date — no setting for it. Built from the
 * app's own identity tokens (never new colors), so it still looks like
 * KoreaFarsi in every season.
 */
export type SeasonTheme = {
  key: "nowruz" | "yalda" | "spring" | "summer" | "autumn" | "winter";
  label: string;
  gradient: string;
  accent: string;
};

const SEASONS: Record<"spring" | "summer" | "autumn" | "winter", SeasonTheme> = {
  spring: { key: "spring", label: "Spring", gradient: "linear-gradient(135deg, var(--color-violet-soft), var(--color-blush-soft))", accent: "var(--color-violet)" },
  summer: { key: "summer", label: "Summer", gradient: "linear-gradient(135deg, var(--color-gold-soft), var(--color-blush-soft))", accent: "var(--color-gold)" },
  autumn: { key: "autumn", label: "Autumn", gradient: "linear-gradient(135deg, var(--color-clay-soft), var(--color-gold-soft))", accent: "var(--color-clay)" },
  winter: { key: "winter", label: "Winter", gradient: "linear-gradient(135deg, var(--color-indigo-soft), var(--color-violet-soft))", accent: "var(--color-indigo)" },
};

const NOWRUZ: SeasonTheme = { key: "nowruz", label: "Nowruz", gradient: "linear-gradient(135deg, var(--color-violet-soft), var(--color-blush-soft) 60%, var(--color-gold-soft))", accent: "var(--color-violet)" };
const YALDA: SeasonTheme = { key: "yalda", label: "Yalda", gradient: "linear-gradient(135deg, var(--color-indigo-deep), var(--color-clay-deep))", accent: "var(--color-gold)" };

function inRange(month: number, day: number, from: [number, number], to: [number, number]) {
  const value = month * 100 + day;
  const start = from[0] * 100 + from[1];
  const end = to[0] * 100 + to[1];
  return value >= start && value <= end;
}

export function seasonalTheme(date = new Date()): SeasonTheme {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if (inRange(month, day, [3, 20], [4, 2])) return NOWRUZ; // Nowruz (new year)
  if (inRange(month, day, [12, 20], [12, 21])) return YALDA; // Yalda night

  if (inRange(month, day, [3, 21], [6, 20])) return SEASONS.spring;
  if (inRange(month, day, [6, 21], [9, 22])) return SEASONS.summer;
  if (inRange(month, day, [9, 23], [12, 20])) return SEASONS.autumn;
  return SEASONS.winter; // Dec 22 – Mar 20
}
