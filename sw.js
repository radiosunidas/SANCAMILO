// 📡 SERVICE WORKER: EL QUE SE QUEDA VIVO Y DA AVISOS COMO ALARMA DEL CELULAR
const CACHE_NOMBRE = 'radio-v3'; // cambia número si actualizas luego

// 🎯 AL TOCAR LA NOTIFICACIÓN: ABRE DIRECTO TU RADIO
self.addEventListener('notificationclick', evento => {
  evento.notification.close(); // cierra aviso al tocar

  evento.waitUntil(
    clients.matchAll({type: 'window'}).then(listaVentanas => {
      for (const ventana of listaVentanas) {
        if (ventana.url.includes('radiosunidas.github.io') && 'focus' in ventana) {
          return ventana.focus(); // si está abierta: trae al frente
        }
      }
      // si CERRADA: ABRE AUTOMÁTICAMENTE
      if (clients.openWindow) return clients.openWindow('https://radiosunidas.github.io/eco/');
    })
  );
});

// ⏰ FUNCIÓN DE REVISAR HORARIOS Y LANZAR AVISO FUERTE
async function revisarProgramasYNotificar(){
  const ahora = new Date();
  const diaSemana = ahora.getDay(); // 1=Lunes ... 5=Viernes | fin de semana NO avisa
  const hora = ahora.getHours();

  // 🎤 PROGRAMA JOSÉ LUIS: 4:00 AM - AVISO FUERTE
  if(diaSemana >=1 && diaSemana <=5 && hora ===4){
    self.registration.showNotification("🎤 ¡AHORA EN VIVO! José Luis Lima", {
      body: "📻 Programa: LOS GRANDES DEL PUEBLO 🎶 Hasta las 8:00 AM 🕗 ¡Abre ya y acompáñanos!",
      icon: "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png",
      badge: "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png",
      tag: "programa-jose", // agrupa para no llenar pantalla
      renotify: false,
      silent: false, // 🔊 CON SONIDO/ALERTA FUERTE
      requireInteraction: true, // 📌 SE QUEDA EN PANTALLA HASTA QUITARLO IGUAL ALARMA
      priority: "high" // ⚡ MÁXIMA IMPORTANCIA, NO SE PIERDE
    });
  }

  // 🎤 PROGRAMA JUAN CARLOS: 5 DE LA TARDE
  if(diaSemana >=1 && diaSemana <=5 && hora ===17){
    self.registration.showNotification("🎤 ¡AHORA EN VIVO! Juan Carlos Condori", {
      body: "✨ Programa: NADA DE LO MISMO 🎧 Desde 5 hasta 7 de la tarde 🕖 ¡Escúchanos!",
      icon: "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png",
      badge: "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png",
      tag: "programa-juan",
      renotify: false,
      silent: false, // 🔊 SUENA CLARO
      requireInteraction: true, // 📲 QUEDA VISIBLE EN BARRA DE NOTIFICACIONES
      priority: "high"
    });
  }
}

// ⏱️ SE REVISA CADA 60 SEGUNDOS DESDE AQUÍ DENTRO, NO DEPENDE DE VENTANA ABIERTA
setInterval(revisarProgramasYNotificar, 60000);

// 💾 GUARDAR ARCHIVOS PARA FUNCIONAMIENTO RÁPIDO Y SIN INTERNET BÁSICO
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NOMBRE).then(cache => cache.addAll([
      './', './index.html', './manifest.json', './locutores.html',
      'https://radiosunidas.github.io/SANCAMILO/imagen/logo.png'
    ]))
  );
  self.skipWaiting(); // activar rápido sin esperar
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(respuesta => respuesta || fetch(e.request))
  );
});
