const CACHE_NOMBRE = 'radio-avisos-v8'; // CAMBIA NÚMERO AL ACTUALIZAR
const ICONO = "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png";
const RUTA_RADIO = "https://radiosunidas.github.io/SANCAMILO/";

// 🕒 AVISOS CADA HORA: 8 AM A 7 PM | LUNES A VIERNES
const AVISOS = [
  {h:8,  t:'☀️ ¡Buenos días!', m:'Entra a Radios Unidas y empieza tu día con la mejor música 📻'},
  {h:9,  t:'🎵 Sigue la mejor selección', m:'Tu radio te acompaña siempre, entra ya'},
  {h:10, t:'📻 Sintonízanos ahora', m:'Música y alegría sin parar'},
  {h:11, t:'✨ Radios Unidas en vivo', m:'Tu voz peruana para el mundo'},
  {h:12, t:'🌤️ Mediodía con buena música', m:'Disfruta lo mejor de nuestra programación'},
  {h:13, t:'🎶 Tu radio te espera', m:'Entra y escucha en cualquier momento'},
  {h:14, t:'📻 Sigue sintonizado', m:'Todo listo para ti en Radios Unidas'},
  {h:15, t:'☀️ Tarde con nosotros', m:'Música variada y buenos momentos'},
  {h:16, t:'🎵 No te pierdas nada', m:'Sigue conectado a tu radio'},
  {h:17, t:'🎤 AHORA EN VIVO: Juan Carlos', m:'Programa Nada de lo Mismo | 5 a 7 PM ¡Acompáñanos!'},
  {h:18, t:'🌆 Cae la tarde con nosotros', m:'Radios Unidas: tu música, tu radio'},
  {h:19, t:'🌙 Cierra tu día aquí', m:'Entra y disfruta hasta el final 📻'}
];
const DIAS_LABORABLES = [1,2,3,4,5];

// 🎯 AL TOCAR AVISO: ABRE LA RADIO EN SANCAMILO
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(RUTA_RADIO));
});

// ⏰ FUNCIÓN PRINCIPAL CORREGIDA (sin localStorage que no funciona aquí)
function revisar(){
  const ahora = new Date();
  const dia = ahora.getDay();
  const hora = ahora.getHours();

  // Solo Lunes a Viernes
  if(!DIAS_LABORABLES.includes(dia)) return;

  const aviso = AVISOS.find(a => a.h === hora);
  if(aviso){
    self.registration.showNotification(aviso.t, {
      body: aviso.m,
      icon: ICONO,
      badge: ICONO,
      tag: `aviso_hora_${hora}_${ahora.toDateString()}`, // evita repetir automáticamente
      silent: false,          // 🔊 CON SONIDO FUERTE
      requireInteraction: true, // 📲 SE QUEDA HASTA QUE LO CIERRES
      priority: 'high'         // ⚡ MÁXIMA PRIORIDAD
    });
  }
}

// 🔁 REVISIONES
self.addEventListener('periodicsync', e => {
  if(e.tag === 'revisar-programas') revisar();
});
self.addEventListener('message', e => {
  if(e.data === 'revisarAhora') revisar();
});

// 💾 INSTALACIÓN
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NOMBRE).then(c => c.addAll(['./','./index.html','./manifest.json','./locutores.html',ICONO]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', async e => {
  if('periodicSync' in self.registration){
    try{
      await self.registration.periodicSync.register('revisar-programas', { minInterval: 3600000 });
      console.log("✅ SISTEMA DE AVISOS CARGADO EN SANCAMILO");
    }catch(err){
      console.log("⚠️ Revisión automática limitada:", err);
    }
  }
  e.waitUntil(clients.claim());
});

// 📥 CARGA
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});