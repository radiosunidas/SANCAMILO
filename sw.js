// Service Worker - Radios Unidas | Notificaciones y PWA
const CACHE_NOMBRE = 'radio-v2'; // actualiza v2 si cambias archivos luego

// 📤 AL TOCAR LA NOTIFICACIÓN: ABRE O TRAE LA RADIO
self.addEventListener('notificationclick', evento => {
  evento.notification.close();

  evento.waitUntil(
    clients.matchAll({type: 'window'}).then( listaVentanas => {
      for (const ventana of listaVentanas) {
        if (ventana.url.includes('radiosunidas.github.io') && 'focus' in ventana) {
          return ventana.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('https://radiosunidas.github.io/eco/');
    })
  );
});

// GUARDAR ARCHIVOS PARA FUNCIONAMIENTO COMO APP
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NOMBRE).then(cache => cache.addAll([
      './', './index.html', './manifest.json', './locutores.html',
      'https://radiosunidas.github.io/SANCAMILO/imagen/logo.png'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(respuesta => respuesta || fetch(e.request))
  );
});