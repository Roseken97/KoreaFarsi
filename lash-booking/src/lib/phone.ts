import { enDigits } from "./time";

/** Normalises Iranian mobile numbers (Persian digits, +98, 0098, 9xx…) to "09xxxxxxxxx". */
export function normalizePhone(raw: string): string | null {
  let p = enDigits(raw).replace(/[\s\-()]/g, "");
  if (p.startsWith("+98")) p = `0${p.slice(3)}`;
  else if (p.startsWith("0098")) p = `0${p.slice(4)}`;
  else if (p.startsWith("98") && p.length === 12) p = `0${p.slice(2)}`;
  else if (p.startsWith("9") && p.length === 10) p = `0${p}`;
  return /^09\d{9}$/.test(p) ? p : null;
}
