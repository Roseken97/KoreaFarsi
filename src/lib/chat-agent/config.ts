/**
 * Chat-agent configuration. This folder is a self-contained module
 * (PROJECT_BRIEF §4b): no Next.js imports, so it can later move to its own
 * service (e.g. a Telegram bot) unchanged. Everything comes from env vars.
 */
export const chatConfig = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  // Brief named claude-sonnet-4-6; switched to claude-sonnet-5 (current
  // generation, same tier, cheaper per-token — see chat with Rose 2026-09-27).
  // Override with CHAT_MODEL without touching code.
  model: process.env.CHAT_MODEL || "claude-sonnet-5",
  maxOutputTokens: 4096,
  dailyLimit: Math.max(1, Number(process.env.CHAT_DAILY_LIMIT) || 10),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  ipSalt: process.env.CHAT_IP_SALT || "koreafarsi-default-salt",
  // Conversation context sent back to the model (older turns are dropped).
  maxHistoryMessages: 10,
  maxQuestionChars: 1000,
  maxHistoryMessageChars: 4000,
  // PROJECT_BRIEF §4: plan the move to RAG (pgvector) past ~50–100k words.
  ragWarningWords: 50_000,
} as const;

export const isChatConfigured = () => Boolean(chatConfig.anthropicApiKey);
export const hasChatStore = () => Boolean(chatConfig.supabaseUrl && chatConfig.serviceRoleKey);
