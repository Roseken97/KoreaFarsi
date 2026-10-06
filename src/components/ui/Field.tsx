"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  /** Email and password are typed left-to-right even in the Persian (RTL) UI. */
  ltr?: boolean;
  /**
   * Pill style (auth screens): a rounded white field with a small tinted icon badge at the
   * start and the label used as the placeholder (kept for screen readers).
   */
  icon?: ReactNode;
  /** Tailwind classes for the icon badge, e.g. "bg-coral-soft text-coral". */
  iconTint?: string;
};

export function Field({ label, error, ltr, icon, iconTint = "", type = "text", className = "", placeholder, ...props }: FieldProps) {
  const id = useId();
  const { m, dir } = useI18n();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={icon ? "sr-only" : "text-sm font-medium text-ink"}>
        {label}
      </label>
      {/* dir on the wrapper so the eye button and padding follow the input's direction */}
      <div className="relative" dir={ltr && !icon ? "ltr" : undefined}>
        {icon && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 start-2 my-auto grid size-9 place-items-center rounded-full ${iconTint}`}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          dir={ltr && icon ? "ltr" : undefined}
          placeholder={icon ? label : placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={
            (icon
              ? "h-14 w-full rounded-full border bg-surface text-[15px] text-ink outline-none transition " +
                "shadow-[0_8px_24px_-12px_rgb(41_38_61/0.18)] placeholder:text-ink-faint " +
                "focus:border-violet/40 focus:ring-4 focus:ring-violet/10 " +
                // The badge sits at the page's start edge even when the input itself is typed LTR.
                (dir === "rtl"
                  ? `pr-14 ${isPassword ? "pl-12" : "pl-5"} ${ltr ? "placeholder:text-right" : ""} `
                  : `pl-14 ${isPassword ? "pr-12" : "pr-5"} `)
              : "h-13 w-full rounded-field border bg-surface px-4 text-[15px] text-ink outline-none transition " +
                "placeholder:text-ink-faint focus:border-teal focus:ring-4 focus:ring-teal/15 ") +
            (error ? "border-danger " : icon ? "border-transparent " : "border-line ") +
            (isPassword && !icon ? "pe-12" : "")
          }
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute inset-y-0 end-0 grid w-12 place-items-center text-ink-faint hover:text-ink-soft"
            aria-label={revealed ? m.auth.fields.hidePassword : m.auth.fields.showPassword}
          >
            {revealed ? <EyeOffIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
