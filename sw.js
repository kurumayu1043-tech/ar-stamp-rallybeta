// Service Worker for AR Stamp Rally PWA
const CACHE_NAME = 'ar-stamp-v1';
const urlsToCache = [
  '/ar-stamp-rallybeta/',
  '/ar-stamp-rallybeta/index.html',
  '/ar-stamp-rallybeta/nisyama1.png',
  '/ar-stamp-rallybeta/manifest.json',
  'https://aframe.io/releases/1.4.0/aframe.min.js'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエストをインターセプト
self.addEventListener('fetch', event => {
  // QRコードからのスタンプ収集URLの場合は、常にメインページにリダイレクト
  const url = new URL(event.request.url);
  
  // stamp パラメータがある場合の処理
  if (url.searchParams.has('stamp')) {
    event.respondWith(
      caches.match('/ar-stamp-rallybeta/index.html')
        .then(response => {
          if (response) {
            // キャッシュからindex.htmlを返すが、URLパラメータは維持
            return response;
          }
          // キャッシュにない場合はネットワークから取得
          return fetch('/ar-stamp-rallybeta/index.html');
        })
    );
    return;
  }

  // 通常のリクエスト処理
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request)
          .then(response => {
            // 有効なレスポンスでない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスをキャッシュに保存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// 古いキャッシュを削除
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
    })
  );
});