"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import type { LevelBucket } from "@/lib/courses/types";
import { useI18n } from "@/lib/i18n/client";

const LEVELS: LevelBucket[] = ["beginner", "intermediate", "advanced"];
/** Set by the signup form; the next site page asks the level question once, then clears it. */
export const ASK_LEVEL_KEY = "kf_ask_level";
/** Remembers that the visitor answered (or dismissed) the question, so /shop/courses doesn't ask again. */
const LEVEL_SEEN_KEY = "kf_level_seen";

function read(storage: () => Storage, key: string) {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function write(storage: () => Storage, key: string, value: string | null) {
  try {
    if (value === null) storage().removeItem(key);
    else storage().setItem(key, value);
  } catch {}
}

/** Flags the level question for the page the visitor lands on after signing up. */
export function askLevelAfterSignup() {
  write(() => sessionStorage, ASK_LEVEL_KEY, "1");
}

/**
 * The level question in the website's look (the app's signup keeps LevelPrompt).
 * "signup": shown once on the first site page after signing up.
 * "courses": shown on entering /shop/courses until the visitor has answered once.
 * Beginners just close it; other levels open /shop/courses filtered to that level.
 */
export function SiteLevelPrompt({ mode }: { mode: "signup" | "courses" }) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.site.level;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A pending post-signup question wins, so the two modes never open together.
    const signupPending = read(() => sessionStorage, ASK_LEVEL_KEY) === "1";
    const ask = mode === "signup" ? signupPending : !signupPending && read(() => localStorage, LEVEL_SEEN_KEY) === null;
    if (!ask) return;
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    write(() => sessionStorage, ASK_LEVEL_KEY, null);
    write(() => localStorage, LEVEL_SEEN_KEY, "1");
    setOpen(false);
  }

  function pick(level: LevelBucket) {
    close();
    if (level !== "beginner") router.push(`/shop/courses?level=${level}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#140E26]/70 p-5 backdrop-blur-md">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-level-title"
        tabIndex={-1}
        className="kf-page-in relative w-full max-w-[420px] rounded-[30px] border border-white/15 bg-[#1C1336]/95 p-7 text-center text-white shadow-[0_40px_90px_rgba(0,0,0,0.5)] outline-none"
      >
        <button type="button" onClick={close} aria-label={t.close} className="absolute end-4 top-4 grid size-9 place-items-center rounded-full text-[#A99FC4] hover:bg-white/10 hover:text-white">
          <CloseIcon width={18} height={18} />
        </button>
        <span lang="ko" aria-hidden="true" className="text-4xl font-black text-[#B79CFF]">
          레벨
        </span>
        <h2 id="site-level-title" className="m-0 mt-1 text-xl font-black">
          {t.title}
        </h2>
        <p className="m-0 mt-1 text-sm text-[#C9BEE3]">{t.body}</p>
        <div className="mt-6 flex flex-col gap-2.5">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => pick(l)}
              className={
                l === "beginner"
                  ? "h-12 rounded-full bg-white/90 font-extrabold text-[#1C1336] hover:bg-white"
                  : "h-12 rounded-full border border-white/20 bg-white/[0.05] font-bold text-white hover:bg-white/[0.1]"
              }
            >
              {t.options[l]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
