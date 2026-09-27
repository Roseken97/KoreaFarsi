import type { Metadata } from "next";
import { ComingSoon } from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "دوره‌های من" };

export default function Page() {
  return <ComingSoon title="دوره‌های من" description="دوره‌های ویدیویی و درس‌ها در فاز بعدی اضافه می‌شوند." />;
}
