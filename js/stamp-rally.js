// ========================================
// ARスタンプラリー 共通JavaScript
// Version: 2.0.0
// ========================================

// スタンプデータの定義（2×4のグリッドに最適化された順序）
const STAMP_DATA = {
    entrance: { 
        name: '入場口', 
        icon: '🏛️',
        description: 'ようこそ文化祭へ！素敵な一日をお過ごしください。',
        color: '#ffc0cb',
        order: 1
    },
    ticket: { 
        name: '金券売り場', 
        icon: '🎫',
        description: '金券はこちらでお買い求めください。',
        color: '#98c1d9',
        order: 2
    },
    stage: { 
        name: 'ステージ前', 
        icon: '🎭',
        description: 'パフォーマンスをお楽しみください！',
        color: '#f7e07a',
        order: 3
    },
    bunmi1: { 
        name: '文実模擬店１', 
        icon: '🍜',
        description: '美味しい食べ物がいっぱい！',
        color: '#a9e2a9',
        order: 4
    },
    bunmi2: { 
        name: '文実模擬店２', 
        icon: '🎮',
        description: '楽しいゲームコーナーです。',
        color: '#d2b4de',
        order: 5
    },
    yamato: { 
        name: '庭大和', 
        icon: '🌸',
        description: '和の雰囲気を感じる憩いの空間。',
        color: '#ffb6c1',
        order: 6
    },
    rhythm: { 
        name: 'リズム館', 
        icon: '🎵',
        description: '音楽の世界へようこそ！',
        color: '#87ceeb',
        order: 7
    },
    gym: { 
        name: '体育館', 
        icon: '🏐',
        description: 'スポーツイベント開催中！',
        color: '#dda0dd',
        order: 8
    }
};

// スタンプラリー管理クラス
class StampRally {
    constructor() {
        this.stamps = {};
        this.storageKey = 'arStamps2024';
        this.tabStorageKey = 'arStamps2024_tabs';
        this.currentStampKey = 'currentStamp';
        this.debugMode = true; // デバッグモードを有効化
        this.init();
    }

    // デバッグログ
    debugLog(message, data = null) {
        if (this.debugMode) {
            const timestamp = new Date().toISOString();
            console.log(`[StampRally ${timestamp}] ${message}`);
            if (data !== null) {
                console.log(data);
            }
        }
    }

    // 初期化
    init() {
        this.debugLog('初期化開始');
        this.loadStamps();
        this.setupTabSync();
        this.setupVisibilityChange();
        this.debugLog('初期化完了', { stamps: this.stamps });
    }

    // スタンプデータをlocalStorageから読み込み
    loadStamps() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.debugLog('LocalStorageから読み込み', { key: this.storageKey, value: saved });
            
