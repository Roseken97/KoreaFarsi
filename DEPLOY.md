# راهنمای راه‌اندازی و انتشار KoreaFarsi

این مراحل را به ترتیب انجام بده. هر مرحله‌ای که حساب کاربری تو را لازم دارد با 🔑 مشخص شده است.

---

## ۱. GitHub 🔑
1. در github.com یک repository **خصوصی** بساز (مثلاً `koreafarsi`).
2. کد را آپلود کن: یا GitHub را در claude.ai → Settings → Connectors وصل کن تا Claude مستقیم push کند، یا فایل zip را باز کن و با GitHub Desktop آپلود کن.

## ۲. Supabase 🔑
1. در [supabase.com](https://supabase.com) یک پروژه بساز. منطقه‌ی نزدیک به کاربران (مثلاً Frankfurt) مناسب است.
2. **SQL Editor** → فایل‌های `supabase/migrations/` را **به ترتیب شماره** اجرا کن (`0001` تا `0005`).
3. (اختیاری، برای تست) `supabase/seed/sample_products.sql` را اجرا کن. بعداً با `delete from public.products where is_sample;` پاک می‌شود.
4. **Project Settings → API**: این سه مقدار را یادداشت کن:
   - `Project URL`
   - `anon` / `publishable` key
   - `service_role` key ← **محرمانه**؛ هرگز در کد سمت کاربر یا جای عمومی قرار نگیرد.
5. **Authentication → Providers → Email**: فعال باشد. تأیید ایمیل (Confirm email) پیشنهاد می‌شود.
6. (اختیاری) **Google**: در Google Cloud Console یک OAuth Client بساز و Client ID/Secret را در Supabase وارد کن.

## ۳. کلید Claude API 🔑
1. در [platform.claude.com](https://platform.claude.com) حساب بساز و اعتبار (credit) اضافه کن.
2. **API Keys** → یک کلید بساز.
3. پیشنهاد: در **Limits** یک سقف هزینه‌ی ماهانه بگذار تا هزینه‌ی کنترل‌نشده ممکن نباشد.

## ۴. Netlify 🔑
> جایگزین Vercel (تصمیم اولیه‌ی `PROJECT_BRIEF.md`) به‌خاطر مشکل تأیید شماره در ثبت‌نام Vercel. از نظر فنی هم‌ارز است: هر دو سرور Node.js واقعی برای Next.js فراهم می‌کنند، رایگان برای شروع‌اند، و دامین شخصی به همین سادگی وصل می‌شود.
>
> ⚠️ **نکته‌ی فنی برای تست اول:** این پروژه از Next.js نسخه‌ی ۱۶ (خیلی تازه) استفاده می‌کند. پلاگین رسمی Next.js نتلیفای (`@netlify/plugin-nextjs`) معمولاً زود به نسخه‌های جدید Next.js می‌رسد، ولی ممکن است هنوز پشتیبانی نسخه‌ی ۱۶ را رسماً اعلام نکرده باشد. فایل `netlify.toml` در ریشه‌ی پروژه همین پلاگین را فعال می‌کند. **اولین deploy را به همین دلیل به‌عنوان یک تست در نظر بگیر** — اگر build خطا داد، همان پیام خطا را برایم بفرست تا بررسی کنم؛ راه‌حل معمولاً یک‌خطی است (تنظیم نسخه یا export دستی).

1. در [netlify.com](https://netlify.com) با حساب GitHub وارد شو → **Add new site → Import an existing project** → repository `KoreaFarsi` را انتخاب کن.
2. نتلیفای به‌خاطر `netlify.toml` خودش دستور build و پلاگین Next.js را تشخیص می‌دهد؛ چیزی تغییر نده.
3. **Site configuration → Environment variables** — این‌ها را وارد کن:

| متغیر | مقدار |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL از Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (محرمانه) |
| `ANTHROPIC_API_KEY` | کلید Claude API |
| `CHAT_MODEL` | `claude-sonnet-4-6` (طبق brief؛ برای تغییر مدل فقط همین را عوض کن) |
| `CHAT_DAILY_LIMIT` | `10` |
| `ADMIN_EMAILS` | ایمیل خودت (برای دسترسی به پایگاه دانش) |
| `CHAT_IP_SALT` | یک رشته‌ی تصادفی طولانی |

4. **Deploy site** را بزن. بعد از چند دقیقه یک آدرس `…netlify.app` می‌گیری.

## ۵. اتصال Supabase به آدرس سایت
Supabase → **Authentication → URL Configuration**:
- **Site URL**: آدرس نهایی (فعلاً `https://…netlify.app`، بعداً دامین خودت)
- **Redirect URLs**: `https://…netlify.app/auth/callback` و بعداً `https://دامین‌تو/auth/callback`

## ۶. دامین شخصی 🔑
1. Netlify → Site → **Domain management → Add a domain** → دامین را اضافه کن.
2. Netlify رکوردهای DNS لازم را نشان می‌دهد (معمولاً یک رکورد `A` برای دامین اصلی و یک `CNAME` برای `www`؛ یا می‌توانی کل DNS دامین را به Netlify بسپاری).
3. این رکوردها را در پنل DNS جایی که دامین را خریده‌ای وارد کن. **هاست cPanel فعلی لازم نیست.**
4. بعد از فعال شدن (از چند دقیقه تا ۲۴ ساعت)، مرحله‌ی ۵ را با دامین جدید تکرار کن.

## ۷. تست نهایی روی گوشی
| تست | Android (Chrome) | iPhone (Safari) |
|---|---|---|
| نصب | منو ⋮ → Install app / Add to Home screen | دکمه‌ی Share → Add to Home Screen |
| اجرا از آیکون | بدون نوار آدرس باز شود | بدون نوار آدرس باز شود |
| ثبت‌نام / ورود / فراموشی رمز | ✓ | ✓ |
| سبد خرید و درخواست خرید | ✓ | ✓ |
| چت‌بات (یک سؤال) | ✓ | ✓ |
| تغییر زبان | ✓ | ✓ |
| حالت آفلاین (حالت هواپیما) | صفحه‌ی «اتصال برقرار نیست» | همان |

## ۸. بعد از انتشار — کارهای روزمره
- **افزودن منبع به چت‌بات:** `https://دامین‌تو/admin/knowledge` (فقط برای ایمیل‌های `ADMIN_EMAILS`)
- **درخواست‌های خرید:** Supabase → Table Editor → `purchase_requests`
- **محصولات:** Supabase → Table Editor → `products` (راهنما در README)
- **گفتگوهای چت‌بات:** Supabase → Table Editor → `chat_messages`

> ⚠️ **قبل از انتشار عمومی — موارد نیازمند بررسی (نه فرض):**
> - **قوانین و مناطق پشتیبانی‌شده‌ی سرویس‌ها:** Anthropic (Claude API)، Netlify و Supabase شرکت‌های آمریکایی هستند و هرکدام فهرست کشورهای پشتیبانی‌شده و شرایط استفاده‌ی خودشان را دارند. پیش از راه‌اندازی برای کاربران داخل ایران، شرایط فعلی هر سه را در صفحه‌های رسمی‌شان بررسی کن (از جمله محل حساب صاحب سرویس و محل کاربران نهایی). این یک ریسک حقوقی/تجاری است و از روی کد قابل حل نیست.
> - **دسترسی شبکه:** سایت را بعد از انتشار با چند اینترنت ایرانی (همراه اول، ایرانسل، ADSL) تست کن؛ دسترسی به سرویس‌های خارجی ممکن است متغیر باشد.
