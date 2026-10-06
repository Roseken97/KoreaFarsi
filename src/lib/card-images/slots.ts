/**
 * Photos on the section cards (Home, Korea Life) and the sign-in screens. Edited at /admin/card-images.
 * Stored as rows in `site_copy` under `cardImage.<slot>` (locale "fa"), so they ride
 * the same cache and need no table of their own; those keys aren't message paths,
 * so the copy editor and applyOverrides ignore them.
 */
export const CARD_IMAGE_SLOTS = [
  { slot: "home.courses", group: "Home", label: "My courses" },
  { slot: "home.bookstore", group: "Home", label: "Bookstore" },
  { slot: "home.aiHub", group: "Home", label: "AI assistant" },
  { slot: "home.koreaLife", group: "Home", label: "Life in Korea" },
  { slot: "koreaLife.culture", group: "Korea Life", label: "Culture" },
  { slot: "koreaLife.travel", group: "Korea Life", label: "Travel" },
  { slot: "koreaLife.food", group: "Korea Life", label: "Food" },
  { slot: "koreaLife.life", group: "Korea Life", label: "Everyday life" },
  { slot: "auth.login", group: "Sign-in screens", label: "Log in (top panel)" },
  { slot: "auth.signup", group: "Sign-in screens", label: "Sign up (hexagon)" },
] as const;

export type CardImageSlot = (typeof CARD_IMAGE_SLOTS)[number]["slot"];
export type CardImages = Partial<Record<CardImageSlot, string>>;

export const CARD_IMAGE_PREFIX = "cardImage.";
export const CARD_IMAGE_LOCALE = "fa";

export function isCardImageSlot(slot: string): slot is CardImageSlot {
  return CARD_IMAGE_SLOTS.some((s) => s.slot === slot);
}

export function pickCardImages(overrides: Record<string, string>): CardImages {
  const out: CardImages = {};
  for (const { slot } of CARD_IMAGE_SLOTS) {
    const url = overrides[CARD_IMAGE_PREFIX + slot];
    if (url) out[slot] = url;
  }
  return out;
}
