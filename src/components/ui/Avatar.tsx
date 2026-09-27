import { AccountIcon } from "@/components/icons";

/** Initials avatar (photo upload comes later with Supabase Storage). */
export function Avatar({
  name,
  email,
  size = 40,
  className = "",
}: {
  name?: string | null;
  email?: string | null;
  size?: number;
  className?: string;
}) {
  const signedIn = Boolean(name || email);
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
