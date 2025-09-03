// ========================================
// ARスタンプラリー メインアプリケーション
// Version: 3.0.0
// ========================================

// スタンプグリッドを描画
function renderStamps() {
    console.log('renderStamps called');
    
    if (typeof stampRally === 'undefined' || typeof STAMP_DATA === 'undefined') {
        console.error('stampRally or STAMP_DATA is not defined');
        setTimeout(renderStamps, 100);
        return;
    }
    
    const grid = document.getElementById('stamp-grid');
    if (!grid) {
        console.error('stamp-grid element not found');
        return;
    }
    
    grid.innerHTML = '';
    stampRally.loadStamps();
    console.log('Current stamps:', stampRally.stamps);

    Object.keys(STAMP_DATA).forEach(stampId => {
        const stamp = STAMP_DATA[stampId];
        const isCollected = stampRally.isCollected(stampId);
        
        const item = document.createElement('div');
        item.className = `stamp-item ${isCollected ? 'collected' : ''}`;
        item.style.borderTop = `3px solid ${stamp.color}`;
        
        // スタンプ画像を決定（データに画像パスがあれば使用、なければデフォルト）
        const stampImage = stamp.image || 'nisyama1.png';
        
        item.innerHTML = `
            <div class="stamp-icon">
                <img src="${stampImage}" alt="${stamp.name}スタンプ">
                ${!isCollected ? `<span class="stamp-emoji">${stamp.icon}</span>` : ''}
            </div>
            <div class="stamp-name">${stamp.name}</div>
            <div class="stamp-status">${isCollected ? '✅ 獲得済み' : '未獲得'}</div>
        `;
        
        if (isCollected) {
            item.style.cursor = 'default';
        }
        
        grid.appendChild(item);
    });
}

// 進捗を更新
function updateProgress() {
    console.log('updateProgress called');
    
    if (typeof stampRally === 'undefined' || typeof STAMP_DATA === 'undefined') {
        console.error('stampRally or STAMP_DATA is not defined');
        setTimeout(updateProgress, 100);
        return;
    }
    
    stampRally.loadStamps();
    
    const count = stampRally.getCollectedCount();
    const total = Object.keys(STAMP_DATA).length;
    const percentage = (count / total) * 100;
    
    console.log(`Progress: ${count} / ${total} (${percentage}%)`);
    
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${count} / ${total}`;
    }
    
    if (stampRally.isAllCollected()) {
        const completeMessage = document.getElementById('complete-message');
        if (completeMessage) {
            completeMessage.classList.remove('hidden');
        }
    }
}

// スタンプをリセット
function resetStamps() {
    if (confirm('本当にすべてのスタンプをリセットしますか？')) {
        stampRally.resetStamps();
        renderStamps();
        updateProgress();
        
        const completeMessage = document.getElementById('complete-message');
        if (completeMessage) {
            completeMessage.classList.add('hidden');
        }
    }
}

// 強制更新
async function forceUpdate() {
    console.log('強制更新を開始...');
    
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
            console.log('Service Worker unregistered');
        }
        
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }
    }
    
    window.location.reload(true);
}

// 使い方を表示
function showInstructions() {
    const modal = document.getElementById('instructions-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeInstructions() {
    const modal = document.getElementById('instructions-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Service Worker更新チェック
async function checkServiceWorkerUpdate() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('sw.js', {
                updateViaCache: 'none'
            });
            
            console.log('Service Worker registered:', registration);
            
            registration.addEventListener('updatefound', () => {
                console.log('Service Worker update found!');
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('New Service Worker installed, reloading page...');
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1000);
                    }
                });
            });
            
            await registration.update();
            
            navigator.serviceWorker.addEventListener('message', event => {
                console.log('Message from Service Worker:', event.data);
            });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// アプリケーション初期化
function initializeApp() {
    console.log('Initializing app...');
    
    if (typeof stampRally === 'undefined' || typeof STAMP_DATA === 'undefined') {
        console.log('Waiting for stampRally to be ready...');
        setTimeout(initializeApp, 100);
        return;
    }
    
    console.log('stampRally is ready, setting up event handlers');
    
    // イベントハンドラー設定
    stampRally.onTabActivated = () => {
        console.log('タブがアクティブになったので表示を更新');
        stampRally.loadStamps();
        renderStamps();
        updateProgress();
    };

    stampRally.onStampsUpdated = () => {
        console.log('他のタブでスタンプが更新されたので表示を更新');
        stampRally.loadStamps();
        renderStamps();
        updateProgress();
    };
    
    // 初期表示
    renderStamps();
    updateProgress();
    
    // Service Worker登録
    checkServiceWorkerUpdate();
    
    // デバッグ情報
    console.log('localStorage content:', localStorage.getItem('arStamps2024'));
    console.log('stampRally.stamps:', stampRally.stamps);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    initializeApp();
});

// ページが表示された時（戻るボタンなど）
window.addEventListener('pageshow', (event) => {
    console.log('pageshow event, persisted:', event.persisted);
    if (event.persisted) {
        if (typeof stampRally !== 'undefined') {
            stampRally.loadStamps();
            renderStamps();
            updateProgress();
        }
    }
});

// フォーカスイベントでも更新
window.addEventListener('focus', () => {
    console.log('Window focused, updating display');
    if (typeof stampRally !== 'undefined') {
        stampRally.loadStamps();
        renderStamps();
        updateProgress();
    }
});

// 定期的に状態を更新（5秒ごと）
setInterval(() => {
    if (typeof stampRally !== 'undefined') {
        console.log('Periodic refresh');
        stampRally.loadStamps();
        renderStamps();
        updateProgress();
    }
}, 5000);