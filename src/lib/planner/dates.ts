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
