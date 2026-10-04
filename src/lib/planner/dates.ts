/** YYYY-MM-DD in the learner's local time (not UTC — a date column should match their calendar day). */
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Last `count` days ending today, oldest first — the window a weekly view or streak scan needs. */
export function lastNDays(count: number, from = new Date()) {
  return Array.from({ length: count }, (_, i) => addDays(from, i - (count - 1)));
}

/** YYYY-MM-01 / the month's last day, for a month-range query. `month` is 0-indexed (Date.getMonth()). */
export function monthRange(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
}

/** Jan 1 / Dec 31 of `year`, for a year-range query. */
export function yearRange(year: number) {
  return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
}
