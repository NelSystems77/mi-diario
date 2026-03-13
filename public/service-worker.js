const CACHE_NAME = 'mi-diario-v1';
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
        // Solo cachear archivos estáticos básicos
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
        });
      })
  );
  self.skipWaiting();
});

// Fetch event - NUNCA cachear Firebase o APIs
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Si es Firebase o API, SIEMPRE ir a la red
  if (!shouldCache(url)) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Para otros recursos, intentar cache primero
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          (response) => {
            // No cachear si no es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        ).catch(err => {
          console.log('Fetch error:', err);
          // Si falla, intentar devolver desde cache
          return caches.match(event.request);
        });
      })
  );
});

// Activate event - clean old caches
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
