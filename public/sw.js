self.addEventListener('push', function (event) {
  try {
    let data = {};

    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        console.error('Error parsing push data:', e);
        data = {
          title: 'Nueva notificación',
          body: event.data.text() || 'Tienes una nueva notificación',
        };
      }
    }

    console.log(data, 'datadatadatadatadata');

    const options = {
      body: data.body || 'Tienes3 una nueva notificación',
      icon:
        data.icon || 'https://plaquitascr.com/assets/images/plaquitascr.png',
      badge:
        data.badge || 'https://plaquitascr.com/assets/images/plaquitascr.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'notification',
      data: data.data || {},
      timestamp: Date.now(),
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(
      self.registration.showNotification(
        `${data.title || 'Notificación'}`,
        options
      )
    );
  } catch (error) {
    console.error('Error en push event:', error);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  console.log(event, 'eventeventevent');
  const urlToOpen =
    event.notification.data?.url || 'https://plaquitascr.com/es/notifications';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // Buscar si ya hay una ventana abierta
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('pushsubscriptionchange', function (event) {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then(function (subscription) {
        console.log('Subscription renovada:', subscription);
      })
  );
});

// Asegurar que el service worker se active inmediatamente
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});
