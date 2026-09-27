# KoreaFarsi — Phase 1 (Web + PWA)

محدوده و مشخصات فنی: [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) (سند الزام‌آور) · مشخصات صفحات: [`UX_SPECS.md`](./UX_SPECS.md) · زمینه‌ی بلندمدت: [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)

## وضعیت Milestone‌ها

| # | Milestone | وضعیت |
|---|---|---|
| 1 | Setup + Auth + Shell | ✅ ساخته شده، هم‌راستا با UX_SPECS — منتظر PDF اسکچ‌ها و تأیید رز |
| 2 | Home + Account | ✅ ساخته شده — منتظر تأیید رز |
| 3 | Bookstore | ⏳ |
| 4 | چت‌بات اطلاعاتی | ⏳ |
| 5 | PWA + Deploy | ⏳ |

## Stack

Next.js 16 (App Router, `src/proxy.ts` به‌جای middleware) · Tailwind CSS v4 · Supabase (Auth + Postgres) · TypeScript

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
3. **SQL Editor**: فایل‌های `supabase/migrations/` را به ترتیب شماره اجرا کنید (`0001_…`، `0002_…`).
4. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (بعداً دامین اصلی)
   - Redirect URLs: `http://localhost:3000/auth/callback` (و بعداً `https://<domain>/auth/callback`)
5. **Authentication → Sign In / Providers → Google** (اختیاری): Client ID/Secret از Google Cloud Console.
   تا این مرحله انجام نشود، دکمه‌ی «ادامه با گوگل» پیام «این روش ورود هنوز فعال نشده» می‌دهد.

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
      planner/ library/ dictionary/            Placeholder (آیتم‌های منو)
      courses/ bookstore/ ai-hub/ korea-life/  Placeholder (مقصد کارت‌های Home)
  components/                 ui · shell · auth · brand · icons
  lib/i18n/                   en (پیش‌فرض) · fa · cookie زبان
  lib/supabase/               client · server · proxy · env · remember (Remember me)
  lib/auth/                   پیام خطا · اعتبارسنجی
src/config/contact.ts        راه‌های ارتباطی (اینستاگرام/تلگرام/ایمیل) — باید پر شود
design/brand/                 فایل اصلی لوگو (public/brand/logo-512.png نسخه‌ی وب است)
supabase/migrations/          SQL
```

## قراردادها

- **زبان:** English پیش‌فرض (LTR)، فارسی انتخابی (RTL). زبان در cookie `kf_locale` ذخیره می‌شود و `lang`/`dir` روی `<html>` را تعیین می‌کند. همه‌ی متن‌ها فقط در `src/lib/i18n/messages/` هستند؛ از property‌های منطقی (`ms-`/`me-`/`start`/`end`) استفاده کنید تا layout خودکار آینه شود.
- **Remember me:** اگر خاموش باشد، cookieهای ورود با بستن مرورگر پاک می‌شوند (`lib/supabase/remember.ts`).
- **رنگ، فونت، radius، سایه** فقط از tokenهای `src/app/globals.css` خوانده می‌شوند. سرمه‌ای و صورتی از لوگو گرفته شده‌اند؛ بقیه تا PDF اسکچ‌ها موقت‌اند. فونت‌ها: Playfair Display (عنوان) + Inter (متن) + Vazirmatn (فارسی).
- **ناوبری** از یک منبع: `src/components/shell/nav-items.ts`.
- **دسترسی مهمان:** همه‌ی صفحات به‌جز `/account` بدون ورود قابل‌مشاهده‌اند.
