import type { ComponentType, SVGProps } from "react";
import { AccountIcon, DictionaryIcon, HomeIcon, LibraryIcon, PlannerIcon } from "@/components/icons";
import type { Messages } from "@/lib/i18n/config";

export type NavItem = {
  href: string;
  labelKey: keyof Omit<Messages["nav"], "label">;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/**
 * Single source of truth for both Bottom Nav (mobile) and Sidebar (desktop).
 * Confirmed by Rose: follows the Home sketch — Planner / Library / Home / Dictionary / Account.
 * Order is reading order (mirrors automatically in Persian). Home stays in the middle slot.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/planner", labelKey: "planner", Icon: PlannerIcon },
  { href: "/library", labelKey: "library", Icon: LibraryIcon },
  { href: "/home", labelKey: "home", Icon: HomeIcon },
  { href: "/dictionary", labelKey: "dictionary", Icon: DictionaryIcon },
  { href: "/account", labelKey: "account", Icon: AccountIcon },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
