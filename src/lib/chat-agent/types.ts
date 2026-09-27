export const KNOWLEDGE_CATEGORIES = ["tutor", "university", "scholarship", "visa_sim", "general"] as const;
export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

export type KnowledgeSource = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  is_active: boolean;
  created_at: string;
};

export type ChatTurn = { role: "user" | "assistant"; content: string };
