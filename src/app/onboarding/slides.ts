/**
 * PROVISIONAL copy and visuals for the 4 onboarding slides (sketch 02).
 * Replace text/glyphs with the sketch content; the component renders whatever is here.
 */
export type Slide = {
  glyph: string; // Korean word shown as the slide visual
  glyphMeaning: string;
  title: string;
  body: string;
  tone: "teal" | "blush" | "sage" | "cream";
};

export const SLIDES: Slide[] = [
  {
    glyph: "안녕",
    glyphMeaning: "سلام",
    title: "به کره‌فارسی خوش آمدی",
    body: "یادگیری زبان کره‌ای با توضیح فارسی، از اولین حرف الفبا تا مکالمه‌ی روزمره.",
    tone: "teal",
  },
  {
    glyph: "책",
    glyphMeaning: "کتاب",
    title: "کتاب‌ها و دوره‌های ساختاریافته",
    body: "منابع کره‌فارسی را ببین، مقایسه کن و مسیر یادگیری‌ات را انتخاب کن.",
    tone: "blush",
  },
  {
    glyph: "질문",
    glyphMeaning: "پرسش",
    title: "دستیار هوشمند کره‌فارسی",
    body: "سؤال‌هایت درباره‌ی زبان کره‌ای، دانشگاه‌ها، بورسیه و زندگی در کره را بپرس.",
    tone: "sage",
  },
  {
    glyph: "시작",
    glyphMeaning: "شروع",
    title: "همه‌چیز در یک مسیر",
    body: "کتاب، دوره و تمرین کنار هم؛ نه مجموعه‌ای از منابع پراکنده.",
    tone: "cream",
  },
];
