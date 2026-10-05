import { en } from "@/lib/i18n/messages/en";
import { fa } from "@/lib/i18n/messages/fa";
import type { Locale, Messages } from "@/lib/i18n/config";

/** Overrides for one locale, keyed by dotted message path ("home.title", "marketing.method.steps.0"). */
export type CopyOverrides = Record<string, string>;

/** One editable string: its path plus the default text that ships in the code. */
export type CopyEntry = { key: string; section: string; en: string; fa: string };

function flatten(node: unknown, prefix: string, out: Map<string, string>) {
  if (typeof node === "string") {
    out.set(prefix, node);
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
}

let entries: CopyEntry[] | null = null;

/** Every string in the message dictionaries, in source order. */
export function copyEntries(): CopyEntry[] {
  if (entries) return entries;
  const enMap = new Map<string, string>();
  const faMap = new Map<string, string>();
  flatten(en, "", enMap);
  flatten(fa, "", faMap);
  entries = [...enMap].map(([key, enText]) => ({ key, section: key.split(".")[0], en: enText, fa: faMap.get(key) ?? "" }));
  return entries;
}

let keySet: Set<string> | null = null;

export function isCopyKey(key: string) {
  keySet ??= new Set(copyEntries().map((e) => e.key));
  return keySet.has(key);
}

/** `{name}`-style placeholders a string uses (filled in by `fmt`). */
export function placeholdersOf(text: string) {
  return new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]));
}

/**
 * Returns `messages` with each override written over the matching string.
 * Keys that no longer exist in the code (renamed/removed) are ignored, so a
 * stale row can never break a page; the original object is never mutated.
 */
export function applyOverrides(messages: Messages, overrides: CopyOverrides): Messages {
  const keys = Object.keys(overrides);
  if (keys.length === 0) return messages;
  const result = structuredClone(messages);
  for (const key of keys) {
    const path = key.split(".");
    let node: unknown = result;
    for (const part of path.slice(0, -1)) {
      node = node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined;
    }
    const last = path[path.length - 1];
    if (node && typeof node === "object" && typeof (node as Record<string, unknown>)[last] === "string") {
      (node as Record<string, unknown>)[last] = overrides[key];
    }
  }
  return result;
}

export const COPY_LOCALES: Locale[] = ["en", "fa"];
