/**
 * Decomposes a Hangul syllable into its jamo (initial/medial/final) via the
 * Unicode Hangul Syllables block formula — no image/asset data needed, works
 * for any Korean word. Romanization follows the Revised Romanization tables.
 */
const SYLLABLE_BASE = 0xac00;
const SYLLABLE_END = 0xd7a3;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;

const INITIALS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const INITIAL_ROMAN = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];

const MEDIALS = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const MEDIAL_ROMAN = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];

const FINALS = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const FINAL_ROMAN = ["", "g", "kk", "gs", "n", "nj", "nh", "d", "l", "lg", "lm", "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "j", "ch", "k", "t", "p", "h"];

export type Jamo = { char: string; roman: string; role: "initial" | "medial" | "final" };

/** Null for a non-Hangul-syllable character (spaces, punctuation, already-decomposed jamo, etc). */
export function decomposeSyllable(char: string): Jamo[] | null {
  const code = char.codePointAt(0) ?? 0;
  if (code < SYLLABLE_BASE || code > SYLLABLE_END) return null;

  const index = code - SYLLABLE_BASE;
  const initialIndex = Math.floor(index / (MEDIAL_COUNT * FINAL_COUNT));
  const medialIndex = Math.floor((index % (MEDIAL_COUNT * FINAL_COUNT)) / FINAL_COUNT);
  const finalIndex = index % FINAL_COUNT;

  const jamo: Jamo[] = [
    { char: INITIALS[initialIndex], roman: INITIAL_ROMAN[initialIndex], role: "initial" },
    { char: MEDIALS[medialIndex], roman: MEDIAL_ROMAN[medialIndex], role: "medial" },
  ];
  if (finalIndex > 0) jamo.push({ char: FINALS[finalIndex], roman: FINAL_ROMAN[finalIndex], role: "final" });
  return jamo;
}

export type DecomposedWord = { char: string; jamo: Jamo[] | null }[];

/** Decomposes every character of a word; non-syllable characters (spaces, punctuation) pass through with jamo: null. */
export function decomposeWord(word: string): DecomposedWord {
  return Array.from(word).map((char) => ({ char, jamo: decomposeSyllable(char) }));
}

/** Whole-word romanization, syllable by syllable (non-Hangul characters are kept as-is). */
export function romanize(word: string): string {
  return decomposeWord(word)
    .map(({ char, jamo }) => (jamo ? jamo.map((j) => j.roman).join("") : char))
    .join("");
}
