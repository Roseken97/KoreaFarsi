/**
 * Talks to the service worker (public/sw.js) about lessons saved for offline study.
 * Every call resolves to a result instead of throwing: no worker (dev, old browser,
 * private mode) simply means "not available".
 */

type SwReply = { ok: boolean; error?: string; bytes?: number; ids?: string[] };

async function ask(message: Record<string, unknown>, timeoutMs = 10 * 60 * 1000): Promise<SwReply> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return { ok: false, error: "unsupported" };
  const registration = await navigator.serviceWorker.getRegistration();
  const worker = registration?.active;
  if (!worker) return { ok: false, error: "unsupported" };
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve({ ok: false, error: "timeout" }), timeoutMs);
    channel.port1.onmessage = (event: MessageEvent<SwReply>) => {
      clearTimeout(timer);
      resolve(event.data);
    };
    worker.postMessage(message, [channel.port2]);
  });
}

export function isOfflineSaveSupported() {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator && typeof caches !== "undefined";
}

/** Saves the given app pages (and the video/files they reference) for offline use. */
export async function saveForOffline(id: string, pages: string[]) {
  // Ask the browser not to evict saved lessons under storage pressure (best-effort).
  await navigator.storage?.persist?.().catch(() => false);
  return ask({ type: "save", id, pages });
}

export function removeFromOffline(id: string) {
  return ask({ type: "remove", id });
}

export async function listOfflineSaved(): Promise<string[]> {
  const reply = await ask({ type: "list" }, 10_000);
  return reply.ok ? (reply.ids ?? []) : [];
}

/** Drops cached pages and saved lessons; called on sign-out so the next person on the device can't see them. */
export function clearOfflineData() {
  return ask({ type: "clear" }, 10_000);
}
