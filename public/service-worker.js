const CACHE_NAME = 'mi-diario-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo512.png',
  '/manifest.json'
];

// URLs que NUNCA deben cachearse
const NEVER_CACHE = [
  'firebaseio.com',
  'googleapis.com',
  'gstatic.com', // Corregido: añadida coma
  'firebaseapp.com',
  'google.com/firestore',
  'identitytoolkit.googleapis.com',
  '/api/' // Backend API
];

// Verificar si la URL debe ser cacheada
function shouldCache(url) {
  return !NEVER_CACHE.some(pattern => url.includes(pattern));
}

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
        });
      })
  );
  self.skipWaiting();
});

// Fetch event - Estrategia optimizada para PWA y API
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // 1. Si es Firebase, Google Fonts o API, SIEMPRE ir directamente a la red
  if (!shouldCache(url)) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // 2. Para otros recursos, intentar cache primero (Stale-while-revalidate modificado)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((fetchResponse) => {
          // Si la URL es de las que no queremos cachear, devolvemos tal cual
          if (!shouldCache(url)) {
            return fetchResponse;
          }

          // No cachear si la respuesta no es exitosa (status 200)
          if (!fetchResponse || fetchResponse.status !== 200) {
            return fetchResponse;
          }

          // IMPORTANTE: Solo cachear recursos propios (type: basic)
          // Esto evita errores de "opaque responses" con fuentes o scripts externos
          if (fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return fetchResponse;
        }).catch(err => {
          console.log('Fetch error:', err);
          // Si falla la red (offline), intentar devolver desde cache como último recurso
          return caches.match(event.request);
        });
      })
  );
});

// Activate event - Limpieza de versiones antiguas de cache
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
