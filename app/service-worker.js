// This file is intentionally without code.
// It's present so that service worker registration will work when serving from the 'app' directory.
// The version of service-worker.js that's present in the 'dist' directory is automatically
// generated by the 'generate-service-worker' gulp task, and contains code to precache resources.
var CACHE_NAME  = "cinnamoroll-world-cache-v1";
var urlsToCache = [
  "/app/styles/main.css",
  "/app/scripts/main.js",
  "/app/index.html",
  "https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css",
  "/app/images/cinnamon1.jpg",
  "/app/images/cinnamon.png",
  "/app/images/cappuccino.png",
  "/app/images/mocha.jpg"
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(
        function(cache){
          return cache.addAll(urlsToCache);
        })
  );
});
self.addEventListener('fetch', function(event) {
  if (isImage(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
  else {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  }
});
self.addEventListener('push', function(event) {
  self.addEventListener('push', function(event) {
    var title = 'メッセージが届きました';
    var body  = 'シナモンです！こんばんわ！';
    var icon  = '/app/images/touch/chrome-touch-icon-192x192.png';
    var tag   = 'simple-push-demo-notification-tag';

    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag
      })
    );
  });
});
function isImage (url) {
  return Boolean(url.match(/(\.png)|(\.jpg)$/));
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
        type: "window"
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
