"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { KNOWLEDGE_CATEGORIES, chatStore, type KnowledgeCategory } from "@/lib/chat-agent";

export type AdminResult = { ok: true } | { ok: false; error: "title" | "content" | "forbidden" | "generic" };

const MAX_CONTENT_CHARS = 200_000;

async function guard() {
  const [admin, store] = [await getAdminUser(), chatStore()];
  return admin && store ? store : null;
}

export async function addKnowledgeSource(input: { title: string; category: string; content: string }): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };

  const title = input.title?.trim().slice(0, 200) ?? "";
  const content = input.content?.trim().slice(0, MAX_CONTENT_CHARS) ?? "";
  const category = (KNOWLEDGE_CATEGORIES as readonly string[]).includes(input.category)
    ? (input.category as KnowledgeCategory)
    : "general";
  if (!title) return { ok: false, error: "title" };
  if (!content) return { ok: false, error: "content" };

  const { error } = await store.from("knowledge_sources").insert({ title, category, content });
  if (error) {
    console.error("[admin] add source:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidatePath("/admin/knowledge");
  return { ok: true };
}

export async function setKnowledgeSourceActive(id: string, isActive: boolean): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store
    .from("knowledge_sources")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath("/admin/knowledge");
  return { ok: true };
}

export async function deleteKnowledgeSource(id: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("knowledge_sources").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath("/admin/knowledge");
  return { ok: true };
}
