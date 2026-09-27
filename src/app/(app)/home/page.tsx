import type { Metadata } from "next";
import { fmt } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getCurrentUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.home.metaTitle };
}

// Milestone 1 stub: confirms the shell + session wiring.
// The four main cards (My Courses / Bookstore / AI Hub / Korea Life) land in Milestone 2.
export default async function HomePage() {
  const [{ m }, user] = await Promise.all([getMessages(), getCurrentUser()]);
  const name = (user?.user_metadata?.name as string | undefined) ?? null;

  return (
    <section className="animate-fade-up">
      <p lang="ko" className="text-sm text-ink-soft">
        {m.home.greeting} 👋
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        {name ? fmt(m.home.welcomeNamed, { name }) : m.home.welcomeGuest}
      </h1>
      <div className="mt-8 rounded-card border border-dashed border-line bg-surface/60 p-6 text-sm leading-7 text-ink-soft">
        {m.home.stub}
      </div>
    </section>
  );
}
