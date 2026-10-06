"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { ReviewIcon, SendIcon, SparkleIcon } from "@/components/icons";
import { STREAM_ERROR_MARKER } from "@/lib/chat-agent/protocol";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { RichText } from "./RichText";

type Message = { role: "user" | "assistant"; content: string; error?: boolean };
type Status = { configured: boolean; remaining: number | null; limit: number | null };

const STORAGE_KEY = "kf:chat:v1";
const MAX_CHARS = 1000;

function loadHistory(): Message[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x?.content === "string") : [];
  } catch {
    return [];
  }
}

export function ChatBox({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { m, locale } = useI18n();
  const t = m.chat;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Restore this tab's conversation (sessionStorage is browser-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(loadHistory());
    fetch("/api/chat", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setStatus({ configured: Boolean(d.configured), remaining: d.remaining ?? null, limit: d.limit ?? null }))
      .catch(() => setStatus({ configured: false, remaining: null, limit: null }));
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((x) => !x.error).slice(-30)));
    } catch {}
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const limitReached = status?.remaining === 0;
  const disabled = busy || !status?.configured || limitReached;

  async function ask(question: string) {
    const q = question.trim();
    if (!q || disabled) return;
    if (q.length > MAX_CHARS) return setNotice(fmt(t.tooLong, { n: formatNumber(MAX_CHARS, locale) }));

    setNotice(null);
    setInput("");
    const history = messages.filter((x) => !x.error).map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setBusy(true);

    const setLast = (patch: Partial<Message>) =>
      setMessages((prev) => prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, ...patch } : msg)));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setStatus((s) => (s ? { ...s, remaining: 0, limit: data.limit ?? s.limit } : s));
          setMessages((prev) => prev.slice(0, -2));
          return;
        }
        if (res.status === 503) setStatus((s) => (s ? { ...s, configured: false } : s));
        setLast({ content: t.error, error: true });
        return;
      }

      const remaining = Number(res.headers.get("X-Chat-Remaining"));
      if (!Number.isNaN(remaining)) setStatus((s) => (s ? { ...s, remaining } : s));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        const failed = text.includes(STREAM_ERROR_MARKER);
        const clean = text.replace(STREAM_ERROR_MARKER, "");
        setLast(failed && !clean.trim() ? { content: t.error, error: true } : { content: clean });
      }
    } catch {
      setLast({ content: t.error, error: true });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter adds a line. Ignore Enter while an IME is composing.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      ask(input);
    }
  }

  function newChat() {
    setMessages([]);
    setNotice(null);
  }

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col">
      {/* Header — skipped when embedded under a page that already shows its own title (e.g. AI Practice) */}
      {hideHeader ? (
        messages.length > 0 && (
          <div className="mb-3 flex justify-end">
            <button
              onClick={newChat}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 text-xs font-medium text-ink-soft shadow-soft hover:text-ink disabled:opacity-50"
            >
              <ReviewIcon width={14} height={14} />
              {t.newChat}
            </button>
          </div>
        )
      ) : (
        <header className="mb-4 flex items-center gap-3">
          <LogoMark size={44} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl leading-tight font-semibold">{t.title}</h1>
            <p className="text-xs text-ink-soft">{t.subtitle}</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={newChat}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 text-xs font-medium text-ink-soft shadow-soft hover:text-ink disabled:opacity-50"
            >
              <ReviewIcon width={14} height={14} />
              {t.newChat}
            </button>
          )}
        </header>
      )}

      {/* Conversation */}
      <div className="flex flex-1 flex-col gap-3" aria-live="polite">
        <Bubble role="assistant" label={t.assistant}>
          <p className="my-1">{t.welcome}</p>
        </Bubble>

        {messages.length === 0 && status?.configured && !limitReached && (
          <div className="mt-1">
            <p className="mb-2 text-xs font-medium text-ink-faint">{t.suggestionsLabel}</p>
            <div className="flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-line bg-surface px-3.5 py-2 text-start text-[13px] text-ink shadow-soft transition hover:border-blush"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Bubble key={i} role={msg.role} label={msg.role === "user" ? t.you : t.assistant} error={msg.error}>
            {msg.content ? (
              msg.role === "assistant" ? <RichText text={msg.content} /> : <p className="my-1 whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <TypingDots label={t.typing} />
            )}
          </Bubble>
        ))}

        {status && !status.configured && <SystemNote>{t.notConfigured}</SystemNote>}
        {limitReached && (
          <SystemNote>
            {fmt(t.limitReached, { limit: formatNumber(status?.limit ?? 10, locale) })}{" "}
            <Link href="/account/help" className="font-semibold underline">
              {t.contactTeam}
            </Link>
          </SystemNote>
        )}
        {/* scroll target sits clear of the sticky composer */}
        <div ref={bottomRef} className="scroll-mb-44" />
      </div>

      {/* Composer — sits above the mobile bottom nav */}
      <div className="sticky bottom-[4.5rem] z-10 -mx-4 mt-2 bg-gradient-to-t from-cream from-80% to-transparent px-4 pt-5 pb-3">
        <form onSubmit={onSubmit} className="flex items-end gap-2 rounded-card border border-line bg-surface p-2 shadow-lift">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            rows={1}
            maxLength={MAX_CHARS + 200}
            disabled={!status?.configured || limitReached}
            dir="auto"
            className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none [field-sizing:content] placeholder:text-ink-faint disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            aria-label={t.send}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-violet text-white transition hover:bg-violet-deep disabled:opacity-40"
          >
            <SendIcon width={20} height={20} />
          </button>
        </form>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 text-[11px] text-ink-faint">
          <span>{t.disclaimer}</span>
          {status?.configured && status.remaining !== null && status.limit !== null && (
            <span className="font-medium">
              {fmt(t.remaining, { n: formatNumber(status.remaining, locale), limit: formatNumber(status.limit, locale) })}
            </span>
          )}
        </div>
        {notice && <p className="mt-1 px-2 text-xs text-danger">{notice}</p>}
      </div>
    </div>
  );
}

function Bubble({
  role,
  label,
  error,
  children,
}: {
  role: "user" | "assistant";
  label: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        role="group"
        aria-label={label}
        dir="auto"
        className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-[15px] leading-7 shadow-soft ${
          isUser
            ? "rounded-ee-md bg-blush-soft text-ink"
            : error
              ? "rounded-es-md bg-danger-soft text-danger"
              : "rounded-es-md bg-surface text-ink"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function SystemNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-card bg-cream-deep px-4 py-3 text-sm leading-6 text-ink-soft">
      <SparkleIcon width={18} height={18} className="mt-0.5 shrink-0 text-blush" />
      <p>{children}</p>
    </div>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 py-2" role="status" aria-label={label}>
      {[0, 150, 300].map((d) => (
        <span key={d} className="size-2 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
