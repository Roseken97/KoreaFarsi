import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "navy";

const base =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-field px-5 text-[15px] font-semibold transition " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet " +
  "disabled:cursor-not-allowed disabled:opacity-55";

// Neumorphism: a diagonal dark/light shadow pair for a raised, out-of-the-page
// look, flipping to an inset pair (pressed into the page) on :active.
const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white " +
    "shadow-[6px_6px_14px_rgb(30_35_64_/_0.25),-6px_-6px_14px_rgb(255_255_255_/_0.5)] " +
    "hover:bg-violet-deep active:scale-[0.98] active:shadow-[inset_4px_4px_10px_rgb(0_0_0_/_0.3),inset_-4px_-4px_10px_rgb(255_255_255_/_0.15)]",
  secondary:
    "border-2 border-teal bg-surface text-teal-deep " +
    "shadow-[6px_6px_14px_rgb(30_35_64_/_0.12),-6px_-6px_14px_rgb(255_255_255_/_0.9)] " +
    "hover:bg-teal-mist active:scale-[0.98] active:shadow-[inset_4px_4px_10px_rgb(30_35_64_/_0.1),inset_-4px_-4px_10px_rgb(255_255_255_/_0.6)]",
  ghost: "text-ink hover:underline",
  // Auth screens: solid brand violet, matching the periwinkle panel above the form.
  dark: "bg-violet text-white shadow-[0_14px_28px_-12px_rgb(76_95_181/0.65)] hover:bg-violet-deep active:scale-[0.98]",
  // Sign-in screens (soft-3D reference): a deep navy pill.
  navy: "rounded-full! bg-ink text-white shadow-[0_14px_28px_-12px_rgb(30_35_64/0.6)] hover:bg-ink/90 active:scale-[0.98]",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

function Spinner() {
  return (
    <span
      className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent"
      role="status"
      aria-label="در حال انجام"
    />
  );
}
