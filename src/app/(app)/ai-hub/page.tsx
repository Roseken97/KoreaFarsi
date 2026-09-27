import type { Metadata } from "next";
import { ChatBox } from "@/components/chat/ChatBox";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.chat.metaTitle };
}

/** AI Hub → informational chatbot (Phase 1). Voice AI Practice is a later phase. */
export default function AiHubPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-3xl">
      <ChatBox />
    </div>
  );
}
