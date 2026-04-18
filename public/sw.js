const CACHE = "matreo-v1";
const ASSETS = ["/", "/index.html"];

self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS))
));

self.addEventListener("fetch", e => e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
));

self.addEventListener("push", e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "Matreo 🌸", {
      body: data.body || "You have things to do today. Let's make it lighter.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "matreo-daily",
      renotify: true,
      data: { url: "/" }
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || "/"));
});