            if (saved) {
                this.stamps = JSON.parse(saved);
                this.debugLog('スタンプデータ読み込み成功', this.stamps);
            } else {
                this.stamps = {};
                this.debugLog('スタンプデータなし、空オブジェクトで初期化');
            }
        } catch (e) {
            console.error('スタンプデータの読み込みエラー:', e);
            this.stamps = {};
            this.debugLog('読み込みエラー、空オブジェクトで初期化', e);
        }
    }

    // スタンプデータを保存
    saveStamps() {
        try {
            const dataToSave = JSON.stringify(this.stamps);
            localStorage.setItem(this.storageKey, dataToSave);
            this.debugLog('スタンプデータ保存', { key: this.storageKey, value: dataToSave });
            this.notifyTabsUpdate();
        } catch (e) {
            console.error('スタンプデータの保存エラー:', e);
            this.debugLog('保存エラー', e);
        }
    }

    // スタンプを収集
    collectStamp(stampId) {
        this.debugLog(`スタンプ収集開始: ${stampId}`);
        
        if (!STAMP_DATA[stampId]) {
            console.error('無効なスタンプID:', stampId);
            this.debugLog(`無効なスタンプID: ${stampId}`);
            return false;
        }

        const isNew = !this.stamps[stampId];
        
        this.stamps[stampId] = {
            collected: true,
            timestamp: new Date().toISOString(),
            name: STAMP_DATA[stampId].name
        };

        this.saveStamps();
        
        this.debugLog(`スタンプ収集完了: ${STAMP_DATA[stampId].name}`, { 
            stampId, 
            isNew, 
            currentStamps: this.stamps,
            localStorage: localStorage.getItem(this.storageKey)
        });
        
        return isNew;
    }

    // スタンプが収集済みかチェック
    isCollected(stampId) {
        const collected = this.stamps[stampId] && this.stamps[stampId].collected === true;
        this.debugLog(`スタンプチェック: ${stampId} = ${collected}`);
        return collected;
    }

    // 収集済みスタンプ数を取得
    getCollectedCount() {
        const count = Object.keys(this.stamps).filter(key => this.stamps[key] && this.stamps[key].collected === true).length;
        this.debugLog(`収集済みスタンプ数: ${count}`);
        return count;
    }

    // 全スタンプ収集済みかチェック
    isAllCollected() {
        const allCollected = this.getCollectedCount() === Object.keys(STAMP_DATA).length;
        this.debugLog(`全スタンプ収集済み: ${allCollected}`);
        return allCollected;
    }

    // スタンプをリセット
    resetStamps() {
        this.debugLog('スタンプリセット開始');
        this.stamps = {};
        this.saveStamps();
        localStorage.removeItem(this.storageKey);
        this.debugLog('スタンプリセット完了');
    }

    // タブ間同期のセットアップ
    setupTabSync() {
        // storageイベントをリッスン（他のタブでの変更を検知）
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.debugLog('他のタブでスタンプが更新されました', {
                    oldValue: e.oldValue,
                    newValue: e.newValue
                });
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
        this.debugLog('タブ間同期セットアップ完了');
    }

    // タブがアクティブになった時の処理
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.debugLog('タブがアクティブになりました');
                this.loadStamps();
                if (typeof this.onTabActivated === 'function') {
                    this.onTabActivated();
                }
            } else {
                this.debugLog('タブが非アクティブになりました');
            }
        });
        this.debugLog('visibilitychangeイベントセットアップ完了');
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
            this.debugLog('タブ更新通知送信', message);
            // すぐに削除（イベントを発火させるため）
            setTimeout(() => {
                localStorage.removeItem(this.tabStorageKey);
            }, 100);
        } catch (e) {
            console.error('タブ通知エラー:', e);
            this.debugLog('タブ通知エラー', e);
        }
    }

    // タブメッセージを処理
    handleTabMessage(message) {
        if (message.type === 'stamps_updated' && message.tabId !== this.getTabId()) {
            this.debugLog('他のタブからスタンプ更新通知を受信', message);
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
            this.debugLog('タブID生成', this.tabId);
        }
        return this.tabId;
    }

    // 現在のスタンプを保存（タブ間共有用）
    setCurrentStamp(stampId) {
        sessionStorage.setItem(this.currentStampKey, stampId);
        this.debugLog('現在のスタンプ設定', stampId);
    }

    // 現在のスタンプを取得
    getCurrentStamp() {
        const current = sessionStorage.getItem(this.currentStampKey);
        this.debugLog('現在のスタンプ取得', current);
        return current;
    }

    // 現在のスタンプをクリア
    clearCurrentStamp() {
        sessionStorage.removeItem(this.currentStampKey);
        this.debugLog('現在のスタンプクリア');
    }

    // デバッグ情報を取得
    getDebugInfo() {
        return {
            stamps: this.stamps,
            localStorage: localStorage.getItem(this.storageKey),
            sessionStorage: sessionStorage.getItem(this.currentStampKey),
            collectedCount: this.getCollectedCount(),
            totalStamps: Object.keys(STAMP_DATA).length,
            isAllCollected: this.isAllCollected(),
            tabId: this.getTabId()
        };
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

// デバッグ用グローバル関数
window.stampRallyDebug = function() {
    return stampRally.getDebugInfo();
};

console.log('StampRally loaded. Use stampRallyDebug() to view debug info.');

// エクスポート（ES6モジュール対応）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StampRally, stampRally, STAMP_DATA };
}