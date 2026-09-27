import type { Metadata } from "next";
import { ComingSoon } from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "کتاب‌فروشی" };

export default function Page() {
  return <ComingSoon title="کتاب‌فروشی" description="معرفی و خرید کتاب‌ها و دوره‌های کره‌فارسی به‌زودی از همین‌جا ممکن می‌شود." />;
}
