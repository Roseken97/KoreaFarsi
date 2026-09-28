import { AccountIcon } from "@/components/icons";
import { AVATAR_STYLE, type AvatarKey } from "@/lib/avatars";

/** A chosen preset avatar (see src/lib/avatars.ts), or initials as the default. */
export function Avatar({
  name,
  email,
  avatarKey,
  size = 40,
  className = "",
}: {
  name?: string | null;
  email?: string | null;
  avatarKey?: AvatarKey | null;
  size?: number;
  className?: string;
}) {
  const signedIn = Boolean(name || email);

  if (avatarKey) {
    const style = AVATAR_STYLE[avatarKey];
    return (
      <span
        lang="ko"
        className={`inline-grid shrink-0 place-items-center rounded-full font-semibold ring-2 ring-surface ${style.bg} ${style.text} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        {style.glyph}
      </span>
    );
  }

  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full bg-blush-soft font-semibold text-ink uppercase ring-2 ring-surface ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {signedIn ? initialsOf(name, email) : <AccountIcon width={size * 0.55} height={size * 0.55} className="text-ink-soft" />}
    </span>
  );
}

function initialsOf(name: string | null | undefined, email?: string | null) {
  const source = (name || email || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  // ZWNJ keeps Persian initials as separate letters instead of joining them.
  return parts.length > 1 ? `${parts[0][0]}\u200c${parts[1][0]}` : source.slice(0, 1);
}
