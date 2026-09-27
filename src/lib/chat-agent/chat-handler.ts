import Anthropic from "@anthropic-ai/sdk";
import { chatConfig, isChatConfigured } from "./config";
import { loadKnowledge } from "./knowledge-loader";
import { countQuestionInMemory, getUsage, type Usage } from "./rate-limiter";
import { STREAM_ERROR_MARKER } from "./protocol";
import { chatStore } from "./store";
import { buildSystemPrompt } from "./system-prompt";
import type { ChatTurn } from "./types";

export type ChatRequest = {
  sessionId: string;
  ipHash: string;
  userId: string | null;
  locale: string;
  question: string;
  history: ChatTurn[];
  /** e.g. "Instagram: @koreafarsi, Telegram: @…" — injected by the host app */
  contactLine: string;
};

export type ChatResult =
  | { type: "stream"; stream: ReadableStream<Uint8Array>; usage: Usage }
  | { type: "limited"; usage: Usage }
  | { type: "invalid" }
  | { type: "not_configured" };


let client: Anthropic | null = null;
const anthropic = () => (client ??= new Anthropic({ apiKey: chatConfig.anthropicApiKey }));

/** Keeps only well-formed, alternating turns (starting with the user), newest last, size-capped. */
function sanitizeHistory(history: unknown): ChatTurn[] {
  if (!Array.isArray(history)) return [];
  const turns = history
    .filter(
      (t): t is ChatTurn =>
        (t?.role === "user" || t?.role === "assistant") && typeof t?.content === "string" && t.content.trim() !== "",
    )
    .map((t) => ({ role: t.role, content: t.content.slice(0, chatConfig.maxHistoryMessageChars) }))
    .slice(-chatConfig.maxHistoryMessages);
  const out: ChatTurn[] = [];
  for (const t of turns) {
    if (out.length === 0 && t.role !== "user") continue;
    if (out.length && out[out.length - 1].role === t.role) continue;
    out.push(t);
  }
  // History must end with an assistant turn so the new question follows it.
  if (out.length && out[out.length - 1].role === "user") out.pop();
  return out;
}

async function log(row: { session_id: string; ip_hash: string; user_id: string | null; locale: string; role: ChatTurn["role"]; content: string }) {
  const store = chatStore();
  if (!store) return;
  const { error } = await store.from("chat_messages").insert(row);
  if (error) console.error("[chat-agent] failed to log message:", error.message);
}

export async function handleChat(req: ChatRequest): Promise<ChatResult> {
  if (!isChatConfigured()) return { type: "not_configured" };

  const question = req.question?.trim() ?? "";
  if (!question || question.length > chatConfig.maxQuestionChars) return { type: "invalid" };

  const usage = await getUsage(req.sessionId, req.ipHash);
  if (usage.remaining <= 0) return { type: "limited", usage };

  const { sources } = await loadKnowledge();
  const history = sanitizeHistory(req.history);
  const base = { session_id: req.sessionId, ip_hash: req.ipHash, user_id: req.userId, locale: req.locale };

  // Count the question up front so parallel requests can't exceed the limit by much.
  await log({ ...base, role: "user", content: question });
  countQuestionInMemory(req.sessionId, req.ipHash);
  const after: Usage = { ...usage, used: usage.used + 1, remaining: usage.remaining - 1 };

  const messages: Anthropic.MessageParam[] = [...history, { role: "user", content: question }];
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answer = "";
      try {
        const response = anthropic().messages.stream({
          model: chatConfig.model,
          max_tokens: chatConfig.maxOutputTokens,
          system: buildSystemPrompt(sources, req.contactLine),
          messages,
        });
        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            answer += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason === "refusal" && !answer) throw new Error("refusal");
        if (process.env.NODE_ENV !== "production") {
          const u = final.usage;
          console.info(`[chat-agent] tokens in=${u.input_tokens} cache_read=${u.cache_read_input_tokens ?? 0} cache_write=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens}`);
        }
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) console.error("[chat-agent] Anthropic rate limit");
        else if (error instanceof Anthropic.AuthenticationError) console.error("[chat-agent] invalid ANTHROPIC_API_KEY");
        else if (error instanceof Anthropic.APIConnectionError) console.error("[chat-agent] could not reach the Anthropic API");
        else if (error instanceof Anthropic.APIError) console.error(`[chat-agent] API error ${error.status}: ${error.message}`);
        else console.error("[chat-agent] chat failed:", error);
        controller.enqueue(encoder.encode(STREAM_ERROR_MARKER));
      } finally {
        if (answer) await log({ ...base, role: "assistant", content: answer });
        controller.close();
      }
    },
  });

  return { type: "stream", stream, usage: after };
}

/** Remaining questions today, for showing the counter before the first message. */
export async function getChatUsage(sessionId: string, ipHash: string) {
  return getUsage(sessionId, ipHash);
}
