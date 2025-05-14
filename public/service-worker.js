// CityPulse Service Worker
const CACHE_NAME = 'citypulse-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/images/placeholder.svg',
  '/images/placeholder-deal.svg',
  '/images/placeholder-event.svg'
];

// Install event - precache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.includes('/api/') || 
         url.includes('supabase.co') || 
         url.includes('googleapis.com');
};

// Helper function to determine if a request is for an image
const isImageRequest = (url) => {
  return url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return url.match(/\.(js|css|html|json|ico)$/i);
};

// Fetch event - network first for API, cache first for static assets
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && !isApiRequest(event.request.url)) {
    return;
  }

  // For API requests, use network first strategy
  if (isApiRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .catch(error => {
          console.log('Fetch failed; returning offline page instead.', error);
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For image requests, use cache first with network fallback
  if (isImageRequest(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if found
          if (response) {
            return response;
          }

          // Otherwise try to fetch from network
          return fetch(event.request)
            .then(networkResponse => {
              // Cache the network response for future
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return networkResponse;
            })
            .catch(error => {
              // If both cache and network fail, return a placeholder image
              console.log('Failed to fetch image:', error);
              if (event.request.url.includes('deal')) {
                return caches.match('/images/placeholder-deal.svg');
              } else if (event.request.url.includes('event')) {
                return caches.match('/images/placeholder-event.svg');
              } else {
                return caches.match('/images/placeholder.svg');
              }
            });
        })
    );
    return;
  }

  // For static assets, use cache first with network fallback
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if found
          if (response) {
            return response;
          }

          // Otherwise try to fetch from network
          return fetch(event.request)
            .then(networkResponse => {
              // Cache the network response for future
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return networkResponse;
            });
        })
    );
    return;
  }

  // For all other requests, use network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the network response for future
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, return the offline page
            return caches.match('/index.html');
          });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
