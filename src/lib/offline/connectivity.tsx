"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { flushOfflineQueue } from "./progress-queue";

/**
 * Whether the app's server is reachable. navigator.onLine alone isn't enough:
 * during an international-internet cutoff the phone is still "online" to the
 * domestic network, so a real request to our own origin decides.
 */
const ConnectivityContext = createContext<{ offline: boolean; markOffline: () => void }>({ offline: false, markOffline: () => {} });

const PROBE_URL = "/manifest.webmanifest";
const PROBE_TIMEOUT_MS = 5000;
const RECHECK_MS = 30_000;

async function probe(): Promise<boolean> {
  if (!navigator.onLine) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(`${PROBE_URL}?probe=${Date.now()}`, { method: "HEAD", cache: "no-store", signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [offline, setOffline] = useState(false);

  const check = useCallback(async () => {
    const reachable = await probe();
    setOffline(!reachable);
    if (reachable) await flushOfflineQueue();
  }, []);

  useEffect(() => {
    // First check right after mount (also flushes progress queued on an earlier visit).
    const first = setTimeout(check, 0);
    const onVisible = () => document.visibilityState === "visible" && check();
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(first);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check]);

  // While offline, keep checking so the banner clears and queued progress syncs on its own.
  useEffect(() => {
    if (!offline) return;
    const id = setInterval(check, RECHECK_MS);
    return () => clearInterval(id);
  }, [offline, check]);

  const markOffline = useCallback(() => setOffline(true), []);
  return <ConnectivityContext.Provider value={{ offline, markOffline }}>{children}</ConnectivityContext.Provider>;
}

export function useConnectivity() {
  return useContext(ConnectivityContext);
}
