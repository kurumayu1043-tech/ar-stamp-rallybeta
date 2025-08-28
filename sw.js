// Service Worker for AR Stamp Rally PWA
// キャッシュバージョンを更新（変更日時: 2024-08-28）
const CACHE_NAME = 'ar-stamp-v5-20240828';
const BASE_URL = '/ar-stamp-rallybeta/';
const urlsToCache = [
  BASE_URL,
  BASE_URL + 'index.html',
  BASE_URL + 'css/style.css',
  BASE_URL + 'js/stamp-rally.js',
  BASE_URL + 'nisyama1.png',
  BASE_URL + 'manifest.json'
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
  // 即座にアクティベート
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // すぐにクライアントをコントロール
  self.clients.claim();
});

// フェッチイベントの処理
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // スタンプパラメータ付きのURLの場合
  if (url.pathname.includes('/ar-stamp-rallybeta') && url.searchParams.has('stamp')) {
    // パラメータを保持したままindex.htmlを返す
    event.respondWith(
      caches.match(BASE_URL + 'index.html')
        .then(response => {
          if (response) {
            // キャッシュされたindex.htmlを返す
            // JavaScriptがパラメータを処理する
            return response;
          }
          // キャッシュにない場合はネットワークから取得
          return fetch(BASE_URL + 'index.html')
            .then(response => {
              // 成功したらキャッシュに追加
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(BASE_URL + 'index.html', responseToCache);
                  });
              }
              return response;
            });
        })
        .catch(() => {
          // オフライン時もindex.htmlを返す
          return caches.match(BASE_URL + 'index.html');
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
        
        // キャッシュにない場合はネットワークから取得
        return fetch(event.request)
          .then(response => {
            // 有効なレスポンスでない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // HTTPSまたはローカルホストの場合のみキャッシュ
            const isHTTPS = url.protocol === 'https:';
            const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
            
            if (isHTTPS || isLocalhost) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          });
      })
      .catch(() => {
        // オフラインフォールバック
        if (event.request.destination === 'document') {
          return caches.match(BASE_URL + 'index.html');
        }
      })
  );
});

// メッセージ受信時の処理
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});