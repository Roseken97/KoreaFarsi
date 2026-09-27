import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "خانه" };

// Milestone 1 stub: confirms the shell + session wiring.
// The four main cards (My Courses / Bookstore / AI Hub / Korea Life) land in Milestone 2.
export default async function HomePage() {
  const user = await getCurrentUser();
  const name = (user?.user_metadata?.name as string | undefined) ?? null;

  return (
    <section className="animate-fade-up">
      <p className="text-sm text-ink-soft">안녕하세요 👋</p>
      <h1 className="mt-1 text-2xl font-bold md:text-3xl">
        {name ? `${name}، خوش آمدی` : "به کره‌فارسی خوش آمدی"}
      </h1>
      <div className="mt-8 rounded-card border border-dashed border-line bg-surface/60 p-6 text-sm leading-7 text-ink-soft">
        صفحه‌ی خانه با چهار کارت اصلی در مرحله‌ی بعد ساخته می‌شود.
      </div>
    </section>
  );
}
