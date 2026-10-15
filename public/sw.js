// KoreaFarsi service worker — Phase 2: offline-first learning.
//
// Goal: a learner who has opened the app before can keep studying when the
// connection drops, including when only Iran's domestic network works.
//
// What is cached, and how:
// - /_next/static/* (hashed JS, CSS, fonts): cache-first, never changes.
// - Learning pages (home, courses, lessons, dictionary, library, planner,
//   korea-life): network-first, falling back to the last copy seen on this device.
// - Lessons the learner explicitly saves ("Save for offline"): the pages plus
//   their video and files, kept until removed or until sign-out.
// - Images: stale-while-revalidate, size-capped.
//
// Never cached: shop, cart, checkout, account, admin, auth, API routes and chat,
// so nobody sees stale prices, carts or chat answers.
//
// Bump VERSION to force clients onto a new worker. Content caches keep their own
// names so a worker update doesn't throw away a learner's saved lessons.
const VERSION = "kf-v2";
const SHELL_CACHE = `kf-shell-${VERSION}`;
const STATIC_CACHE = "kf-static";
const PAGES_CACHE = "kf-pages";
const SAVED_CACHE = "kf-saved";
const IMAGES_CACHE = "kf-images";
const KEEP = [SHELL_CACHE, STATIC_CACHE, PAGES_CACHE, SAVED_CACHE, IMAGES_CACHE];

const OFFLINE_URL = "/offline";
const PRECACHE = [OFFLINE_URL, "/brand/logo-512.png", "/icons/icon-192.png"];

// A blocked international route often hangs instead of failing fast, so a page
// load waits this long before showing the cached copy.
const NAV_TIMEOUT_MS = 5000;
const LIMITS = { [STATIC_CACHE]: 600, [PAGES_CACHE]: 80, [IMAGES_CACHE]: 200 };

/** App routes worth keeping for offline study. Anything else is never cached. */
const LEARNING_ROUTES = /^\/(launch|home|courses|dictionary|library|planner|korea-life|notifications)(\/|$)/;
/** Supabase Storage objects: lesson videos, files and covers. */
const STORAGE_PATH = /^\/storage\/v1\/object\/(sign|public|authenticated)\//;
const SAVED_INDEX_PREFIX = "/__kf/saved/";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") return event.respondWith(handleNavigation(request, url));
    // RSC payloads for soft navigations: let them fail, so Next.js falls back to a
    // full navigation that the branch above can answer from cache.
    if (request.headers.get("RSC")) return;
    if (url.pathname.startsWith("/_next/static/")) return event.respondWith(cacheFirst(request, STATIC_CACHE));
    if (isImage(url)) return event.respondWith(staleWhileRevalidate(request, IMAGES_CACHE));
    return;
  }

  if (isStorageUrl(url)) event.respondWith(handleStorage(request, url));
});

// ---------------------------------------------------------------- navigations

async function handleNavigation(request, url) {
  const cacheable = LEARNING_ROUTES.test(url.pathname);
  const network = fetch(request).then(async (response) => {
    if (cacheable && isCacheablePage(response)) {
      const copy = response.clone();
      const saved = await caches.open(SAVED_CACHE);
      // A saved lesson gets the fresh copy too (with a newly signed video URL).
      if (await saved.match(request.url)) await saved.put(request.url, copy.clone());
      await putLimited(PAGES_CACHE, request.url, copy);
    }
    return response;
  });

  if (!cacheable) return network.catch(() => offlinePage());
  network.catch(() => {}); // a late failure after the cached copy was shown is expected

  const fallback = () => cachedPage(url);
  try {
    const first = await Promise.race([network, timeout(NAV_TIMEOUT_MS)]);
    if (first) return first;
    // Slow network: show the cached copy if there is one, otherwise keep waiting.
    const cached = await fallback();
    if (cached) return cached;
    return await network;
  } catch {
    return (await fallback()) || offlinePage();
  }
}

async function cachedPage(url) {
  const hit = (await caches.match(url.href, { cacheName: SAVED_CACHE })) || (await caches.match(url.href, { cacheName: PAGES_CACHE }));
  if (hit) return hit;
  // The installed app opens at /launch; offline, go straight to the last home screen.
  if (url.pathname === "/launch") return caches.match(new URL("/home", url).href, { cacheName: PAGES_CACHE });
  return null;
}

function isCacheablePage(response) {
  return response.ok && response.type === "basic" && !response.redirected && (response.headers.get("Content-Type") || "").includes("text/html");
}

async function offlinePage() {
  return (await caches.match(OFFLINE_URL)) || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
}

