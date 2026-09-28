/** Preset avatar choices (Account → Edit Profile). Same palette/pattern as ProductCover's glyph covers. */
export type AvatarKey = "star" | "blossom" | "moon" | "sun" | "forest" | "river";

export const AVATAR_KEYS: AvatarKey[] = ["star", "blossom", "moon", "sun", "forest", "river"];

export const AVATAR_STYLE: Record<AvatarKey, { glyph: string; bg: string; text: string }> = {
  star: { glyph: "별", bg: "bg-ink", text: "text-cream" },
  blossom: { glyph: "꽃", bg: "bg-blush-soft", text: "text-ink" },
  moon: { glyph: "달", bg: "bg-sage-soft", text: "text-teal-deep" },
  sun: { glyph: "해", bg: "bg-cream-deep", text: "text-ink" },
  forest: { glyph: "숲", bg: "bg-teal-deep", text: "text-cream" },
  river: { glyph: "강", bg: "bg-blush", text: "text-cream" },
};

export function isAvatarKey(value: string | null | undefined): value is AvatarKey {
  return Boolean(value) && (AVATAR_KEYS as string[]).includes(value as string);
}
