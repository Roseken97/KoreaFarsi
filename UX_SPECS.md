# KoreaFarsi — UX Specifications (از روی اسکچ‌های طراحی)

**هدف سند:** توضیح متنی و ساختاریافته‌ی تمام صفحات UX طراحی‌شده، برای استفاده‌ی مستقیم در کدنویسی. این سند جایگزین تصاویر اسکچ نیست — همراه با `KoreaFarsi-UX-Sketches.pdf` (مرجع بصری نهایی برای رنگ/فونت/spacing) استفاده شود.

> **یادآوری محدوده:** طبق `PROJECT_BRIEF.md`، فقط صفحات علامت‌خورده با ✅ در Phase 1 ساخته می‌شوند. بقیه فقط برای مرجع آینده مستند شده‌اند.

---

## 01 — Splash Screen ✅

**عناصر:**
- لوگو KoreaFarsi (گل کوچک، وسط صفحه)
- نام برند: "KoreaFarsi" (تایپوگرافی درشت)
- تگ‌لاین برند: "A Bridge to a Brighter You"
- خط جداکننده‌ی کوتاه
- متن ثانویه: "More than a language, a closer you."
- Loading Indicator: دایره‌ی چرخان ساده + متن "Loading your journey…"
- عنصر بصری پس‌زمینه: سیلوئت تپه‌ها/شهر سئول (برج N Seoul Tower + ساختمان سنتی کره‌ای) به‌صورت subtle، در پایین صفحه

**User Flow:** Splash Screen → Onboarding
**User Goal:** حس برند و atmosphere را در حین لودشدن اپ منتقل کند

---

## 02 — Onboarding (۴ اسلاید) ✅

**ساختار کلی هر اسلاید:**
- Header: لوگو KoreaFarsi (چپ) + دکمه‌ی "Skip" (راست)
- Visual: تصویر/illustration مرتبط با برند (سئول، یادگیری، فرهنگ کره)
- شماره‌ی اسلاید: مثلاً "01 / 04"
- Title: پیام اصلی اسلاید (تایپوگرافی درشت)
- Description: توضیح کوتاه و شفاف
- Pagination: نقطه‌های نشان‌دهنده‌ی اسلاید فعلی (۴ نقطه)
- دکمه‌ی Primary CTA: "Next →"

**۴ اسلاید:**
1. **A New Journey Awaits** — "Learn Korean with a path designed for Persian speakers."
2. **Learn Your Way**
3. **Real Practice, Real Progress**
4. **Be Part of a Bigger Story**

**User Flow:** Splash → Onboarding (۴ اسلاید) → Home

---

## 02 (دوم) — Home Screen (Main Hub) ✅

**عناصر از بالا به پایین:**
1. **Header:** لوگو برند (چپ) + آیکون Notification (زنگ) + آواتار پروفایل کاربر (راست)
2. **Hero Visual:** بنر تصویری با atmosphere کره‌ای (سئول، شکوفه‌ی گیلاس) + پیام کوتاه انگیزشی: "Small steps, big changes."
3. **Main Sections — ۴ کارت اصلی (Grid ۲×۲):**
   - **My Courses** (آیکون کتاب‌های روی‌هم) — "Continue learning towards your goals"
   - **Bookstore** (آیکون کیف خرید) — "Books, PDFs and learning materials"
   - **AI Hub** (آیکون ربات) — "Practice Korean with AI" ⚠️ *در Phase 1، این کارت به چت‌بات اطلاعاتی متصل می‌شود، نه AI Practice صوتی — متن کارت باید متناسب بازنویسی شود، مثلاً "Ask KoreaFarsi AI"*
   - **Korea Life** (آیکون فانوس/دروازه‌ی سنتی) — "Explore culture, travel, food and more"
