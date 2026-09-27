// Public surface of the chat-agent module (PROJECT_BRIEF §4b).
export { handleChat, getChatUsage, type ChatRequest, type ChatResult } from "./chat-handler";
export { STREAM_ERROR_MARKER } from "./protocol";
export { hashIp } from "./rate-limiter";
export { chatConfig, isChatConfigured, hasChatStore } from "./config";
export { loadKnowledge, countWords } from "./knowledge-loader";
export { chatStore } from "./store";
export { KNOWLEDGE_CATEGORIES, type KnowledgeCategory, type KnowledgeSource, type ChatTurn } from "./types";
