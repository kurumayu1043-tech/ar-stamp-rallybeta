// ========================================
// ARスタンプラリー 共通JavaScript
// Version: 4.0.0
// ========================================

// スタンプデータの定義（10箇所に拡張）
const STAMP_DATA = {
    entrance: { 
        name: '入場口', 
        icon: '🏛️',
        description: 'ようこそ文化祭へ！素敵な一日をお過ごしください。',
        color: '#4FC3F7',
        order: 1,
        image: 'stamps_images/entrance.png'
    },
    ticket: { 
        name: '金券売り場', 
        icon: '🎫',
        description: '金券はこちらでお買い求めください。',
        color: '#29B6F6',
        order: 2,
        image: 'stamps_images/ticket.png'
    },
    stage: { 
        name: 'ステージ前', 
        icon: '🎭',
        description: 'パフォーマンスをお楽しみください！',
        color: '#FFD54F',
        order: 3,
        image: 'stamps_images/stage.png'
    },
    bunmi1: { 
        name: '文実模擬店１', 
        icon: '🍜',
        description: '美味しい食べ物がいっぱい！',
        color: '#4FC3F7',
        order: 4,
        image: 'stamps_images/bunmi1.png'
    },
    bunmi2: { 
        name: '文実模擬店２', 
        icon: '🎮',
        description: '楽しいゲームコーナーです。',
        color: '#29B6F6',
        order: 5,
        image: 'stamps_images/bunmi2.png'
    },
    yamato: { 
        name: '庭大和', 
        icon: '🌸',
        description: '和の雰囲気を感じる憩いの空間。',
        color: '#FFD54F',
        order: 6,
        image: 'stamps_images/yamato.png'
    },
    rhythm: { 
        name: 'リズム館', 
        icon: '🎵',
        description: '音楽の世界へようこそ！',
        color: '#4FC3F7',
        order: 7,
        image: 'stamps_images/rhythm.png'
    },
    gym: { 
        name: '体育館', 
        icon: '🏐',
        description: 'スポーツイベント開催中！',
        color: '#29B6F6',
        order: 8,
        image: 'stamps_images/gym.png'
    },
    budo: { 
        name: '武道場', 
        icon: '🥋',
        description: '迫力の武道演武をご覧ください！',
        color: '#FFD54F',
        order: 9,
        image: 'nisyama1.png'
    },
    exhibition: { 
        name: '特技展示', 
        icon: '🎨',
        description: '生徒たちの特技を展示しています！',
        color: '#4FC3F7',
        order: 10,
        image: 'nisyama1.png'
    }
};

// スタンプラリー管理クラス
class StampRally {
    constructor() {
        this.stamps = {};
        this.storageKey = 'arStamps2024';
        this.tabStorageKey = 'arStamps2024_tabs';
        this.currentStampKey = 'currentStamp';
        this.debugMode = true;
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

    // タブIDを取得
    getTabId() {
        if (!this.tabId) {
            this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.debugLog('タブID生成', this.tabId);
        }
        return this.tabId;
    }

    // デバッグ情報を取得
    getDebugInfo() {
        return {
            stamps: this.stamps,
            localStorage: localStorage.getItem(this.storageKey),
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