import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Notice } from "@/components/ui/Notice";
import { getAdminUser } from "@/lib/admin";
import { chatConfig, chatStore, countWords, hasChatStore, type KnowledgeSource } from "@/lib/chat-agent";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { KnowledgeAdmin } from "./KnowledgeAdmin";

export const metadata: Metadata = { title: "Knowledge base", robots: { index: false } };

/** Internal page (PROJECT_BRIEF §4): Rose adds chatbot sources here. Not linked from the app. */
export default async function KnowledgePage() {
  const { m, locale } = await getMessages();
  const t = m.admin;

  if (!isSupabaseConfigured || !hasChatStore()) {
    return (
      <Shell title={t.title}>
        <Notice>{t.notConfigured}</Notice>
      </Shell>
    );
  }

  if (!(await getCurrentUser())) redirect("/auth/login?next=/admin/knowledge");
  if (!(await getAdminUser())) {
    return (
      <Shell title={t.title}>
        <Notice tone="error">{t.forbidden}</Notice>
      </Shell>
    );
  }

  const { data } = await chatStore()!
    .from("knowledge_sources")
    .select("id, title, category, content, is_active, created_at")
    .order("created_at", { ascending: false });
  const sources = (data ?? []) as KnowledgeSource[];
  const active = sources.filter((s) => s.is_active);
  const words = active.reduce((n, s) => n + countWords(s.content), 0);

  return (
    <Shell title={t.title} subtitle={t.subtitle}>
      <p className="mb-4 text-sm font-medium text-ink-soft">
        {fmt(t.stats, { n: formatNumber(active.length, locale), w: formatNumber(words, locale) })}
      </p>
      {words > chatConfig.ragWarningWords && (
        <div className="mb-4">
          <Notice tone="error">{fmt(t.ragWarning, { n: formatNumber(chatConfig.ragWarningWords, locale) })}</Notice>
        </div>
      )}
      <KnowledgeAdmin sources={sources} />
    </Shell>
  );
}

function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up max-w-3xl">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 mb-6 text-sm text-ink-soft">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}
      {children}
    </div>
  );
}
