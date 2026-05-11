const CACHE_NAME = "clameo-v1.2";

const urlsToCache = [
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache Google Analytics / Google Tag scripts
  if (
    url.hostname.includes("googletagmanager.com") ||
    url.hostname.includes("google-analytics.com")
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Always fetch navigation pages from network first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  // Network-first for JS/CSS/assets, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      })
      .catch(() => caches.match(request))
  );
});