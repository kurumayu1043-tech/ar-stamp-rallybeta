// スタンプページ生成スクリプト
const fs = require('fs');
const path = require('path');

const stamps = [
    { id: 'ticket', name: '金券売り場', icon: '🎫', description: '金券はこちらでお買い求めください。', color: '#98c1d9' },
    { id: 'stage', name: 'ステージ前', icon: '🎭', description: 'パフォーマンスをお楽しみください！', color: '#f7e07a' },
    { id: 'bunmi1', name: '文実模擬店１', icon: '🍜', description: '美味しい食べ物がいっぱい！', color: '#a9e2a9' },
    { id: 'bunmi2', name: '文実模擬店２', icon: '🎮', description: '楽しいゲームコーナーです。', color: '#d2b4de' },
    { id: 'yamato', name: '庭大和', icon: '🌸', description: '和の雰囲気を感じる憩いの空間。', color: '#ffb6c1' },
    { id: 'rhythm', name: 'リズム館', icon: '🎵', description: '音楽の世界へようこそ！', color: '#87ceeb' },
    { id: 'gym', name: '体育館', icon: '🏐', description: 'スポーツイベント開催中！', color: '#dda0dd' }
];

const template = (stamp) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${stamp.name} - ARスタンプラリー</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</head>
<body>
    <div class="stamp-page">
        <h1 class="stamp-get-title">${stamp.name}のスタンプ</h1>
        
        <div class="stamp-get-icon" style="background: ${stamp.color}20;">
            ${stamp.icon}
        </div>
        
        <p class="stamp-get-description">
            ${stamp.description}
        </p>
        
        <div class="success-message" id="success-message" style="display:none;">
            ✅ スタンプを獲得しました！
        </div>
        
        <div class="button-group">
            <button class="button success" onclick="showAR()">
                📸 ARカメラで撮影
            </button>
            <a href="../index.html" class="button secondary">
                🏠 ホームに戻る
            </a>
        </div>
    </div>

    <!-- ARビュー -->
    <div class="camera-view" id="camera-view" style="display:none;">
        <video id="camera-video" autoplay playsinline muted></video>
    </div>

    <div class="ar-overlay" id="ar-overlay" style="display:none;">
        <h3>${stamp.name}</h3>
    </div>

    <button class="back-button" id="back-button" onclick="hideAR()" style="display:none;">
        ←
    </button>

    <a-scene id="ar-scene" embedded vr-mode-ui="enabled: false" style="display:none;">
        <a-assets>
            <img id="mascot" src="../nisyama1.png" crossorigin="anonymous">
        </a-assets>
        <a-image 
            src="#mascot" 
            position="0 0 -3" 
            scale="3 3 1" 
            look-at="[camera]"
            animation__float="property: position; from: 0 -0.5 -3; to: 0 0.5 -3; dur: 2000; easing: easeInOutSine; loop: true; dir: alternate"
            animation__rotate="property: rotation; from: 0 0 -5; to: 0 0 5; dur: 3000; easing: easeInOutSine; loop: true; dir: alternate">
        </a-image>
        <a-camera></a-camera>
    </a-scene>

    <script src="../js/stamp-rally.js"></script>
    <script>
        const STAMP_ID = '${stamp.id}';
        let cameraStream = null;

        // ページ読み込み時の処理
        document.addEventListener('DOMContentLoaded', () => {
            // スタンプを収集
            const isNew = stampRally.collectStamp(STAMP_ID);
            
            // 成功メッセージを表示
            if (isNew) {
                document.getElementById('success-message').style.display = 'block';
            }

            // デバッグログ
            debugLog(\`スタンプページ読み込み: \${STAMP_ID}\`);
            debugLog(\`新規スタンプ: \${isNew}\`);
            debugLog(\`収集済みスタンプ数: \${stampRally.getCollectedCount()}\`);

            // URLパラメータでARモードの場合
            if (getUrlParam('mode') === 'ar') {
                setTimeout(() => showAR(), 500);
            }
        });

        // AR表示
        async function showAR() {
            debugLog('AR表示開始');
            
            document.querySelector('.stamp-page').style.display = 'none';
            document.getElementById('camera-view').style.display = 'block';
            document.getElementById('ar-scene').style.display = 'block';
            document.getElementById('ar-overlay').style.display = 'block';
            document.getElementById('back-button').style.display = 'block';

            try {
                const video = document.getElementById('camera-video');
                const constraints = {
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                };
                
                cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
                video.srcObject = cameraStream;
                
                const arScene = document.getElementById('ar-scene');
                if (arScene.play) {
                    arScene.play();
                }
            } catch (err) {
                console.error('カメラエラー:', err);
                
                // フロントカメラで再試行
                try {
                    const video = document.getElementById('camera-video');
                    cameraStream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'user' } 
                    });
                    video.srcObject = cameraStream;
                } catch (e) {
                    alert('カメラを起動できませんでした');
                    hideAR();
                }
            }
        }

        // AR非表示
        function hideAR() {
            debugLog('AR非表示');
            
            document.querySelector('.stamp-page').style.display = 'flex';
            document.getElementById('camera-view').style.display = 'none';
            document.getElementById('ar-scene').style.display = 'none';
            document.getElementById('ar-overlay').style.display = 'none';
            document.getElementById('back-button').style.display = 'none';

            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = null;
            }

            const arScene = document.getElementById('ar-scene');
            if (arScene.pause) {
                arScene.pause();
            }
        }

        // ページを離れる時
        window.addEventListener('beforeunload', () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        });
    </script>
</body>
</html>`;

// stampsディレクトリが存在しない場合は作成
const stampsDir = path.join(__dirname, 'stamps');
if (!fs.existsSync(stampsDir)) {
    fs.mkdirSync(stampsDir);
}

// 各スタンプのHTMLファイルを生成
stamps.forEach(stamp => {
    const filePath = path.join(stampsDir, `${stamp.id}.html`);
    fs.writeFileSync(filePath, template(stamp));
    console.log(`Generated: ${stamp.id}.html`);
});

console.log('All stamp pages generated successfully!');