4. **Continue Your Journey:** کارت افقی نشان‌دهنده‌ی آخرین فعالیت کاربر (عنوان درس + Progress Bar + دکمه‌ی Play) — *Phase 1: Placeholder*
5. **Today's Plan:** ۴ آیکون کوچک (Watch/Review/Practice/Speak) با progress ring — *Phase 1: Placeholder، چون Planner فاز بعد است*
6. **Bottom Navigation:** ۵ آیتم — Planner / Library / **Home (وسط، برجسته)** / Dictionary / Account

**User Flow:** Splash Screen → Onboarding → Home
**User Goal:** دسترسی سریع به بخش‌های اصلی و ادامه‌ی مسیر یادگیری

---

## 03 — Auth Flow ✅ (بدون OTP در Phase 1)

**۸ مرحله (طبق اسکچ)، در Phase 1 فقط مراحل ۱،۲،۳،۴،۶،۷ پیاده می‌شود:**

1. **Welcome** — لوگو + دکمه‌ی "Create an account" + "Log in" + "Continue as guest"
2. **Sign Up** — فیلدهای Full Name / Email / Password + دکمه‌ی Sign Up + گزینه‌ی "Continue with Google/Apple"
3. **Login** — فیلدهای Email or Phone / Password + "Remember me" + "Forgot password?" + Google/Apple
4. **Forgot Password** — فیلد Email or Phone + دکمه‌ی "Send Reset Link"
5. ~~OTP Verification~~ ❌ *حذف در Phase 1*
6. **Reset Password** — فیلدهای New Password / Confirm Password
7. **Success** — پیام "You're In!" + دکمه‌ی "Go to Home"
8. **Optional Profile** — فرم اختیاری (Name / زبان مادری / سطح کره‌ای / هدف) + دکمه‌ی "Continue" یا "Skip"

**نکات کلیدی طراحی:**
- جریان ساده و تمیز
- گزینه‌های ورود چندگانه (Email, Google, Apple, Phone) — *Phase 1: فقط Email/Password کافی است، Google اختیاری اگر زمان اجازه داد*
- Setup پروفایل اختیاری بعد از signup

**User Flow:** Welcome → Sign Up/Login → (OTP در فاز بعد) → Success → Optional Profile → Home

---

## 05 — Account Screen ✅ (بخشی از آن Placeholder)

**عناصر:**
1. **Header:** لوگو + آیکون Notification + آیکون Settings (چرخ‌دنده)
2. **User Profile:** آواتار (قابل ویرایش) + نام کاربر (مثلاً "Fateme") + پیام شخصی کوتاه ("A better you, one day at a time.")
3. **Progress Summary (سه‌تایی):** Level (مثلاً "Level 3") / XP (مثلاً "320 XP") / Streak (مثلاً "12 Day Streak") — ⚠️ *Phase 1: این سه‌تایی Placeholder یا مقدار ثابت/صفر*
4. **Motivational Banner:** "Keep going! Consistency creates real progress."
5. **لیست آیتم‌ها (هرکدام با آیکون + عنوان + توضیح کوتاه + فلش):**
   - My Courses ❌ Placeholder
   - My Books ❌ Placeholder
   - My Planner ❌ Placeholder
   - My Achievements ❌ Placeholder
   - **Language Settings** ✅ (فارسی/English)
   - **App Settings** ✅ (Notifications, appearance, privacy)
   - **Help & Support** ✅
   - **Log Out** ✅

**User Flow:** Home → Account → Edit Profile / Settings / Logout

---

## ۱۳ — Bookstore ✅

