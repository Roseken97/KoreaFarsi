"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CopyIcon } from "@/components/icons";
import { Magnetic } from "@/components/marketing/Magnetic";

/** Reveals `text` one character at a time; `done` flips once the whole string has been typed. */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

type Pill = { label: string; href: string };

/**
 * Hero copy block: a blurred two-line intro, a typewriter-animated tagline, and a row of
 * pill actions (4 solid + 1 outline "copy link" pill) — independent of the typing animation.
 */
export function HeroCopy({
  introLine1,
  introLine2,
  tagline,
  eyebrow,
  title,
  pills,
  copyLabel,
  copyValue,
  copiedLabel,
}: {
  introLine1: string;
  introLine2: string;
  tagline: string;
  eyebrow: string;
  title: string;
  pills: Pill[];
  copyLabel: string;
  copyValue: string;
  copiedLabel: string;
}) {
  const { displayed, done } = useTypewriter(tagline);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard access denied — silently ignore, nothing to recover
    }
  }

  return (
    <div className="relative flex max-w-xl flex-col items-center text-center">
      <p aria-hidden="true" className="pointer-events-none mb-5 text-[clamp(15px,3.4vw,20px)] leading-[1.35] text-ink-soft/70 blur-[3px] select-none sm:mb-6">
        {introLine1}
        <br />
        {introLine2}
      </p>

      <span className="rounded-full bg-sage-soft px-4 py-1.5 text-xs font-semibold text-teal-deep">{eyebrow}</span>
      <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold text-ink md:text-6xl">{title}</h1>

      <p className="mt-5 min-h-[3.4em] text-lg leading-8 text-ink-soft sm:mb-1">
        {displayed}
        {!done && <span className="animate-blink ml-0.5 inline-block h-[1.1em] w-[2px] bg-ink-soft align-middle" />}
      </p>

      <motion.div
        className="mt-6 flex flex-wrap justify-center gap-y-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      >
        {pills.map((pill, i) =>
          i === 0 ? (
            <Magnetic key={pill.href}>
              <Link
                href={pill.href}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center rounded-full bg-ink px-4 py-[0.55em] text-[13px] font-medium whitespace-nowrap text-cream transition-colors duration-200 hover:bg-teal-deep sm:px-5 sm:text-[15px]"
              >
                {pill.label}
              </Link>
            </Magnetic>
          ) : (
            <Link
              key={pill.href}
              href={pill.href}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center rounded-full bg-ink px-4 py-[0.55em] text-[13px] font-medium whitespace-nowrap text-cream transition-colors duration-200 hover:bg-teal-deep sm:px-5 sm:text-[15px]"
            >
              {pill.label}
            </Link>
          ),
        )}
        <button
          type="button"
          onClick={copy}
          className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 rounded-full border border-ink/30 bg-transparent px-4 py-[0.55em] text-[13px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:bg-ink hover:text-cream sm:gap-3 sm:px-5 sm:text-[15px]"
        >
          {copied ? copiedLabel : `${copyLabel} ${copyValue}`}
          <CopyIcon width={13} height={13} />
        </button>
      </motion.div>
    </div>
  );
}
