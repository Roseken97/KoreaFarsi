# KoreaFarsi — Phase 1 Project Brief
**نسخه:** 1.1 — نهایی برای شروع کدنویسی
**هدف سند:** این فایل باید مستقیماً به Claude Code داده شود تا ساخت Phase 1 آغاز شود.

> **رابطه‌ی این سند با `PROJECT_CONTEXT.md`:**
> در همین پوشه یک فایل دیگر به نام `PROJECT_CONTEXT.md` هم قرار دارد — چشم‌انداز کامل و بلندمدت KoreaFarsi (فلسفه‌ی آموزشی، برند، تمام فازهای آینده‌ی اکوسیستم). آن سند برای **فهم زمینه و چرایی پروژه** است، نه برای تعیین محدوده‌ی کاری الان.
>
> **سند حاضر (`PROJECT_BRIEF.md`) تنها منبع الزام‌آور برای تعیین محدوده و مشخصات فنی Phase 1 است.** هرجا بین این دو سند تفاوتی در سطح جزئیات دیده شد (مثلاً فهرست صفحات، ویژگی‌ها، یا فازبندی)، **این سند اولویت دارد**. به‌طور خاص: بخش ۱۳ و ۲۹ سند Context، معماری کامل نهایی اکوسیستم را توصیف می‌کنند که هدف بلندمدت هستند — نه چیزی که باید در Phase 1 ساخته شود. Claude Code باید دقیقاً محدوده‌ی بخش ۳ همین سند را بسازد، نه بیشتر.

---

## 1. خلاصه‌ی پروژه

KoreaFarsi یک برند آموزشی فارسی–کره‌ای با ۱۱,۰۰۰+ فالوئر اینستاگرام است. هدف Phase 1، ساخت یک **وب‌سایت + وب‌اپ (PWA)** است که شامل:

1. یک **چت‌بات اطلاعاتی** (زبان کره‌ای، دانشگاه‌ها، بورسیه‌ها، اطلاعات جانبی مثل تهیه‌ی سیم‌کارت) که منابعش به‌مرور و بخش‌به‌بخش اضافه می‌شود
2. یک **Bookstore/Course Showcase** برای معرفی و فروش دوره‌ها و کتاب‌ها (بدون درگاه پرداخت واقعی در این فاز)
3. سیستم **Auth** ساده (بدون OTP)
4. صفحات **Home، Account، Onboarding، Splash**

این یک فاز اول (MVP) است. Library واقعی، Courses/Lesson با ویدیوی واقعی، Planner با گیمیفیکیشن، AI Practice صوتی (Speak/Listen/Shadow)، Korea Life، و درگاه پرداخت زرین‌پال **عمداً از این فاز حذف شده‌اند** و در فازهای بعدی اضافه می‌شوند.

**مهم:** UI/UX کامل این پروژه از قبل توسط طراح (رز، صاحب پروژه) در قالب اسکچ‌های UX آماده شده و پیوست است. باید دقیقاً بر اساس همان طراحی پیاده‌سازی شود — نه بازطراحی از صفر.

---

## 2. اصل طراحی: Responsive یکپارچه (نه دو پروژه‌ی جدا)

یک کدبیس واحد (Next.js) که با CSS/media queries بین دو حالت سوییچ می‌کند:

| حالت | رفتار |
|---|---|
| **زیر ۷۶۸px (موبایل)** | دقیقاً طراحی UX پیوست‌شده: Bottom Navigation (۵ آیتم، Home وسط)، کارت‌های تک‌ستونی، فاصله‌بندی و فونت مطابق اسکچ‌ها |
| **بالای ۷۶۸px (دسکتاپ)** | همان صفحات، Layout عریض‌تر: Sidebar Navigation به‌جای Bottom Nav، کارت‌ها به‌صورت Grid چندستونی |
| **PWA** | قابل نصب روی گوشی از طریق مرورگر ("Add to Home Screen")؛ آیکون و اسپلش‌اسکرین طبق برند KoreaFarsi؛ بدون نوار آدرس مرورگر هنگام اجرا از آیکون نصب‌شده |

هیچ اپلیکیشن Native (iOS/Android جدا) در این فاز ساخته نمی‌شود.

---

## 3. صفحات Phase 1 (بر اساس شماره‌ی اسکچ‌های پیوست)