// ------------------------------------------------------------ static & images

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request, { cacheName });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) putLimited(cacheName, request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request, { cacheName });
  const network = fetch(request)
    .then((response) => {
      if (response.ok) putLimited(cacheName, request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  return cached || network;
}

function isImage(url) {
  return url.pathname.startsWith("/_next/image") || /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(url.pathname);
}

// -------------------------------------------------------------- saved media

function isStorageUrl(url) {
  return url.hostname.endsWith(".supabase.co") && STORAGE_PATH.test(url.pathname);
}

/** Signed URLs carry a token that changes on every page load; the object path doesn't. */
function storageKey(url) {
  return `${url.origin}${url.pathname.replace(STORAGE_PATH, "/storage/v1/object/any/")}`;
}

async function handleStorage(request, url) {
  const cached = await caches.match(storageKey(url), { cacheName: SAVED_CACHE });
  if (!cached) return fetch(request);
  return rangeResponse(request, cached);
}

/** <video> asks for byte ranges; answer them from the full cached file. */
async function rangeResponse(request, cached) {
  const range = request.headers.get("Range");
  if (!range) return cached;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) return cached;
  const blob = await cached.blob();
  const size = blob.size;
  let start;
  let end;
  if (match[1] === "") {
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "application/octet-stream",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

// ------------------------------------------------- messages from the page

self.addEventListener("message", (event) => {
  const port = event.ports[0];
  const data = event.data || {};
  const reply = (body) => port && port.postMessage(body);
  const work = (async () => {
    try {
      if (data.type === "save") reply({ ok: true, ...(await saveItem(data.id, data.pages)) });
      else if (data.type === "remove") reply({ ok: await removeItem(data.id) });
      else if (data.type === "list") reply({ ok: true, ids: await listSaved() });
      else if (data.type === "clear") reply({ ok: await clearUserData() });
    } catch (err) {
      reply({ ok: false, error: String(err && err.message ? err.message : err) });
    }
  })();
  if (event.waitUntil) event.waitUntil(work);
});

/**
 * Saves pages for offline use, plus the JS/CSS they need and any Supabase
 * Storage file they reference (lesson video, materials).
 */
async function saveItem(id, pages) {
  if (typeof id !== "string" || !Array.isArray(pages)) throw new Error("bad request");
  const saved = await caches.open(SAVED_CACHE);
  const written = [];
  try {
    return await saveInto(saved, written, id, pages);
  } catch (err) {
    // Don't leave half a lesson behind; a partial save would look complete offline.
    if (!(await saved.match(indexKey(id)))) await Promise.all(written.map((k) => saved.delete(k)));
    throw err;
  }
}

async function saveInto(saved, written, id, pages) {
  const staticCache = await caches.open(STATIC_CACHE);
  const media = new Map(); // storage key -> a URL to download it from
  const assets = new Set();
  const pageUrls = [];

  for (const path of pages) {
    const url = new URL(path, self.location.origin);
    if (url.origin !== self.location.origin || !LEARNING_ROUTES.test(url.pathname)) continue;
    const response = await fetch(url.href, { credentials: "same-origin", cache: "no-store" });
    if (!isCacheablePage(response)) throw new Error(`page ${url.pathname} returned ${response.status}`);
    const html = await response.clone().text();
    await saved.put(url.href, response);
    written.push(url.href);
    pageUrls.push(url.href);
    for (const m of html.matchAll(/\/_next\/static\/[^"'\s)\\<>]+/g)) assets.add(m[0]);
    for (const m of html.matchAll(/https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/(?:sign|public)\/[^"'\s<>\\]+/g)) {
      const src = m[0].replace(/&amp;/g, "&");
      media.set(storageKey(new URL(src)), src);
    }
  }

  await Promise.all(
    [...assets].map(async (path) => {
      if (await staticCache.match(path)) return;
      const response = await fetch(path).catch(() => null);
      if (response && response.ok) await staticCache.put(path, response);
    }),
  );

  const mediaKeys = [];
  let bytes = 0;
  for (const [key, src] of media) {
    const response = await fetch(src, { mode: "cors", credentials: "omit" });
    if (!response.ok) throw new Error(`file returned ${response.status}`);
    const blob = await response.blob();
    bytes += blob.size;
    written.push(key);
    await saved.put(key, new Response(blob, { headers: { "Content-Type": response.headers.get("Content-Type") || blob.type || "application/octet-stream" } }));
    mediaKeys.push(key);
  }

  const record = { id, pages: pageUrls, media: mediaKeys, bytes, savedAt: Date.now() };
  await saved.put(indexKey(id), new Response(JSON.stringify(record), { headers: { "Content-Type": "application/json" } }));
  return { bytes };
}

async function removeItem(id) {
  const saved = await caches.open(SAVED_CACHE);
  const index = await saved.match(indexKey(id));
  if (!index) return true;
  const record = await index.json();
  const others = (await listRecords(saved)).filter((r) => r.id !== id);
  const stillUsed = new Set(others.flatMap((r) => [...r.pages, ...r.media]));
  await Promise.all([...record.pages, ...record.media].filter((k) => !stillUsed.has(k)).map((k) => saved.delete(k)));
  await saved.delete(indexKey(id));
  return true;
}

async function listSaved() {
  return (await listRecords(await caches.open(SAVED_CACHE))).map((r) => r.id);
}

async function listRecords(saved) {
  const keys = await saved.keys();
  const records = [];
  for (const req of keys) {
    if (!new URL(req.url).pathname.startsWith(SAVED_INDEX_PREFIX)) continue;
    const res = await saved.match(req);
    if (res) records.push(await res.json());
  }
  return records;
}

/** Sign-out: the next person on this device must not see this learner's pages. */
async function clearUserData() {
  await Promise.all([caches.delete(PAGES_CACHE), caches.delete(SAVED_CACHE)]);
  return true;
}

// ------------------------------------------------------------------ helpers

function indexKey(id) {
  return new URL(`${SAVED_INDEX_PREFIX}${encodeURIComponent(id)}`, self.location.origin).href;
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
}

/** Put, then drop the oldest entries past the cache's limit. */
async function putLimited(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
    const limit = LIMITS[cacheName];
    if (!limit) return;
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - limit; i++) await cache.delete(keys[i]);
  } catch {
    // Quota exceeded or a body that can't be stored: caching is best-effort.
  }
}
