export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string) {
  if (!email.trim()) return "ایمیل را وارد کنید.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "آدرس ایمیل معتبر نیست.";
  return "";
}

export function validatePassword(password: string) {
  if (!password) return "رمز عبور را وارد کنید.";
  if (password.length < MIN_PASSWORD_LENGTH) return `رمز عبور باید حداقل ${toFa(MIN_PASSWORD_LENGTH)} کاراکتر باشد.`;
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "رمز عبور باید شامل حرف انگلیسی و عدد باشد.";
  return "";
}

/** Only allow same-origin relative paths as post-auth redirect targets. */
export function safeNext(next: string | null | undefined, fallback = "/home") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}

export function toFa(n: number) {
  return n.toLocaleString("fa-IR");
}
