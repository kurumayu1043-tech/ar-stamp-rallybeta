// ========================================
// ARスタンプラリー 共通JavaScript
// ========================================

// スタンプデータの定義
const STAMP_DATA = {
    entrance: { 
        name: '入場口', 
        icon: '🏛️',
        description: 'ようこそ文化祭へ！素敵な一日をお過ごしください。',
        color: '#ffc0cb'
    },
    ticket: { 
        name: '金券売り場', 
        icon: '🎫',
        description: '金券はこちらでお買い求めください。',
        color: '#98c1d9'
    },
    stage: { 
        name: 'ステージ前', 
        icon: '🎭',
        description: 'パフォーマンスをお楽しみください！',
        color: '#f7e07a'
    },
    bunmi1: { 
        name: '文実模擬店１', 
        icon: '🍜',
        description: '美味しい食べ物がいっぱい！',
        color: '#a9e2a9'
    },
    bunmi2: { 
        name: '文実模擬店２', 
        icon: '🎮',
        description: '楽しいゲームコーナーです。',
        color: '#d2b4de'
    },
    yamato: { 
        name: '庭大和', 
        icon: '🌸',
        description: '和の雰囲気を感じる憩いの空間。',
        color: '#ffb6c1'
    },
    rhythm: { 
        name: 'リズム館', 
        icon: '🎵',
        description: '音楽の世界へようこそ！',
        color: '#87ceeb'
    },
    gym: { 
        name: '体育館', 
        icon: '🏐',
        description: 'スポーツイベント開催中！',
        color: '#dda0dd'
    }
};

// スタンプラリー管理クラス
class StampRally {
    constructor() {
        this.stamps = {};
        this.storageKey = 'arStamps2024';
        this.tabStorageKey = 'arStamps2024_tabs';
        this.currentStampKey = 'currentStamp';
        this.init();
    }

    // 初期化
    init() {
        this.loadStamps();
        this.setupTabSync();
        this.setupVisibilityChange();
    }

    // スタンプデータをlocalStorageから読み込み
    loadStamps() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.stamps = JSON.parse(saved);
            } else {
                this.stamps = {};
            }
        } catch (e) {
            console.error('スタンプデータの読み込みエラー:', e);
            this.stamps = {};
        }
    }

    // スタンプデータを保存
    saveStamps() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.stamps));
            this.notifyTabsUpdate();
        } catch (e) {
            console.error('スタンプデータの保存エラー:', e);
        }
    }

    // スタンプを収集
    collectStamp(stampId) {
        if (!STAMP_DATA[stampId]) {
            console.error('無効なスタンプID:', stampId);
            return false;
        }

        const isNew = !this.stamps[stampId];
        
        this.stamps[stampId] = {
            collected: true,
            timestamp: new Date().toISOString(),
            name: STAMP_DATA[stampId].name
        };

        this.saveStamps();
        
        console.log(`スタンプ収集: ${STAMP_DATA[stampId].name} (新規: ${isNew})`);
        
        return isNew;
    }

    // スタンプが収集済みかチェック
    isCollected(stampId) {
        return this.stamps[stampId] && this.stamps[stampId].collected;
    }

    // 収集済みスタンプ数を取得
    getCollectedCount() {
        return Object.keys(this.stamps).filter(key => this.stamps[key].collected).length;
    }

    // 全スタンプ収集済みかチェック
    isAllCollected() {
        return this.getCollectedCount() === Object.keys(STAMP_DATA).length;
    }

    // スタンプをリセット
    resetStamps() {
        this.stamps = {};
        this.saveStamps();
    }

    // タブ間同期のセットアップ
    setupTabSync() {
        // storageイベントをリッスン（他のタブでの変更を検知）
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                console.log('他のタブでスタンプが更新されました');
                this.loadStamps();
                if (typeof this.onStampsUpdated === 'function') {
                    this.onStampsUpdated();
                }
            } else if (e.key === this.tabStorageKey) {
                // 他のタブからの通知を受信
                const message = JSON.parse(e.newValue);
                this.handleTabMessage(message);
            }
        });
    }

    // タブがアクティブになった時の処理
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('タブがアクティブになりました');
                this.loadStamps();
                if (typeof this.onTabActivated === 'function') {
                    this.onTabActivated();
                }
            }
        });
    }

    // 他のタブに更新を通知
    notifyTabsUpdate() {
        const message = {
            type: 'stamps_updated',
            timestamp: new Date().toISOString(),
            tabId: this.getTabId()
        };
        
        try {
            localStorage.setItem(this.tabStorageKey, JSON.stringify(message));
            // すぐに削除（イベントを発火させるため）
            setTimeout(() => {
                localStorage.removeItem(this.tabStorageKey);
            }, 100);
        } catch (e) {
            console.error('タブ通知エラー:', e);
        }
    }

    // タブメッセージを処理
    handleTabMessage(message) {
        if (message.type === 'stamps_updated' && message.tabId !== this.getTabId()) {
            console.log('他のタブからスタンプ更新通知を受信');
            this.loadStamps();
            if (typeof this.onStampsUpdated === 'function') {
                this.onStampsUpdated();
            }
        }
    }

    // タブIDを取得（セッション中は固定）
    getTabId() {
        if (!this.tabId) {
            this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this.tabId;
    }

    // 現在のスタンプを保存（タブ間共有用）
    setCurrentStamp(stampId) {
        sessionStorage.setItem(this.currentStampKey, stampId);
    }

    // 現在のスタンプを取得
    getCurrentStamp() {
        return sessionStorage.getItem(this.currentStampKey);
    }

    // 現在のスタンプをクリア
    clearCurrentStamp() {
        sessionStorage.removeItem(this.currentStampKey);
    }
}

// URLパラメータを取得するヘルパー関数
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ページ遷移のヘルパー関数
function navigateTo(url) {
    window.location.href = url;
}

// ローディング表示
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// デバッグログ
function debugLog(message) {
    if (getUrlParam('debug') === '1') {
        console.log('[DEBUG]', message);
        
        // デバッグパネルを表示
        let debugPanel = document.getElementById('debug-panel');
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'debug-panel';
            debugPanel.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: #0f0;
                padding: 10px;
                font-family: monospace;
                font-size: 12px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 9999;
                border-radius: 5px;
            `;
            document.body.appendChild(debugPanel);
        }
        
        const timestamp = new Date().toTimeString().split(' ')[0];
        debugPanel.innerHTML = `[${timestamp}] ${message}<br>` + debugPanel.innerHTML;
    }
}

// スタンプラリーインスタンスをグローバルに作成
const stampRally = new StampRally();

// エクスポート（ES6モジュール対応）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StampRally, stampRally, STAMP_DATA };
}