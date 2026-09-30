/**
 * KoreaFarsi contact channels — used by Help & Support now, and by the
 * Bookstore purchase flow (M3) and the chatbot fallback (M4) later.
 * TODO(Rose): fill in the real handles/links. Empty values are simply hidden.
 */
import { SITE_URL } from "./site";

export const CONTACT = {
  website: SITE_URL,
  instagram: "koreafarsi",
  youtube: "koreafarsi",
  telegram: "koreakey_support",
  whatsapp: "", // international phone number, digits only (no +, no spaces), e.g. "989123456789" — off for now
  email: "",
};

export const CONTACT_LINKS = {
  website: (url: string) => url,
  instagram: (h: string) => `https://instagram.com/${h}`,
  youtube: (h: string) => `https://youtube.com/@${h}`,
  telegram: (h: string) => `https://t.me/${h}`,
  whatsapp: (phone: string) => `https://wa.me/${phone}`,
  email: (e: string) => `mailto:${e}`,
};
