// ========================================
// スタンプページ共通JavaScript
// Version: 4.0.0
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 設定を取得
    const config = window.STAMP_CONFIG || {
        stampId: 'unknown',
        stampName: '不明',
        redirectDelay: 3000
    };
    
    console.log(`===== スタンプ自動取得: ${config.stampName} =====`);
    
    // stampRallyが読み込まれるまで待機
    if (typeof stampRally === 'undefined' || typeof STAMP_DATA === 'undefined') {
        console.log('Waiting for stampRally to load...');
        setTimeout(() => {
            location.reload();
        }, 100);
        return;
    }
    
    // スタンプを収集
    const isNew = stampRally.collectStamp(config.stampId);
    
    if (isNew) {
        console.log(`✅ 新しいスタンプを獲得: ${config.stampName}`);
        
        // サウンド効果（対応ブラウザのみ）
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRm4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoFAAA=');
            audio.play().catch(() => {});
        } catch (e) {}
    } else {
        console.log(`ℹ️ 既に獲得済みのスタンプ: ${config.stampName}`);
        const messageElement = document.querySelector('.success-message strong');
        if (messageElement) {
            messageElement.textContent = 'このスタンプは既に獲得済みです';
        }
    }
    
    // 収集状況をログ出力
    const collected = stampRally.getCollectedCount();
    const total = Object.keys(STAMP_DATA).length;
    console.log(`📊 現在の収集状況: ${collected} / ${total}`);
    console.log('LocalStorage content:', localStorage.getItem('arStamps2024'));
    console.log('stampRally.stamps:', stampRally.stamps);
    
    // 全スタンプ収集チェック
    if (stampRally.isAllCollected()) {
        console.log('🎉 全スタンプコンプリート！');
        const redirectText = document.getElementById('redirect-text');
        if (redirectText) {
            redirectText.textContent = 'おめでとうございます！全スタンプ達成！3秒後にホームに戻ります...';
        }
    }
    
    // カウントダウン表示
    let countdown = Math.floor(config.redirectDelay / 1000);
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            const redirectText = document.getElementById('redirect-text');
            if (redirectText) {
                redirectText.textContent = `${countdown}秒後にホームに戻ります...`;
            }
        }
    }, 1000);
    
    // 自動リダイレクト
    setTimeout(() => {
        clearInterval(countdownInterval);
        console.log('🔄 ホームページにリダイレクト');
        window.location.href = '../index.html';
    }, config.redirectDelay);
});

// ページ離脱時のログ
window.addEventListener('beforeunload', () => {
    if (window.STAMP_CONFIG) {
        console.log(`ページを離れます: ${window.STAMP_CONFIG.stampName}`);
    }
});

// タブがバックグラウンドになった時
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('タブがバックグラウンドになりました');
    } else {
        console.log('タブがアクティブになりました');
        if (typeof stampRally !== 'undefined') {
            stampRally.loadStamps();
        }
    }
});