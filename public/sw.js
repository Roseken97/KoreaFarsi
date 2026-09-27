// KoreaFarsi service worker — intentionally minimal (Phase 1).
// Goal: installability + a friendly offline screen. It does NOT cache pages or
// API responses, so users never see stale prices, carts or chat answers.
// Bump VERSION to force clients onto a new worker.
const VERSION = "kf-v1";
const OFFLINE_URL = "/offline";
const PRECACHE = [OFFLINE_URL, "/brand/logo-512.png", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only page navigations get the offline fallback; everything else goes straight to the network.
  if (request.mode !== "navigate") return;
  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
});
