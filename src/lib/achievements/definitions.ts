import type { ComponentType, SVGProps } from "react";
import { BooksStackIcon, CheckCircleIcon, FlameIcon, LibraryIcon, StarIcon, TrophyIcon } from "@/components/icons";
import type { AchievementStats } from "./queries";

export type AchievementCategory = "lessons" | "library" | "streak" | "reviews";
export type BadgeKey = "firstLesson" | "fiveLessons" | "twentyLessons" | "firstBook" | "fiveBooks" | "streak3" | "streak7" | "streak30" | "firstReview";

export const BADGES: { key: BadgeKey; Icon: ComponentType<SVGProps<SVGSVGElement>>; category: AchievementCategory; threshold: number }[] = [
  { key: "firstLesson", Icon: CheckCircleIcon, category: "lessons", threshold: 1 },
  { key: "fiveLessons", Icon: BooksStackIcon, category: "lessons", threshold: 5 },
  { key: "twentyLessons", Icon: TrophyIcon, category: "lessons", threshold: 20 },
  { key: "firstBook", Icon: LibraryIcon, category: "library", threshold: 1 },
  { key: "fiveBooks", Icon: LibraryIcon, category: "library", threshold: 5 },
  { key: "streak3", Icon: FlameIcon, category: "streak", threshold: 3 },
  { key: "streak7", Icon: FlameIcon, category: "streak", threshold: 7 },
  { key: "streak30", Icon: FlameIcon, category: "streak", threshold: 30 },
  { key: "firstReview", Icon: StarIcon, category: "reviews", threshold: 1 },
];

export function currentByCategory(stats: AchievementStats): Record<AchievementCategory, number> {
  return { lessons: stats.lessonsDone, library: stats.libraryCount, streak: stats.streak, reviews: stats.reviewsCount };
}

export function countUnlockedBadges(stats: AchievementStats): number {
  const current = currentByCategory(stats);
  return BADGES.filter((b) => current[b.category] >= b.threshold).length;
}
