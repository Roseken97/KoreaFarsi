# KoreaFarsi — Phase 1 (Web + PWA)

محدوده و مشخصات فنی: [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) (سند الزام‌آور) · مشخصات صفحات: [`UX_SPECS.md`](./UX_SPECS.md) · زمینه‌ی بلندمدت: [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)

## وضعیت Milestone‌ها

| # | Milestone | وضعیت |
|---|---|---|
| 1 | Setup + Auth + Shell | ✅ ساخته شده، هم‌راستا با UX_SPECS — منتظر PDF اسکچ‌ها و تأیید رز |
| 2 | Home + Account | ✅ ساخته شده — منتظر تأیید رز |
| 3 | Bookstore | ✅ ساخته شده با محصولات نمونه — منتظر تأیید رز و اطلاعات واقعی محصولات |
| 4 | چت‌بات اطلاعاتی | ✅ ساخته شده، با سرور mock تست شد — منتظر کلید Claude API و منابع دانش |
| 5 | PWA + Deploy | ✅ روی Vercel منتشر شد (نسخه‌ی آزمایشی رز آن را تأیید کرد) |

## فاز ۲ (شروع شده)

| بخش | وضعیت |
|---|---|
| کتابخانه‌ی دیجیتال (Library) | ✅ ساخته شد — بدون درگاه پرداخت؛ دسترسی دستی از `/admin/orders` |
| Planner | ✅ ساخته شد — فرم کوتاه → تسک‌های روزانه‌ی واقعی، وصل به Home و Streak در Account |
| Courses واقعی | ⏳ — منتظر تصمیم میزبانی ویدیو |

## Stack

Next.js 16 (App Router, `src/proxy.ts` به‌جای middleware) · Tailwind CSS v4 · Supabase (Auth + Postgres) · TypeScript

## انتشار

راهنمای قدم‌به‌قدم (GitHub، Supabase، Claude API، Vercel، دامین، تست گوشی): [`DEPLOY.md`](./DEPLOY.md)

## اجرای محلی

```bash
npm install
cp .env.example .env.local   # کلیدهای Supabase را وارد کنید
npm run dev                  # http://localhost:3000
```

بدون `.env.local` هم اپ اجرا می‌شود (برای بررسی UI)، ولی فرم‌های ورود پیام «سرویس ورود متصل نشده» نشان می‌دهند.

## راه‌اندازی Supabase (یک‌بار)

