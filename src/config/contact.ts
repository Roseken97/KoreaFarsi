/**
 * KoreaFarsi contact channels — used by Help & Support now, and by the
 * Bookstore purchase flow (M3) and the chatbot fallback (M4) later.
 * TODO(Rose): fill in the real handles. Empty values are simply hidden.
 */
export const CONTACT = {
  instagram: "", // handle without @, e.g. "koreafarsi"
  telegram: "", // username without @
  email: "",
};

export const CONTACT_LINKS = {
  instagram: (h: string) => `https://instagram.com/${h}`,
  telegram: (h: string) => `https://t.me/${h}`,
  email: (e: string) => `mailto:${e}`,
};
