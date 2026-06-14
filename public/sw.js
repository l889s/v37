// HSK بالعربي — Service Worker
// النسخة: 1.0.0

const CACHE_NAME = "hsk-ar-v1";

// الملفات الأساسية التي تُخزَّن عند التثبيت
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ===== التثبيت =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ===== التفعيل =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ===== اعتراض الطلبات =====
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير HTTP
  if (!request.url.startsWith("http")) return;

  // تجاهل طلبات Supabase والـ API — دائماً من الشبكة
  if (
    url.hostname.includes("supabase") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/")
  ) {
    return;
  }

  // استراتيجية: Network First (الشبكة أولاً، الكاش كاحتياط)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // خزّن نسخة في الكاش إذا كانت الاستجابة صحيحة
        if (response && response.status === 200 && response.type === "basic") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // إذا فشلت الشبكة، ابحث في الكاش
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // إذا لم يوجد في الكاش، أعد صفحة offline
          if (request.destination === "document") {
            return caches.match("/offline");
          }
        });
      })
  );
});