1. در [supabase.com](https://supabase.com) یک پروژه بسازید.
2. **Project Settings → API**: مقدار `Project URL` و `anon`/`publishable` key را در `.env.local` بگذارید.
3. **SQL Editor**: فایل‌های `supabase/migrations/` را به ترتیب شماره اجرا کنید (`0001` تا `0007`).
4. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (بعداً دامین اصلی)
   - Redirect URLs: `http://localhost:3000/auth/callback` (و بعداً `https://<domain>/auth/callback`)
5. **Authentication → Sign In / Providers → Google** (اختیاری): Client ID/Secret از Google Cloud Console.
   تا این مرحله انجام نشود، دکمه‌ی «ادامه با گوگل» پیام «این روش ورود هنوز فعال نشده» می‌دهد.

## Planner (فاز ۲)

- **بدون هوش مصنوعی:** برنامه با یک الگوریتم ساده و قطعی ساخته می‌شود (بدون فراخوانی Claude)، چون هنوز محتوای واقعی درس (دوره) وجود ندارد که برنامه به آن ارجاع بدهد.
- **جریان:** کاربر ۴ سؤال کوتاه جواب می‌دهد (سطح، روزهای هفته، دقیقه در روز، حوزه‌های تمرکز از میان تماشا/مرور/تمرین/صحبت) → هر روزی که در برنامه‌اش باشد، اولین بار که سایت را باز می‌کند، تسک‌های همان روز ساخته می‌شوند (بدون نیاز به cron job).
- **اتصال به Home:** بخش «Today's Plan» در صفحه‌ی خانه حالا تسک‌های واقعی همان روز را نشان می‌دهد و می‌شود مستقیم از آنجا تیک زد.
- **Streak واقعی:** عدد «روز پیاپی» در Account از تاریخچه‌ی واقعی تسک‌های تمام‌شده محاسبه می‌شود، نه عدد ثابت.
- **محدودیت فعلی:** چون Courses واقعی هنوز نیست، عنوان تسک‌ها کلی است (مثلاً «تمرین»، نه اسم یک درس مشخص). وقتی Courses ساخته شد، می‌شود تسک‌ها را به درس‌های واقعی وصل کرد.
- جدول‌ها: `study_plans` و `planner_tasks` (migration `0007`)، هر دو کاملاً مالکیت کاربر (RLS معمولی، نه service role).

## چت‌بات اطلاعاتی (ماژول مستقل)

- کد در `src/lib/chat-agent/` است و هیچ وابستگی به Next.js ندارد؛ `src/app/api/chat/route.ts` فقط لایه‌ی نازک HTTP است (طبق brief §4b).
- **رویکرد Full-Context:** همه‌ی منابع فعال داخل system prompt قرار می‌گیرند، با prompt caching روی بلوک دانش. ترتیب منابع ثابت است تا cache معتبر بماند.
- **قانون طلایی:** فقط از منابع جواب می‌دهد؛ اگر جواب در منابع نباشد، صادقانه می‌گوید و کاربر را به تیم کره‌فارسی ارجاع می‌دهد. به زبان سؤال پاسخ می‌دهد.
- **سقف روزانه:** `CHAT_DAILY_LIMIT` (پیش‌فرض ۱۰) بر اساس cookie و IP (هش‌شده)، با روز تقویمی تهران.
- **مدل:** `CHAT_MODEL` (پیش‌فرض `claude-sonnet-5` — نسخه‌ی جدیدتر مدلی که brief پیشنهاد داده بود، همان خانواده و ارزان‌تر).
- **افزودن منبع:** `/admin/knowledge` (فقط `ADMIN_EMAILS`). بالای ۵۰٬۰۰۰ کلمه هشدار مهاجرت به RAG نمایش داده می‌شود.
- بدون کلید API، چت پیام «هنوز متصل نیست» نشان می‌دهد؛ بدون Supabase، از دانش نمونه (فقط درباره‌ی خود کره‌فارسی) و شمارنده‌ی حافظه‌ای استفاده می‌کند.

## PWA

- `src/app/manifest.ts` + آیکون‌ها در `public/icons/` (ساخته‌شده از لوگو).
- `public/sw.js`: فقط صفحه‌ی آفلاین را cache می‌کند؛ صفحه‌ها و API هرگز cache نمی‌شوند (قیمت/سبد/چت همیشه تازه). برای به‌روزرسانی worker مقدار `VERSION` را عوض کنید.
- تست شده: manifest، ثبت service worker، صفحه‌ی آفلاین، و «قابل نصب» در Chrome.

## کتابخانه‌ی دیجیتال (فاز ۲)

- **چرا دستی است:** درگاه پرداخت (زرین‌پال) هنوز نیست (طبق برنامه‌ی برنامه‌ی brief). به‌جایش، شما درخواست خرید را در `/admin/orders` می‌بینید، پرداخت را بیرون از سایت (مثلاً کارت‌به‌کارت) تأیید می‌کنید، و دکمه‌ی «اعطای دسترسی» را می‌زنید. از آن لحظه کتاب در کتابخانه‌ی همان کاربر ظاهر می‌شود.
- **راه‌اندازی Storage (یک‌بار):** Supabase → **Storage** → یک bucket **خصوصی** به نام دقیقاً `library` بساز (Public را روشن نکن — فایل‌ها باید فقط با لینک موقت در دسترس باشند).
- **آپلود فایل کتاب:** فایل PDF را در همان bucket آپلود کن، مسیرش (مثلاً `hangul-alphabet-book.pdf`) را در Supabase → Table Editor → `products` → ستون `digital_file_path` همان محصول بگذار.
- **محدودیت فعلی:** اگر خریدار مهمان بوده (بدون ثبت‌نام)، اعطای خودکار دسترسی ممکن نیست — باید از او بخواهی ثبت‌نام کند و دوباره درخواست بدهد.
- جدول `user_library` (migration `0006`) این اعطاها را نگه می‌دارد.

## کتاب‌فروشی: مدیریت محصولات (Phase 1، بدون پنل ادمین)

- **بدون Supabase:** کتاب‌فروشی با ۸ محصول نمونه (`src/lib/bookstore/sample-products.json`) نمایش داده می‌شود.
- **با Supabase:** بعد از اجرای migrationها، برای تست `supabase/seed/sample_products.sql` را در SQL Editor اجرا کنید.
  حذف همه‌ی نمونه‌ها: `delete from public.products where is_sample;`
- **افزودن محصول واقعی:** Supabase → Table Editor → `products` → Insert row. قیمت‌ها به **تومان** هستند؛ قیمت هر نوع در `prices` (مثلاً `{"pdf": 180000, "physical": 390000}`) و قیمت قبل از تخفیف در `compare_at_prices`.
- **کاور:** در Storage یک bucket عمومی (مثلاً `covers`) بسازید، تصویر را آپلود و URL عمومی را در `cover_image_url` بگذارید. بدون کاور، اپ یک جلد طراحی‌شده می‌سازد.
- **درخواست‌های خرید:** Table Editor → `purchase_requests` (ستون `status` برای پیگیری: new / contacted / done / cancelled).
- بعد از تغییر JSON نمونه: `node scripts/generate-sample-seed.mjs`

## ساختار

```
src/
  proxy.ts                    تازه‌سازی session + محافظت از /account
  app/
    page.tsx                  Splash → onboarding (بار اول) یا home
    onboarding/               ۴ اسلاید → /auth/welcome
    auth/                     welcome · login · signup · forgot-password · reset-password · success · callback
    (app)/                    Shell: Bottom Nav (<768px) / Sidebar (≥768px)
      home/                   Home (اسکچ ۰۲): hero، ۴ کارت، Continue، Today's Plan
      account/                Account (اسکچ ۰۵) + profile · language · settings · help · achievements
      notifications/          Placeholder
      planner/                برنامه‌ریز واقعی (فاز ۲): فرم تنظیم + تسک‌های روزانه
      dictionary/             Placeholder (آیتم منو)
      bookstore/              کتاب‌فروشی (اسکچ ۱۳) · [slug] صفحه‌ی محصول · cart سبد + درخواست خرید
      ai-hub/                 چت‌بات اطلاعاتی
      admin/knowledge/        فرم افزودن منبع دانش (فقط ادمین)
      admin/orders/           تأیید درخواست خرید + اعطای دسترسی کتابخانه (فقط ادمین)
      library/                کتابخانه‌ی دیجیتال کاربر (فاز ۲)
      courses/ korea-life/    Placeholder (مقصد کارت‌های Home)
    api/chat/               لایه‌ی نازک API چت‌بات
    manifest.ts · offline/  PWA
  components/                 ui · shell · auth · brand · icons
  lib/i18n/                   en (پیش‌فرض) · fa · cookie زبان
  lib/supabase/               client · server · proxy · env · remember (Remember me)
  lib/auth/                   پیام خطا · اعتبارسنجی
  lib/bookstore/              catalog (Supabase یا نمونه) · cart (localStorage) · actions (درخواست خرید)
  lib/library/                کتابخانه‌ی دیجیتال: queries · actions (لینک دانلود امن) · admin-actions (اعطای دسترسی)
  lib/planner/                برنامه‌ریز: queries (تولید/خواندن تسک، محاسبه‌ی streak) · actions (ذخیره‌ی برنامه، تیک زدن تسک)
  lib/supabase/admin.ts       کلاینت service-role مشترک (چت‌بات و کتابخانه از همین استفاده می‌کنند)
  lib/chat-agent/             ماژول مستقل چت‌بات: system-prompt · knowledge-loader · chat-handler · rate-limiter
src/config/contact.ts        راه‌های ارتباطی (اینستاگرام/تلگرام/ایمیل) — باید پر شود
design/brand/                 فایل اصلی لوگو (public/brand/logo-512.png نسخه‌ی وب است)
supabase/migrations/          SQL (به ترتیب شماره اجرا شود، تا 0006)
supabase/seed/                داده‌ی نمونه (تولیدشده با scripts/)
```

## قراردادها

- **زبان:** English پیش‌فرض (LTR)، فارسی انتخابی (RTL). زبان در cookie `kf_locale` ذخیره می‌شود و `lang`/`dir` روی `<html>` را تعیین می‌کند. همه‌ی متن‌ها فقط در `src/lib/i18n/messages/` هستند؛ از property‌های منطقی (`ms-`/`me-`/`start`/`end`) استفاده کنید تا layout خودکار آینه شود.
- **Remember me:** اگر خاموش باشد، cookieهای ورود با بستن مرورگر پاک می‌شوند (`lib/supabase/remember.ts`).
- **رنگ، فونت، radius، سایه** فقط از tokenهای `src/app/globals.css` خوانده می‌شوند. سرمه‌ای و صورتی از لوگو گرفته شده‌اند؛ بقیه تا PDF اسکچ‌ها موقت‌اند. فونت‌ها: Playfair Display (عنوان) + Inter (متن) + Vazirmatn (فارسی).
- **ناوبری** از یک منبع: `src/components/shell/nav-items.ts`.
- **دسترسی مهمان:** همه‌ی صفحات به‌جز `/account` بدون ورود قابل‌مشاهده‌اند.
