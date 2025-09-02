// ========================================
// スタンプページ共通JavaScript
// Version: 3.1.0 - カメラ&キャラクター機能追加
// ========================================

// カメラストリーム管理
let cameraStream = null;
let cameraTimeout = null;

// カメラを起動してキャラクターを表示
async function startCameraWithCharacter() {
    console.log('カメラ起動中...');
    
    // カメラコンテナを作成
    const cameraContainer = document.createElement('div');
    cameraContainer.className = 'camera-container';
    cameraContainer.innerHTML = `
        <div class="camera-view">
            <video id="camera-video" autoplay playsinline></video>
            <div class="character-overlay">
                <img src="../character.gif" alt="キャラクター">
            </div>
            <div class="camera-countdown" id="camera-countdown">
                カメラ起動中...
            </div>
            <button class="camera-close-btn" onclick="closeCameraView()">×</button>
        </div>
    `;
    
    document.body.appendChild(cameraContainer);
    
    // カメラコンテナを表示
    setTimeout(() => {
        cameraContainer.classList.add('active');
    }, 100);
    
    const video = document.getElementById('camera-video');
    const countdown = document.getElementById('camera-countdown');
    
    try {
        // カメラアクセスを要求
        const constraints = {
            video: {
                facingMode: 'environment', // 背面カメラを優先
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        };
        
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = cameraStream;
        
        countdown.textContent = 'キャラクターと一緒に撮影しよう！';
        
        // 5秒後に自動的にカメラを閉じる
        let remainingTime = 5;
        const countdownInterval = setInterval(() => {
            remainingTime--;
            if (remainingTime > 0) {
                countdown.textContent = `${remainingTime}秒後に自動で閉じます...`;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        cameraTimeout = setTimeout(() => {
            closeCameraView();
        }, 5000);
        
    } catch (error) {
        console.error('カメラの起動に失敗しました:', error);
        countdown.textContent = 'カメラの起動に失敗しました';
        
        // エラー時も3秒後に閉じる
        setTimeout(() => {
            closeCameraView();
        }, 3000);
    }
}

// カメラビューを閉じる
function closeCameraView() {
    console.log('カメラを閉じています...');
    
    // タイムアウトをクリア
    if (cameraTimeout) {
        clearTimeout(cameraTimeout);
        cameraTimeout = null;
    }
    
    // カメラストリームを停止
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop();
        });
        cameraStream = null;
    }
    
    // カメラコンテナを削除
    const cameraContainer = document.querySelector('.camera-container');
    if (cameraContainer) {
        cameraContainer.classList.remove('active');
        setTimeout(() => {
            cameraContainer.remove();
            // ホームに戻る
            redirectToHome();
        }, 300);
    }
}

// ホームにリダイレクト
function redirectToHome() {
    console.log('🔄 ホームページにリダイレクト');
    window.location.href = '../index.html';
}

// メイン処理
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
            redirectText.textContent = 'カメラを起動しています...';
        }
    }
    
    // カウントダウン表示を更新
    const redirectText = document.getElementById('redirect-text');
    if (redirectText) {
        redirectText.textContent = '2秒後にカメラが起動します...';
    }
    
    // 2秒後にカメラを起動
    setTimeout(() => {
        if (redirectText) {
            redirectText.textContent = 'カメラを起動中...';
        }
        startCameraWithCharacter();
    }, 2000);
});

// ページ離脱時のリソースクリーンアップ
window.addEventListener('beforeunload', () => {
    if (window.STAMP_CONFIG) {
        console.log(`ページを離れます: ${window.STAMP_CONFIG.stampName}`);
    }
    
    // カメラストリームを停止
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop();
        });
    }
});

// タブがバックグラウンドになった時
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('タブがバックグラウンドになりました');
        // バックグラウンドではカメラを停止
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => {
                track.stop();
            });
            cameraStream = null;
        }
    } else {
        console.log('タブがアクティブになりました');
        if (typeof stampRally !== 'undefined') {
            stampRally.loadStamps();
        }
    }
});

// グローバル関数として公開（HTMLから呼び出し可能）
window.closeCameraView = closeCameraView;