**عناصر:**
1. **Header:** دکمه‌ی Back + لوگو + آیکون جستجو + آیکون سبد خرید (با badge تعداد) + منوی سه‌نقطه
2. **Page Title:** "Bookstore" + تگ‌لاین "Learn deeper. Go further."
3. **Hero Banner:** معرفی "KoreaFarsi Books" + دکمه‌ی "Explore Books →"
4. **Category Tabs (آیکون + برچسب):** All Books / Korean Alphabet / Four Skills / Workbooks / Planners / Merch
5. **Filter Tabs:** All / PDF (eBook) / Physical Book / Bundles / Coming Soon
6. **Featured Books (کارت‌های افقی/گرید):** هر کارت شامل: کاور کتاب، عنوان (فارسی+انگلیسی)، سطح، فرمت (PDF/Physical به‌صورت badge)، قیمت (تومان)، دکمه‌ی سبد خرید
7. **Popular Bundles:** کارت بسته (مثلاً "Complete Set Levels 1-1+1-2" با تخفیف ۲۰٪) + دکمه‌ی "Add to Cart"
8. **Community Banner:** "Join KoreaFarsi Community — Get exclusive discounts, early access…"
9. **Bottom Navigation:** Planner / Courses / **Home** / Bookstore / Account

**⚠️ نکته‌ی Phase 1:** دکمه‌ی سبد خرید/خرید نهایی به Checkout واقعی وصل نمی‌شود — به‌جایش پیام/فرم تماس نمایش داده می‌شود (طبق PROJECT_BRIEF.md).

**User Flow:** Home → Bookstore → Browse Categories → View Book → Choose Format → Add to Cart → (Checkout در فاز بعد)

---

## چت‌بات اطلاعاتی (AI Hub) ✅ — طراحی جدید، بدون اسکچ مجزا

این بخش در اسکچ‌های اصلی طراحی نشده (چون AI Hub در اسکچ به AI Practice اشاره داره که فاز بعده). طراحی پیشنهادی برای Phase 1:

**عناصر:**
- ورودی از کارت "AI Hub" در Home (متن کارت را به چیزی مثل "از KoreaFarsi AI بپرس" تغییر دهید)
- صفحه‌ی چت ساده: Header (لوگو + عنوان "چت با KoreaFarsi") + تاریخچه‌ی پیام‌ها (حباب‌های چت، راست‌چین برای فارسی) + نوار ورودی پایین صفحه با دکمه‌ی ارسال
- استایل حباب‌ها هم‌راستا با پالت رنگی برند (کرم/بژ برای پیام AI، صورتی ملایم برای پیام کاربر — یا هر ترکیبی که با پالت رسمی KoreaFarsi هماهنگ باشد)
- پیام خوش‌آمدگویی اولیه‌ی AI: توضیح کوتاه اینکه چه سؤالاتی می‌توان پرسید (زبان کره‌ای، دانشگاه، بورسیه، اطلاعات جانبی)
- اگر Rate Limit روزانه تمام شد: پیام مناسب + پیشنهاد تماس مستقیم

---

## صفحات خارج از محدوده‌ی Phase 1 (فقط مرجع مستندسازی)

### ۰۳ (دوم) — Planner Screen ❌ فاز بعد
Header با متن انگیزشی + View Switch (Today/Week/Month) + Date Selector (تقویم افقی) + Today's Plan (لیست Task Card با آیکون، عنوان، زمان تخمینی، وضعیت: Completed/Current/Not started/Locked) + Progress Overview (٪ تکمیل روزانه) + Vocabulary Recycling section + Motivational Banner.

### ۰۴ — Library Screen (دو نسخه‌ی طراحی، یکی نهایی انتخاب شود) ❌ فاز بعد
Header + Tabs (All/My Books/PDFs/Favorites) + Search & Filter + Book Cards (کاور، عنوان، سطح، Progress Bar، دکمه‌ی Continue/Start، منوی سه‌نقطه) + Related Resources (Audio Files, Supplementary Materials, My Notes, Favorites) + Motivational Banner.

### ۰۶ — Courses List Screen ❌ فاز بعد
Header + Filter Tabs (All/Beginner/Intermediate/Advanced) + لیست Course Card (کاور، عنوان، توضیح کوتاه، تعداد Lesson، سطح، فلش ورود).

