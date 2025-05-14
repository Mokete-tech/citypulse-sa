// CityPulse Service Worker
const CACHE_NAME = 'citypulse-cache-v1';
const APP_VERSION = '1.0.0'; // Update this when making significant changes

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  '/images/placeholder.svg',
  '/images/placeholder-deal.svg',
  '/images/placeholder-event.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-192x192.png',
  '/icons/maskable-icon-512x512.png',
  '/icons/apple-touch-icon.png'
];

// Install event - precache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`[Service Worker] Opened cache for version ${APP_VERSION}`);
        return cache.addAll(PRECACHE_ASSETS)
          .catch(error => {
            console.error('[Service Worker] Precaching failed:', error);
            // Continue even if some assets fail to cache
            return Promise.resolve();
          });
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
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log(`[Service Worker] Activated version ${APP_VERSION}, claiming clients`);
      return self.clients.claim();
    })
    .then(() => {
      // After activation, notify all clients about the update
      return self.clients.matchAll().then(clients => {
        return Promise.all(clients.map(client => {
          return client.postMessage({
            type: 'SW_ACTIVATED',
            version: APP_VERSION
          });
        }));
      });
    })
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.includes('/api/') ||
         url.includes('supabase.co') ||
         url.includes('googleapis.com') ||
         url.includes('vercel.app/_next/data');
};

// Helper function to determine if a request is for an image
const isImageRequest = (url) => {
  return url.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|tiff|bmp)$/i);
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return url.match(/\.(js|css|html|json|ico|woff|woff2|ttf|eot)$/i);
};

// Helper function to determine if a request is for a font
const isFontRequest = (url) => {
  return url.match(/\.(woff|woff2|ttf|eot)$/i) ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com');
};

// Helper function to determine if a request is for a video
const isVideoRequest = (url) => {
  return url.match(/\.(mp4|webm|ogg|ogv)$/i);
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
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    // If the data isn't JSON, use a default
    data = {
      title: 'CityPulse Notification',
      body: 'You have a new notification from CityPulse',
      url: '/'
    };
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  // Handle action button clicks
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else if (event.action === 'close') {
    // Just close the notification (already done above)
    return;
  } else {
    // Default action (notification was clicked, not an action button)
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          // If so, focus it
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// Add a message event listener for communication with the app
self.addEventListener('message', event => {
  const data = event.data;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (data.type === 'CHECK_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: APP_VERSION
    });
  }
});
