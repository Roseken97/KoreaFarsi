import type { ComponentType, SVGProps } from "react";
import { AccountIcon, AiHubIcon, BookstoreIcon, CoursesIcon, HomeIcon } from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/**
 * Single source of truth for both Bottom Nav (mobile) and Sidebar (desktop).
 * Order is visual order in RTL (first item = rightmost). Home stays in the
 * middle slot per the brief. PROVISIONAL until matched against the sketches.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/courses", label: "دوره‌های من", Icon: CoursesIcon },
  { href: "/bookstore", label: "کتاب‌فروشی", Icon: BookstoreIcon },
  { href: "/home", label: "خانه", Icon: HomeIcon },
  { href: "/ai-hub", label: "دستیار", Icon: AiHubIcon },
  { href: "/account", label: "حساب من", Icon: AccountIcon },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
