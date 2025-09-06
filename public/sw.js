self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/public/favicon/android-chrome-192x192.png',
      badge: '/public/favicon/android-chrome-192x192.png',
      vibrate: [200, 100, 200],
      tag: 'scheduled-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('https://plaquitascr.com/notificaciones')
  );
});