import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/server";
import { AiPracticeView } from "./AiPracticeView";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.aiPractice.metaTitle };
}

/** AI Hub landing — dark immersive experience with premium carousel. Each section's real content lives at /ai-hub/<key>. */
export default function AiHubPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <AiPracticeView />
    </div>
  );
}
