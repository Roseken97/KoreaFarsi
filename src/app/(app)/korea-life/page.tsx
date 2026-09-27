import type { Metadata } from "next";
import { ComingSoon } from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "زندگی در کره" };

export default function Page() {
  return <ComingSoon title="زندگی در کره" description="این بخش در فاز بعدی اضافه می‌شود." />;
}
