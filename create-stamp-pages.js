// スタンプページ生成スクリプト
const fs = require('fs');
const path = require('path');

// スタンプデータ
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

// HTMLテンプレート
function createStampHTML(stampId, stampData) {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${stampData.name} - ARスタンプラリー</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="stylesheet" href="../css/style.css?v=20240828-3">
    <style>
        .auto-stamp-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .stamp-image-container {
            width: 200px;
            height: 200px;
            margin: 20px auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: stampEffect 1s ease-out;
        }
        
        .stamp-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            animation: stampRotate 0.8s ease-out;
        }
        
        @keyframes stampEffect {
            0% {
                transform: scale(0) rotate(-180deg);
                opacity: 0;
            }
            50% {
                transform: scale(1.2) rotate(10deg);
            }
            100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
        }
        
        @keyframes stampRotate {
            0% {
                transform: rotate(-360deg) scale(0);
            }
            100% {
                transform: rotate(0deg) scale(1);
            }
        }
        
        .stamp-mark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 3rem;
            color: #ff0000;
            font-weight: bold;
            opacity: 0;
            animation: stampMark 0.5s ease-out 0.8s forwards;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            pointer-events: none;
        }
        
        @keyframes stampMark {
            0% {
                transform: translate(-50%, -50%) rotate(-15deg) scale(3);
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) rotate(-15deg) scale(1);
                opacity: 0.8;
            }
        }
        
        .location-badge {
            display: inline-block;
            padding: 8px 20px;
            background: ${stampData.color};
            color: #333;
            border-radius: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }
        
        .success-check {
            font-size: 5rem;
            color: #4CAF50;
            animation: checkmark 0.5s ease-out 1s both;
        }
        
        @keyframes checkmark {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .redirect-message {
            margin-top: 20px;
            padding: 15px 30px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            animation: fadeIn 0.5s ease-out 1s both;
        }
        
        .progress-dots {
            margin-top: 20px;
        }
        
        .dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin: 0 5px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.2);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="auto-stamp-page">
        <div class="location-badge">${stampData.name}</div>
        <h1 class="stamp-get-title">スタンプゲット！</h1>
        
        <div class="stamp-image-container">
            <img src="../nisyama1.png" alt="西山さんスタンプ" class="stamp-image">
            <div class="stamp-mark">GET!</div>
        </div>
        
        <div class="success-check">✅</div>
        
        <p class="stamp-get-description">
            ${stampData.description}
        </p>
        
        <div class="success-message" style="margin-top: 20px;">
            <strong>スタンプを獲得しました！</strong>
        </div>
        
        <div class="redirect-message">
            <p id="redirect-text">3秒後にホームに戻ります...</p>
            <div class="progress-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </div>
        
        <div style="margin-top: 30px;">
            <a href="../index.html" class="button secondary">
                今すぐホームに戻る
            </a>
        </div>
    </div>

    <script src="../js/stamp-rally.js?v=20240828-3"></script>
    <script>
        const STAMP_ID = '${stampId}';
        const STAMP_NAME = '${stampData.name}';
        const REDIRECT_DELAY = 3000; // 3秒後にリダイレクト
        
        // ページ読み込み時の処理
        document.addEventListener('DOMContentLoaded', () => {
            console.log(\`===== スタンプ自動取得: \${STAMP_NAME} =====\`);
            
            // stampRallyが読み込まれるまで待機
            if (typeof stampRally === 'undefined' || typeof STAMP_DATA === 'undefined') {
                console.log('Waiting for stampRally to load...');
                setTimeout(() => {
                    location.reload();
                }, 100);
                return;
            }
            
            // スタンプを収集
            const isNew = stampRally.collectStamp(STAMP_ID);
            
            if (isNew) {
                console.log(\`✅ 新しいスタンプを獲得: \${STAMP_NAME}\`);
                
                // サウンド効果（対応ブラウザのみ）
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRm4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoFAAA=');
                    audio.play().catch(() => {}); // エラーは無視
                } catch (e) {}
            } else {
                console.log(\`ℹ️ 既に獲得済みのスタンプ: \${STAMP_NAME}\`);
                document.querySelector('.success-message strong').textContent = 'このスタンプは既に獲得済みです';
            }
            
            // 収集状況をログ出力
            const collected = stampRally.getCollectedCount();
            const total = Object.keys(STAMP_DATA).length;
            console.log(\`📊 現在の収集状況: \${collected} / \${total}\`);
            
            // LocalStorageの状態を確認
            console.log('LocalStorage content:', localStorage.getItem('arStamps2024'));
            console.log('stampRally.stamps:', stampRally.stamps);
            
            // 全スタンプ収集チェック
            if (stampRally.isAllCollected()) {
                console.log('🎉 全スタンプコンプリート！');
                document.getElementById('redirect-text').textContent = 'おめでとうございます！全スタンプ達成！3秒後にホームに戻ります...';
            }
            
            // カウントダウン表示
            let countdown = 3;
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    document.getElementById('redirect-text').textContent = \`\${countdown}秒後にホームに戻ります...\`;
                }
            }, 1000);
            
            // 自動リダイレクト
            setTimeout(() => {
                clearInterval(countdownInterval);
                console.log('🔄 ホームページにリダイレクト');
                window.location.href = '../index.html';
            }, REDIRECT_DELAY);
        });
        
        // ページ離脱時のログ
        window.addEventListener('beforeunload', () => {
            console.log(\`ページを離れます: \${STAMP_NAME}\`);
        });
        
        // タブがバックグラウンドになった時
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('タブがバックグラウンドになりました');
            } else {
                console.log('タブがアクティブになりました');
                // 最新の状態を再読み込み
                if (typeof stampRally !== 'undefined') {
                    stampRally.loadStamps();
                }
            }
        });
    </script>
</body>
</html>`;
}

// スタンプページを生成
const stampsDir = path.join(__dirname, 'stamps');

// 既存のファイルをバックアップ
const backupDir = path.join(__dirname, 'stamps-backup');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// 各スタンプページを生成
Object.keys(STAMP_DATA).forEach(stampId => {
    const stampData = STAMP_DATA[stampId];
    const html = createStampHTML(stampId, stampData);
    const filePath = path.join(stampsDir, `${stampId}.html`);
    
    // 既存ファイルをバックアップ
    if (fs.existsSync(filePath)) {
        const backupPath = path.join(backupDir, `${stampId}.html.bak`);
        fs.copyFileSync(filePath, backupPath);
        console.log(`Backed up: ${stampId}.html`);
    }
    
    // 新しいファイルを書き込み
    fs.writeFileSync(filePath, html);
    console.log(`Created: ${stampId}.html`);
});

console.log('\n✅ すべてのスタンプページを生成しました！');
console.log('バックアップは stamps-backup/ フォルダに保存されています。');