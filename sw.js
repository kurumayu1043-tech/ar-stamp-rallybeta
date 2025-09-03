// Service Worker for AR Stamp Rally PWA
// Force update version - timestamp included for cache busting
const CACHE_VERSION = 'v11';
const CACHE_NAME = `ar-stamp-${CACHE_VERSION}-${Date.now()}`;
const BASE_URL = '/ar-stamp-rallybeta/';

// Development mode flag - set to true to disable caching
const DEV_MODE = false;

// Critical files to cache
const CRITICAL_CACHE = [
  BASE_URL,
  BASE_URL + 'index.html',
  BASE_URL + 'main.html',
  BASE_URL + 'css/style.css',
  BASE_URL + 'js/stamp-rally.js',
  BASE_URL + 'js/stamp-page.js',
  BASE_URL + 'nisyama1.png',
  BASE_URL + 'character_new.jpg',
  BASE_URL + 'logo.jpg',
  BASE_URL + 'manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing new version:', CACHE_NAME);
  
  if (DEV_MODE) {
    // In dev mode, skip caching and immediately activate
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching critical resources');
        // Add timestamp to each URL to force fresh fetch
        const timestampedUrls = CRITICAL_CACHE.map(url => {
          const separator = url.includes('?') ? '&' : '?';
          return url + separator + 't=' + Date.now();
        });
        return cache.addAll(timestampedUrls);
      })
      .then(() => {
        console.log('[ServiceWorker] Critical resources cached');
        // Force immediate activation
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[ServiceWorker] Cache installation failed:', err);
        // Still skip waiting even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating new version:', CACHE_NAME);
  
  event.waitUntil(
    // Delete ALL old caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[ServiceWorker] Old caches cleared');
      // Take control of all clients immediately
      return self.clients.claim();
    })
    .then(() => {
      // Notify all clients that a new service worker is active
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_VERSION,
            timestamp: Date.now()
          });
        });
      });
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // In dev mode, always fetch from network
  if (DEV_MODE) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For stamp collection pages, always fetch fresh
  if (url.pathname.includes('/stamps/') || url.searchParams.has('stamp')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        mode: 'cors',
        credentials: 'same-origin'
      }).catch(() => {
        // Fallback to cache only if network fails
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // For HTML files, always try network first
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache'
      })
      .then(response => {
        // Update cache with fresh response
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // For other resources, use cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Return cached version but update in background
          fetch(event.request).then(freshResponse => {
            if (freshResponse && freshResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, freshResponse);
              });
            }
          }).catch(() => {
            // Ignore network errors for background updates
          });
          return response;
        }
        
        // No cache, fetch from network
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Cache the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});

// Message handler for manual cache control
self.addEventListener('message', event => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[ServiceWorker] Force deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // Notify client that caches are cleared
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      cacheName: CACHE_NAME,
      timestamp: Date.now()
    });
  }
});