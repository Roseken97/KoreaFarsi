import type { ComponentType, SVGProps } from "react";
import { MicIcon, PencilIcon, ReviewIcon, WatchIcon } from "@/components/icons";
import type { TaskCategory } from "@/lib/planner/types";

export const CATEGORY_ICON: Record<TaskCategory, ComponentType<SVGProps<SVGSVGElement>>> = {
  watch: WatchIcon,
  review: ReviewIcon,
  practice: PencilIcon,
  speak: MicIcon,
};
