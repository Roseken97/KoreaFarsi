import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LibraryCard } from "@/components/library/LibraryCard";
import { PageHeader } from "@/components/shell/PageHeader";
import { BooksStackIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { getMyLibrary } from "@/lib/library/queries";
import { getMessages } from "@/lib/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.library.metaTitle };
}

/**
 * My Library (Phase 2, part 1). Entries appear only after an admin manually
 * grants access from /admin/orders — there is no payment gateway yet.
 */
export default async function LibraryPage() {
  if (isSupabaseConfigured && !(await getCurrentUser())) redirect("/auth/login?next=/library");

  const [{ m }, entries] = await Promise.all([getMessages(), getMyLibrary()]);
  const t = m.library;

  return (
    <div className="animate-fade-up">
      <PageHeader />
      <h1 className="font-display text-3xl font-semibold">{t.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t.subtitle}</p>

      {entries.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-sage-soft text-teal-deep">
            <BooksStackIcon width={30} height={30} />
          </span>
          <p className="mt-4 font-medium text-ink">{t.empty}</p>
          <p className="mt-1 max-w-xs text-sm text-ink-soft">{t.emptyHint}</p>
          <ButtonLink href="/bookstore" variant="secondary" className="mt-6 w-auto! px-8">
            {t.browseCta}
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <LibraryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
