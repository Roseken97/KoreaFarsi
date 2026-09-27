# KoreaFarsi — Phase 1 (Web + PWA)

محدوده و مشخصات فنی: [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) (سند الزام‌آور) · زمینه‌ی بلندمدت: [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)

## وضعیت Milestone‌ها

| # | Milestone | وضعیت |
|---|---|---|
| 1 | Setup + Auth + Shell | ✅ ساخته شده — منتظر تأیید رز |
| 2 | Home + Account | ⏳ |
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
3. **SQL Editor**: محتوای `supabase/migrations/0001_profiles.sql` را اجرا کنید.
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
    onboarding/               ۴ اسلاید (محتوا در slides.ts)
    auth/                     login · signup · forgot-password · reset-password · callback
    (app)/                    Shell: Bottom Nav (<768px) / Sidebar (≥768px)
      home/ account/          stub‌های Milestone 1 (نسخه‌ی کامل در Milestone 2)
      courses/ bookstore/ ai-hub/ korea-life/   Placeholder «به‌زودی»
  components/                 ui · shell · auth · brand · icons
  lib/supabase/               client · server · proxy · env
  lib/auth/                   پیام‌های خطای فارسی · اعتبارسنجی
supabase/migrations/          SQL
```

## قراردادها

- **RTL** سراسری (`<html dir="rtl" lang="fa">`)؛ فیلدهای ایمیل/رمز `dir="ltr"`.
- **رنگ، فونت، radius، سایه** فقط از tokenهای `src/app/globals.css` خوانده می‌شوند (فعلاً موقت، تا استخراج از اسکچ‌ها).
- **ناوبری** از یک منبع: `src/components/shell/nav-items.ts`.
- **دسترسی مهمان:** همه‌ی صفحات به‌جز `/account` بدون ورود قابل‌مشاهده‌اند.
