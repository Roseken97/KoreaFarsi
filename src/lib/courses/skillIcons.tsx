import type { ComponentType, SVGProps } from "react";
import { HeadphonesIcon, LanternIcon, LayersIcon, LibraryIcon, MicIcon, PencilIcon, SparkleIcon, TagIcon } from "@/components/icons";
import type { SkillIconKey } from "./types";

export const SKILL_ICON_KEYS: SkillIconKey[] = ["listening", "reading", "writing", "speaking", "vocabulary", "grammar", "pronunciation", "culture"];

export const SKILL_ICONS: Record<SkillIconKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  listening: HeadphonesIcon,
  reading: LibraryIcon,
  writing: PencilIcon,
  speaking: MicIcon,
  vocabulary: TagIcon,
  grammar: LayersIcon,
  pronunciation: SparkleIcon,
  culture: LanternIcon,
};

export function isSkillIconKey(value: string): value is SkillIconKey {
  return (SKILL_ICON_KEYS as string[]).includes(value);
}
