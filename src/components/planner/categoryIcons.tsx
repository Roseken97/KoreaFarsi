import type { ComponentType, SVGProps } from "react";
import { MicIcon, PencilIcon, ReviewIcon, WatchIcon } from "@/components/icons";
import type { TaskCategory } from "@/lib/planner/types";

export const CATEGORY_ICON: Record<TaskCategory, ComponentType<SVGProps<SVGSVGElement>>> = {
  watch: WatchIcon,
  review: ReviewIcon,
  practice: PencilIcon,
  speak: MicIcon,
};

/** One identity color per task category, so the planner's rings/icons read at a glance instead of all being the same neutral tone. */
export const CATEGORY_COLOR: Record<TaskCategory, { text: string; stroke: string }> = {
  watch: { text: "text-sky-deep", stroke: "stroke-sky" },
  review: { text: "text-violet-deep", stroke: "stroke-violet" },
  practice: { text: "text-clay-deep", stroke: "stroke-clay" },
  speak: { text: "text-indigo-deep", stroke: "stroke-indigo" },
};
