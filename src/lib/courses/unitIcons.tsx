import type { ComponentType, SVGProps } from "react";
import {
  BooksStackIcon,
  BowlIcon,
  ChatBubbleIcon,
  FlameIcon,
  GlobeIcon,
  HeadphonesIcon,
  MicIcon,
  PaletteIcon,
  PencilIcon,
  PeopleIcon,
  SparkleIcon,
  TagIcon,
} from "@/components/icons";
import type { UnitIconKey } from "./types";

export const UNIT_ICON_KEYS: UnitIconKey[] = ["book", "sparkle", "chat", "people", "food", "palette", "globe", "mic", "headphones", "pencil", "tag", "flame"];

export const UNIT_ICONS: Record<UnitIconKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  book: BooksStackIcon,
  sparkle: SparkleIcon,
  chat: ChatBubbleIcon,
  people: PeopleIcon,
  food: BowlIcon,
  palette: PaletteIcon,
  globe: GlobeIcon,
  mic: MicIcon,
  headphones: HeadphonesIcon,
  pencil: PencilIcon,
  tag: TagIcon,
  flame: FlameIcon,
};

export function isUnitIconKey(value: string): value is UnitIconKey {
  return (UNIT_ICON_KEYS as string[]).includes(value);
}
