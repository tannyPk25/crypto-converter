const CACHE = "crypto-v1";
const ASSETS = ["/", "/index.html", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // API calls merg mereu online (prețuri live)
  if (e.request.url.includes("api.coingecko.com") ||
      e.request.url.includes("cdn.jsdelivr.net")) {
    e.respondWith(fetch(e.request));
    return;
  }
  // restul: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
