import type { Metadata } from "next";
import { ComingSoon } from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "دستیار کره‌فارسی" };

export default function Page() {
  return <ComingSoon title="دستیار کره‌فارسی" description="دستیار اطلاعاتی (زبان کره‌ای، دانشگاه‌ها، بورسیه و زندگی در کره) به‌زودی فعال می‌شود." />;
}
