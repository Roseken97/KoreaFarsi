/**
 * Plain, server-safe module. Previously this lived in PlannerCarousel.tsx
 * ("use client") and was imported into page.tsx (a Server Component) — but
 * Next.js replaces every export of a client module with a client-reference
 * proxy, even plain constants, so PLANNER_TABS on the server wasn't a real
 * array and `.includes()` on it threw at runtime in production.
 */
export const PLANNER_TABS = ["profile", "daily", "weekly", "monthly", "yearly"] as const;
export type PlannerTab = (typeof PLANNER_TABS)[number];
