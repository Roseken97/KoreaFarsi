/** Maps Supabase Auth error codes to Persian, user-facing messages. */
const MESSAGES: Record<string, string> = {
  invalid_credentials: "ایمیل یا رمز عبور درست نیست.",
  email_not_confirmed: "ایمیل شما هنوز تأیید نشده است. لطفاً صندوق ایمیل خود را بررسی کنید.",
  user_already_exists: "با این ایمیل قبلاً حساب ساخته شده است. وارد شوید.",
  email_exists: "با این ایمیل قبلاً حساب ساخته شده است. وارد شوید.",
  weak_password: "رمز عبور ضعیف است. حداقل ۸ کاراکتر، شامل حرف و عدد انتخاب کنید.",
  same_password: "رمز جدید باید با رمز قبلی متفاوت باشد.",
  over_email_send_rate_limit: "تعداد درخواست‌ها زیاد بود. چند دقیقه‌ی دیگر دوباره امتحان کنید.",
  over_request_rate_limit: "تعداد درخواست‌ها زیاد بود. چند دقیقه‌ی دیگر دوباره امتحان کنید.",
  email_address_invalid: "آدرس ایمیل معتبر نیست.",
  signup_disabled: "ثبت‌نام در حال حاضر غیرفعال است.",
  session_not_found: "نشست شما منقضی شده است. دوباره تلاش کنید.",
  provider_disabled: "این روش ورود هنوز فعال نشده است.",
};

export function authErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return "";
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.message?.toLowerCase().includes("fetch")) return "اتصال به سرور برقرار نشد. اینترنت خود را بررسی کنید.";
  return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
}

export const NOT_CONFIGURED_MESSAGE =
  "سرویس ورود هنوز متصل نشده است (کلیدهای Supabase در فایل ‎.env.local‎ تنظیم نشده‌اند).";
