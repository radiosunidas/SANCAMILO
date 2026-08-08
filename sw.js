const CACHE_NOMBRE = 'radio-avisos-horarios-v7'; // CAMBIA NÚMERO AL ACTUALIZAR

// 📅 HORARIOS: 8:00 AM hasta 7:00 PM, cada hora, LUNES A VIERNES
const PROGRAMAS = [
  { hora:  8, titulo: "☀️ ¡Buenos días!", mensaje: "Entra a Radios Unidas y empieza tu día con la mejor música 📻" },
  { hora:  9, titulo: "🎵 Sigue la mejor selección", mensaje: "Radios Unidas: tu compañía favorita en cualquier momento" },
  { hora: 10, titulo: "📻 Sintonízanos ahora", mensaje: "Música y alegría sin parar, entra y escucha" },
  { hora: 11, titulo: "✨ Radios Unidas en vivo", mensaje: "Tu radio peruana llegando al mundo ¡Escúchanos!" },
  { hora: 12, titulo: "🌤️ Mediodía con buena música", mensaje: "Relájate y disfruta lo mejor de Radios Unidas" },
  { hora: 13, titulo: "🎶 Tu radio te acompaña", mensaje: "Entra a Radios Unidas, te estamos esperando" },
  { hora: 14, titulo: "📻 Sigue sintonizado", mensaje: "La mejor programación sigue al aire, entra ya" },
  { hora: 15, titulo: "☀️ Tarde con Radios Unidas", mensaje: "Música variada y momentos especiales para ti" },
  { hora: 16, titulo: "🎵 No te pierdas nada", mensaje: "Entra a Radios Unidas y disfruta nuestra programación" },
  { hora: 17, titulo: "🎤 AHORA EN VIVO: Juan Carlos", mensaje: "Programa: Nada de lo Mismo | 5:00 PM a 7:00 PM ¡Acompáñanos!" },
  { hora: 18, titulo: "🌆 Cae la tarde con nosotros", mensaje: "Radios Unidas: tu música, tu voz, tu radio 📻" },
  { hora: 19, titulo: "🌙 Cierra tu día con nosotros", mensaje: "Entra a Radios Unidas y disfruta hasta el final" }
];

const ICONO = "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png";
const DIAS_LABORABLES = [1,2,3,4,5]; // Lunes a Viernes

// 🎯 AL TOCAR EL AVISO: ABRE TU RADIO DIRECTO
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(lista => {
      for(const ventana of lista){
        if(ventana.url.includes('radiosunidas.github.io') && ventana.focus) return ventana.focus();
      }
      return clients.openWindow('https://radiosunidas.github.io/SANCAMILO/');
    })
  );
});

// ⏰ REVISAR HORA Y LANZAR AVISO SI TOCA
function revisarHorarios(){
  const ahora = new Date();
  const dia = ahora.getDay();
  const hora = ahora.getHours();
  const clave = `aviso_${ahora.toDateString()}_${hora}`; // evita repetir en la misma hora

  if(!DIAS_LABORABLES.includes(dia)) return; // NO avisa sábados ni domingos

  const yaAvisado = self.localStorage ? self.localStorage.getItem(clave) : null;
  if(yaAvisado) return;

  const programa = PROGRAMAS.find(p => p.hora === hora);
  if(programa){
    self.registration.showNotification(programa.titulo, {
      body: programa.mensaje,
      icon: ICONO,
      badge: ICONO,
      tag: `aviso-hora-${hora}`,
      renotify: false,
      silent: false,          // 🔊 CON SONIDO
      requireInteraction: true, // 📲 SE QUEDA EN PANTALLA
      priority: 'high'         // ⚡ MÁXIMA PRIORIDAD
    });
    if(self.localStorage) self.localStorage.setItem(clave, 'enviado');
  }
}

// 🔁 REVISIÓN AUTOMÁTICA
self.addEventListener('periodicsync', e => {
  if(e.tag === 'revisar-programas') e.waitUntil(revisarHorarios());
});

self.addEventListener('message', e => {
  if(e.data === 'revisarAhora') revisarHorarios();
});

// 💾 INSTALAR Y ACTIVAR
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NOMBRE).then(cache => cache.addAll(['./','./index.html','./manifest.json',ICONO]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', async e => {
  if ('periodicSync' in self.registration) {
    try {
      await self.registration.periodicSync.register('revisar-programas', { minInterval: 60 * 60 * 1000 });
      console.log("✅ AVISOS POR HORA ACTIVADOS");
    } catch(err) { console.log("⚠️ Revisión limitada:", err); }
  }
  e.waitUntil(clients.claim());
});

// 📥 CARGA ARCHIVOS RÁPIDO
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});