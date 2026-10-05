import Image from "next/image";
import { AccountIcon } from "@/components/icons";
import { AvatarArt } from "@/components/avatars/AvatarArt";
import type { AvatarKey } from "@/lib/avatars";

/** A custom image, preset avatar (see src/lib/avatars.ts), or initials as the default. */
export function Avatar({
  name,
  email,
  avatarKey,
  customAvatarUrl,
  size = 40,
  className = "",
}: {
  name?: string | null;
  email?: string | null;
  avatarKey?: AvatarKey | null;
  customAvatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  const signedIn = Boolean(name || email);

  if (customAvatarUrl) {
    return (
      <span
        className={`inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-surface ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={customAvatarUrl}
          alt={name || "Avatar"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          priority
        />
      </span>
    );
  }

  if (avatarKey) {
    return (
      <span
        className={`inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-surface ${className}`}
        style={{ width: size, height: size }}
      >
        <AvatarArt avatarKey={avatarKey} size={size} />
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
