import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/server";
import { AiPracticeView } from "./AiPracticeView";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.aiPractice.metaTitle };
}

/** AI Hub landing — a floating character + the 5-section arc carousel. Each section's real content lives at /ai-hub/<key>. */
export default function AiHubPage() {
  return <AiPracticeView />;
}
