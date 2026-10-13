"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

/** Dark glass text field for the website's auth forms. Password fields get a show/hide toggle. */
export function SiteField({ label, error, ltr, type = "text", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; ltr?: boolean }) {
  const { m } = useI18n();
  const id = useId();
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm">
      <span className="font-bold text-[#E4DAF7]">{label}</span>
      <span
        className={`flex items-center rounded-2xl border bg-white/[0.06] focus-within:ring-4 ${
          error ? "border-[#FF8FC7] focus-within:ring-[#FF8FC7]/15" : "border-white/15 focus-within:border-[#2FE6E0] focus-within:ring-[#2FE6E0]/15"
        }`}
      >
        <input
          id={id}
          type={isPassword && shown ? "text" : type}
          dir={ltr ? "ltr" : "auto"}
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[16px] text-white outline-none placeholder:text-[#A99FC4]"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? m.auth.fields.hidePassword : m.auth.fields.showPassword}
            className="me-2 grid size-9 place-items-center rounded-full text-[#A99FC4] hover:text-white"
          >
            {shown ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
          </button>
        )}
      </span>
      {error && <span className="text-[13px] text-[#FF8FC7]">{error}</span>}
    </label>
  );
}

/** Solid white pill submit button used across the website forms. */
export function SiteSubmit({ loading, children }: { loading?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white/90 text-[15px] font-extrabold text-[#1C1336] transition hover:bg-white disabled:opacity-60"
    >
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-[#1C1336]/40 border-t-transparent" />}
      {children}
    </button>
  );
}

export function SiteNotice({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  const c = tone === "error" ? "#FF8FC7" : "#2FE6E0";
  return (
    <p role={tone === "error" ? "alert" : "status"} className="m-0 rounded-2xl border p-3 text-sm text-white" style={{ borderColor: `${c}66`, background: `${c}1A` }}>
      {children}
    </p>
  );
}