| # اسکچ | صفحه | شامل در Phase 1؟ |
|---|---|---|
| 01 | Splash Screen | ✅ |
| 02 | Onboarding (۴ اسلاید) | ✅ |
| 03 | Auth Flow | ✅ (بدون OTP — مراحل ۰۵ حذف می‌شود) |
| 02 (Home) | Home Screen (۴ کارت اصلی: My Courses / Bookstore / AI Hub / Korea Life) | ✅ — اما لینک "My Courses" و "Korea Life" فعلاً به یک صفحه‌ی Placeholder ساده ("به‌زودی") می‌رود |
| 13 | Bookstore | ✅ — نمایش + Add to Cart، **بدون Checkout/Payment واقعی** (دکمه‌ی خرید فعلاً پیام "برای خرید با ما در ارتباط باشید" یا فرم تماس نشان می‌دهد) |
| 05 | Account Screen | ✅ — به‌جز بخش‌های My Courses/My Books/My Planner/Achievements که به Placeholder می‌روند |
| — | چت‌بات اطلاعاتی (AI Hub روی Home) | ✅ — این ماژول جدید است و در اسکچ‌ها به‌صورت جزئی طراحی نشده؛ رابط کاربری‌اش را ساده و هم‌راستا با استایل کلی برند طراحی می‌کنیم (باکس چت مشابه استایل کارت‌های دیگر) |
| 03, 04, 06, 08, 09, 10, 12, 14 (Planner, Library, Courses List/Detail, Lesson, Korea Life) | — | ❌ فاز بعد |
| 12 (AI Practice) | — | ❌ فاز بسیار بعدتر (پروژه‌ی جدا و پیچیده) |

---

## 4. چت‌بات اطلاعاتی — مشخصات

- **ورودی کاربر:** سؤال متنی آزاد (فارسی)
- **منابع دانش:** به‌صورت تدریجی و بخش‌به‌بخش توسط رز اضافه می‌شود (نه یکجا در ابتدا)
- **معماری لازم:** یک بخش ساده‌ی Admin/Internal برای اینکه رز بتواند منبع جدید (متن یا فایل) وارد کند — این بخش نیازی به طراحی پیچیده ندارد، یک فرم ساده کافی است:
  ```
  عنوان منبع: [_______]
  دسته: [Tutor ▾ / University ▾ / Visa-Sim-Card ▾ / General ▾]
  محتوا: [Textarea یا Upload فایل متنی]
  [دکمه: افزودن به دانش]
  ```
- **روش فنی:** با توجه به حجم محتوای اولیه (که هنوز کم است)، در Phase 1 از رویکرد **Full-Context** استفاده می‌شود (منابع مستقیم داخل System Prompt Claude قرار می‌گیرند، بدون pgvector/Embedding). وقتی حجم منابع رشد کرد (تخمین: بیش از ۵۰-۱۰۰ هزار کلمه)، مهاجرت به RAG واقعی (pgvector) در فاز بعد انجام می‌شود — این مهاجرت به معماری فعلی آسیبی نمی‌زند چون منابع از قبل ساختاریافته (عنوان + دسته + محتوا) ذخیره شده‌اند.
- **قانون طلایی System Prompt:** اگر پاسخ در منابع موجود نیست، Claude صادقانه بگوید نمی‌داند و کاربر را به تماس مستقیم با KoreaFarsi ارجاع دهد — هرگز حدس نزند.
- **Rate Limiting:** برای جلوگیری از سوءاستفاده و هزینه‌ی کنترل‌نشده‌ی API، هر کاربر (بر اساس Session/IP در این فاز، چون Auth کامل هنوز محدودیت اشتراک ندارد) سقف مشخصی سؤال در روز دارد (پیشنهاد: ۱۰ سؤال رایگان در روز).

---

## 4b. معماری چت‌بات اطلاعاتی — ماژول مستقل (نه در هم تنیده با بقیه‌ی سایت)

چت‌بات اطلاعاتی به‌عنوان یک **ماژول Backend مستقل** ساخته می‌شود، نه کدی که در لابه‌لای بقیه‌ی سایت پخش شده باشد. دلیل: این طراحی از روز اول قابل جدا شدن است — مثلاً اگر بعداً خواستیم همین چت‌بات را داخل تلگرام هم استفاده کنیم، فقط این پوشه منتقل می‌شود، بدون نیاز به بازنویسی.

