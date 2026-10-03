# تیزر ۳۰ ثانیه‌ای کوریافارسی

موشن‌گرافیک کدنویسی‌شده (HTML + GSAP)، عمودی 1080×1920، ۶۰fps، برای Reels/Stories.
بریف: [`BRIEF.md`](./BRIEF.md) · استوری‌بورد: [`STORYBOARD.md`](./STORYBOARD.md)

## ساخت دوباره
```bash
cd marketing/video/promo-30s
npm install                      # gsap + فونت‌ها (Vazirmatn, Noto Serif/Sans KR, Playfair Display)
node render.mjs                  # → renders/koreafarsi-promo-30s.mp4
node render.mjs --stills 0,7.6   # فریم‌های تکی برای بازبینی
node render.mjs --determinism 12 # آزمون یکسان بودن فریم
```
پیش‌نیاز: Node، Playwright (Chromium)، ffmpeg. پیش‌نمایش زنده: سرو کردن ریشه‌ی مخزن و باز کردن `src/index.html?play`.

## ویرایش
- **متن‌ها:** `src/index.html` (متن‌های ثابت) و بالای `src/film.js` (پاسخ چت، ترجمه‌ی تایپ‌شونده، نام مراحل)
- **رنگ و فونت:** `src/film.css` (توکن‌ها همان توکن‌های اپ هستند)
- **زمان‌بندی:** `src/film.js` — هر بخش با کامنت `// S<n>` و بازه‌ی زمانی‌اش مشخص است
- خروجی‌ها (`renders/`) و `node_modules/` در git نیستند.

## صدا
خروجی اصلی بی‌صداست: دسترسی به کتابخانه‌ی موسیقی از محیط ساخت مسدود بود. برای Reels موسیقی را از کتابخانه‌ی خود اینستاگرام اضافه کن (مجوزدار و با الگوریتم سازگار). پیشنهاد سبک: گرم و آرام با ضرب ملایم، حدود ۹۰–۱۰۰ BPM، بدون وکال.
