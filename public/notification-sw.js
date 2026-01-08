self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'https://res.cloudinary.com/ensamble/image/upload/v1692285552/gw2pih5qe3vritw5xv13.png',
      badge: 'https://res.cloudinary.com/ensamble/image/upload/v1692285552/gw2pih5qe3vritw5xv13.png',
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