**تصمیم:** در همین مرحله *پروژه‌ی جدا* (Repository/Deploy مجزا) ساخته نمی‌شود — چون مدیریت دو Environment/CI/Domain جدا در Phase 1 هزینه‌ی مدیریتی اضافه‌ای است که فایده‌ی فوری ندارد. به‌جایش، مرز ماژول در همان پروژه‌ی Next.js رعایت می‌شود:

```
/lib/chat-agent/
  ├── system-prompt.ts       (قوانین ثابت + راهنمای رفتار Claude)
  ├── knowledge-loader.ts    (خواندن منابع فعال از جدول knowledge_sources)
  ├── chat-handler.ts        (منطق اصلی: دریافت سؤال → ساخت context → Claude API)
  └── rate-limiter.ts        (محدودیت روزانه)

/app/api/chat/route.ts        (لایه‌ی نازک API که فقط chat-handler را صدا می‌زند)
```

اگر در آینده لازم شد این ماژول را به یک سرویس کاملاً مستقل (Subdomain/Repo جدا) تبدیل کنیم، همین پوشه بدون تغییر منطق داخلی‌اش منتقل می‌شود.

**قابلیت‌های پیشرفته (Web Search زنده، دسترسی به فرم‌ها، و…) عمداً از Phase 1 حذف شده‌اند** — چون:
1. کنترل کیفیت پاسخ سخت‌تر می‌شود (خطر برداشتن اطلاعات از منابع نامعتبر)
2. هزینه و پیچیدگی هر سؤال چند برابر می‌شود

فعلاً System Prompt کاملاً قفل است روی «فقط از منابع knowledge_sources جواب بده». اگر بعد از چند هفته مشخص شد یک دسته‌ی خاص از سؤالات (مثلاً فقط ددلاین‌های دانشگاه) نیاز به اطلاعات زنده دارد، Web Search کنترل‌شده فقط برای همان دسته در فاز بعد اضافه می‌شود — نه برای کل چت‌بات.

---

## 5. Tech Stack

| لایه | انتخاب | دلیل |
|---|---|---|
| Framework | Next.js (App Router) + Tailwind | یک کدبیس برای Web + PWA، Responsive ساده‌تر |
| Backend Logic | Next.js API Routes (نه NestJS جدا — برای این حجم فاز اول overkill است) | سادگی و سرعت توسعه |
| Database | PostgreSQL (Supabase) | رایگان برای شروع، شامل Auth هم می‌شود |
| Auth | Supabase Auth (Email/Password + Google) | آماده و سریع، بدون نیاز به OTP فعلاً |
| AI Engine | Claude API (claude-sonnet-4-6) | پشت Backend، کلید هرگز در Frontend |
| PWA | next-pwa یا پیاده‌سازی دستی Web App Manifest + Service Worker | نصب روی گوشی |
| Deployment | Vercel | سریع، رایگان برای شروع، سازگار کامل با Next.js، اتصال آسان دامین شخصی |
| File Storage (تصاویر کتاب/دوره) | Supabase Storage | یکپارچه با بقیه‌ی Stack |

> **قانون امنیتی ثابت:** Claude API Key هرگز در Frontend قرار نمی‌گیرد؛ همه‌ی فراخوانی‌ها از طریق Next.js API Routes (سمت سرور) انجام می‌شود.

---

## 6. Database Schema (Phase 1)

```sql
-- کاربران (توسط Supabase Auth مدیریت می‌شود، این جدول تکمیلی است)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  created_at TIMESTAMP DEFAULT now()
)

-- منابع دانش چت‌بات
knowledge_sources (
  id UUID PRIMARY KEY,
  title TEXT,
  category TEXT, -- 'tutor' | 'university' | 'scholarship' | 'visa_sim' | 'general'
  content TEXT,
  created_at TIMESTAMP DEFAULT now(),
  is_active BOOLEAN DEFAULT true
)

-- مکالمات چت (برای لاگ و بهبود بعدی، بدون فشار فعلی روی UI)
chat_messages (
  id UUID PRIMARY KEY,
  session_id TEXT, -- شناسه‌ی session کاربر (چون Auth اجباری برای چت نیست)
  user_id UUID REFERENCES profiles(id), -- می‌تواند null باشد (کاربر مهمان)
  role TEXT, -- 'user' | 'assistant'
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
)

-- دوره‌ها و کتاب‌ها (برای Bookstore)
products (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  category TEXT, -- 'course' | 'book' | 'planner' | 'bundle'
  price INT,
  currency TEXT DEFAULT 'IRT',
  cover_image_url TEXT,
  format TEXT[], -- ['pdf', 'physical']
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
)
```

