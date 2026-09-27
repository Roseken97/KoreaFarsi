"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  /** Email and password are typed left-to-right even in the Persian (RTL) UI. */
  ltr?: boolean;
};

export function Field({ label, error, ltr, type = "text", className = "", ...props }: FieldProps) {
  const id = useId();
  const { m } = useI18n();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {/* dir on the wrapper so the eye button and padding follow the input's direction */}
      <div className="relative" dir={ltr ? "ltr" : undefined}>
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={
            "h-13 w-full rounded-field border bg-surface px-4 text-[15px] text-ink outline-none transition " +
            "placeholder:text-ink-faint focus:border-teal focus:ring-4 focus:ring-teal/15 " +
            (error ? "border-danger " : "border-line ") +
            (isPassword ? "pe-12" : "")
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