### ۰۸ — Course Lesson List (داخل یک دوره) ❌ فاز بعد
Course Info Header + Progress Bar کلی + Unit Tabs (افقی، قابل اسکرول) + Lesson List (هر Lesson: شماره، عنوان کره‌ای+ترجمه، زمان، تعداد فعالیت، وضعیت: Completed/Current/Locked) + دکمه‌ی Continue.

### ۰۹ — Lesson Overview (قبل از شروع درس) ❌ فاز بعد
Lesson Info (سطح > یونیت > شماره درس) + Learning Goals (چک‌لیست) + Lesson Meta (زمان تخمینی، سطح، تعداد فعالیت) + Lesson Journey (مراحل: Teacher Content → Vocabulary → Practice → Conversation، هرکدام با وضعیت) + Useful Materials (دانلود PDF/Audio) + دکمه‌ی "Start Lesson".

### ۱۰ — Lesson: Teacher Content ❌ فاز بعد
Lesson Title (کره‌ای + ترجمه) + Video Player (کنترل‌های Play، Subtitle، Speed) + Content Tabs (Video/Script/Vocabulary/Notes) + Video Chapters (لیست بخش‌های ویدیو با Timestamp) + "Today's Tip" (نکته‌ی فرهنگی/زبانی به فارسی) + ناوبری Previous/Next.

### ۱۲ — AI Practice ❌ فاز بسیار بعدتر (جدا از چت‌بات اطلاعاتی)
Tabs: Speak/Chat/Listen/Shadow/Grammar + Level Selector + Practice Modes (Free Conversation, Scenario Practice, Pronunciation Coach, Topic Challenge) + Recommended for You (سناریوهای پیشنهادی بر اساس سطح) + Progress (٪ کلی، تعداد مکالمه، ساعت، badge).

### ۱۴ — Korea Life ❌ فاز بعد
Category Tabs (All/Culture/Daily Life/People/Travel/Food) + Featured Content (مقاله‌ی برجسته) + Quick Sections (Culture Notes, Did You Know?) + Content List (کارت‌های مقاله با تصویر، عنوان کره‌ای+ترجمه، برچسب دسته، دکمه‌ی Bookmark).

---

## اصول طراحی مشترک در همه‌ی صفحات (از اسکچ‌ها استخراج شده)

- **Bottom Navigation موبایل:** همیشه ۵ آیتم، Home همیشه وسط و برجسته (دایره‌ای، رنگ متفاوت)
- **پالت رنگ:** کرم/بژ گرم، صورتی ملایم (blush)، سبز/سبز‌آبی کم‌رنگ (sage/teal)، متن سرمه‌ای/زغالی تیره
- **تایپوگرافی:** عنوان‌های درشت با فونت Serif برای برندینگ (مثل لوگو "KoreaFarsi")، متن بدنه Sans-serif ساده
- **آیکون‌ها:** خطی (outline)، ساده، بدون shading سنگین
- **کارت‌ها:** گوشه‌ی گرد، سایه‌ی ملایم، فاصله‌گذاری سخاوتمندانه
- **عناصر تزئینی:** شکوفه‌ی گیلاس (sakura)، شاخه‌های ظریف، به‌عنوان لمس بصری هویت برند — نه پرکننده‌ی فضا
- **دوزبانه بودن:** بسیاری از متون هم فارسی/انگلیسی و هم کره‌ای را همزمان نشان می‌دهند (مثلاً «داستان بهتر» + «더 나은 이야기») — این الگو باید در طراحی رعایت شود
- **Motivational Banner:** تقریباً در هر صفحه یک پیام انگیزشی کوتاه (فارسی یا دوزبانه) در پایین یا وسط صفحه دیده می‌شود

---

*این سند مکمل `PROJECT_BRIEF.md` و `PROJECT_CONTEXT.md` است. برای رنگ دقیق، فونت، و جزئیات بصری، فایل `KoreaFarsi-UX-Sketches.pdf` مرجع نهایی است.*
