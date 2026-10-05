/** Preset avatar choices (Account → Edit Profile). Illustrated art for each lives in components/avatars/AvatarArt. */
export type AvatarKey = "star" | "blossom" | "moon" | "sun" | "forest" | "river";

export const AVATAR_KEYS: AvatarKey[] = ["star", "blossom", "moon", "sun", "forest", "river"];

export function isAvatarKey(value: string | null | undefined): value is AvatarKey {
  return Boolean(value) && (AVATAR_KEYS as string[]).includes(value as string);
}
