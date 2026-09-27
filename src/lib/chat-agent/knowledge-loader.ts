import { chatConfig, hasChatStore } from "./config";
import { SAMPLE_KNOWLEDGE } from "./sample-knowledge";
import { chatStore } from "./store";
import { KNOWLEDGE_CATEGORIES, type KnowledgeSource } from "./types";

export type LoadedKnowledge = {
  sources: KnowledgeSource[];
  words: number;
  isSample: boolean;
  /** true past PROJECT_BRIEF's RAG threshold — time to plan the pgvector migration */
  overRagThreshold: boolean;
};

export function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Active knowledge sources, in a stable order (category, then creation time).
 * Stable ordering keeps the system prompt byte-identical between requests,
 * which is what lets prompt caching reuse it.
 */
export async function loadKnowledge(): Promise<LoadedKnowledge> {
  let sources: KnowledgeSource[] = SAMPLE_KNOWLEDGE;
  let isSample = true;

  if (hasChatStore()) {
    const { data, error } = await chatStore()!
      .from("knowledge_sources")
      .select("id, title, category, content, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw new Error(`knowledge_sources: ${error.message}`);
    sources = (data ?? []) as KnowledgeSource[];
    isSample = false;
  }

  sources = [...sources].sort(
    (a, b) => KNOWLEDGE_CATEGORIES.indexOf(a.category) - KNOWLEDGE_CATEGORIES.indexOf(b.category),
  );
  const words = sources.reduce((n, s) => n + countWords(s.content), 0);
  if (words > chatConfig.ragWarningWords) {
    console.warn(`[chat-agent] knowledge base is ${words} words — plan the RAG migration (PROJECT_BRIEF §4).`);
  }
  return { sources, words, isSample, overRagThreshold: words > chatConfig.ragWarningWords };
}
