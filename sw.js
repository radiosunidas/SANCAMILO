const CACHE = 'radio-unidas-v10';
const ICONO = "https://radiosunidas.github.io/SANCAMILO/imagen/logo.png";
const RUTA = "https://radiosunidas.github.io/SANCAMILO/";

// 🕒 HORARIOS EXACTOS QUE PEDISTE
const RECORDATORIOS = [
  { hora: 4, mensaje: "🎤 AHORA: José Luis Lima | Los Grandes del Pueblo 📻" },
  { hora: 17, mensaje: "🎤 AHORA: Juan Carlos | Nada de lo Mismo 📻" },
  { hora: 8, mensaje: "☀️ Ya amaneció, escucha lo mejor 📻" },
  { hora: 9, mensaje: "🎵 Música variada para empezar el día" },
  { hora: 10, mensaje: "📻 Seguimos al aire contigo" },
  { hora: 11, mensaje: "✨ Tu radio peruana al mundo" },
  { hora: 12, mensaje: "🌤️ Mediodía con la mejor selección" },
  { hora: 13, mensaje: "🎶 No te desconectes" },
  { hora: 14, mensaje: "📻 Siempre cerca de ti" },
  { hora: 15, mensaje: "☀️ Tarde llena de buena música" },
  { hora: 16, mensaje: "⏳ Preparate para la tarde" },
  { hora: 18, mensaje: "🌆 Sigue con nosotros hasta el final" },
  { hora: 19, mensaje: "🌙 Cierra tu día con Radios Unidas" }
];
const DIAS = [1,2,3,4,5]; // Lunes a Viernes

// 📲 AL TOCAR LA NOTIFICACIÓN ABRE DIRECTO LA RADIO
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(RUTA));
});

// ⏰ FUNCIÓN DE REVISIÓN
function chequearAvisos(){
  const ahora = new Date();
  const hora = ahora.getHours();
  const dia = ahora.getDay();

  if(!DIAS.includes(dia)) return;

  const aviso = RECORDATORIOS.find(a => a.hora === hora);
  if(aviso){
    self.registration.showNotification(aviso.mensaje, {
      icon: ICONO,
      silent: false, // 🔊 CON SONIDO OBLIGATORIO
      requireInteraction: true,
      priority: 'high',
      tag: `aviso_${ahora.getDate()}_${hora}`
    });
  }
}

// 🔁 CARGA Y ACTIVACIÓN SEGURA
self.addEventListener('periodicsync', e => {
  if(e.tag === 'revisar-horarios') chequearAvisos();
});
self.addEventListener('message', e => {
  if(e.data === 'forzarRevisar') chequearAvisos();
});
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.json', ICONO])));
  self.skipWaiting();
});
self.addEventListener('activate', async e => {
  if('periodicSync' in self.registration){
    try{
      await self.registration.periodicSync.register('revisar-horarios', { minInterval: 3600000 });
      console.log("✅ SISTEMA DE AVISOS ACTIVADO");
    }catch(err){console.log("⚠️:", err);}
  }
  e.waitUntil(clients.claim());
});