---

## 7. نقشه‌ی پیاده‌سازی (Milestones)

**Milestone 1 — Setup + Auth + Shell**
- Next.js + Tailwind + Supabase setup
- Splash + Onboarding (۴ اسلاید طبق اسکچ)
- Auth Flow (Signup/Login/Forgot Password — بدون OTP)
- Responsive Shell: Bottom Nav (موبایل) / Sidebar (دسکتاپ)

**Milestone 2 — Home + Account**
- Home Screen با ۴ کارت اصلی (طبق اسکچ)
- Account Screen (پروفایل ساده + تنظیمات زبان + Logout)
- صفحات Placeholder برای بخش‌های فاز بعد (My Courses, Korea Life, و…)

**Milestone 3 — Bookstore**
- نمایش Products (Grid/List طبق اسکچ ۱۳)
- Cart ساده (بدون Checkout واقعی)
- دکمه‌ی خرید → فرم تماس/پیام راهنما

**Milestone 4 — چت‌بات اطلاعاتی**
- UI چت (باکس ساده هم‌راستا با استایل برند)
- فرم Admin برای افزودن منبع دانش (رز از همینجا محتوا اضافه می‌کند)
- اتصال Claude API با System Prompt قفل‌شده روی منابع موجود
- Rate Limiting روزانه

**Milestone 5 — PWA + Deploy نهایی**
- Web App Manifest + Service Worker
- تست نصب روی گوشی (Android/iOS)
- اتصال دامین شخصی رز
- تست کامل Responsive روی چند سایز صفحه

> بعد از هر Milestone، رز خروجی را تست می‌کند و تأیید می‌دهد، سپس Milestone بعدی شروع می‌شود.

---

## 8. Setup & Prerequisites

| مورد | چه زمانی لازم است | توضیح |
|---|---|---|
| Claude API Key | Milestone 4 | از Claude Console |
| حساب Supabase | Milestone 1 | رایگان برای شروع (Auth + Database + Storage) |
| دامین + هاست | Milestone 5 | رز از قبل دامین/هاست دارد؛ در این مرحله Vercel به دامین شخصی وصل می‌شود (نیازی به هاست فعلی cPanel نیست چون Next.js نیاز به Node.js Server دارد — Vercel این را رایگان فراهم می‌کند) |
| فایل‌های Logo/Brand Assets | Milestone 1 | رز آماده دارد (طبق اسکچ Splash Screen) |
| اولین دسته‌ی محتوای چت‌بات (FAQ پرتکرار) | Milestone 4 | رز آماده می‌کند |
| اولین دسته‌ی اطلاعات دوره/کتاب برای Bookstore | Milestone 3 | رز آماده می‌کند |
| زرین‌پال / Stripe | ❌ نه در این فاز | بعد از راه‌اندازی سایت |

---

## 9. یادداشت برای Claude Code

1. این فایل را در ریشه‌ی پروژه به‌عنوان `PROJECT_BRIEF.md` ذخیره کن
2. UX Sketches پیوست‌شده (تصاویر) مرجع اصلی طراحی بصری هستند — رنگ، فونت، spacing، آیکون‌ها دقیقاً از آن‌ها استخراج شود
3. **دقیقاً با Milestone 1 شروع کن.** هر Milestone را جداگانه بساز، تست کن، commit کن
4. **قبل از رفتن به هر Milestone بعدی، صریحاً از رز تأیید بگیر**
5. برای هر بخشی که در اسکچ اصلی طراحی شده ولی در این فاز حذف شده (مثل My Courses واقعی)، یک صفحه‌ی Placeholder ساده با پیام "این بخش به‌زودی اضافه می‌شود" کافی است — نیازی به منطق پیچیده نیست
6. اگر تصمیمی لازم بود که در این سند مشخص نشده، به‌جای فرض کردن، از رز بپرس یا گزینه‌های محدود با دلیل پیشنهاد بده
