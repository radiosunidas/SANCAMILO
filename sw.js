// Service Worker mínimo para activar PWA - OBLIGATORIO
const CACHE = 'radio-unidas-v1';
self.addEventListener('install', e => {
  console.log('✅ SW Instalado');
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  console.log('✅ SW Activo');
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
