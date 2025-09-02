# 文化祭 ARスタンプラリー

## 概要
文化祭で使用するARスタンプラリーアプリケーションです。8つの場所でQRコードを見つけて、スマホのカメラアプリで読み取ることでスタンプを集めることができます。スタンプ取得後は自動的にカメラが起動し、キャラクターと一緒に撮影を楽しめます。

## スタンプラリー場所（8箇所）
1. **入場口** - ようこそ文化祭へ！
2. **金券売り場** - 金券はこちらで
3. **ステージ前** - パフォーマンスを楽しもう
4. **文実模擬店１** - 美味しい食べ物がいっぱい
5. **文実模擬店２** - 楽しいゲームコーナー
6. **庭大和** - 憩いの空間
7. **リズム館** - 音楽の世界へ
8. **体育館** - スポーツイベント開催中

## 使い方

### 参加者向け
1. 各場所に設置されたQRコードを探す
2. スマホの標準カメラアプリでQRコードを読み取る
3. スタンプが自動的に収集される
4. カメラが起動し、キャラクターと一緒に撮影できる（5秒間）
5. 自動的にホーム画面に戻る
3. 表示されたリンクをタップしてサイトにアクセス
4. ARでマスコットキャラクター（nisyama1.png）が表示される
5. スタンプが自動的に記録される
6. 8個全て集めるとコンプリート！

### QRコードの作成方法
各場所用のQRコードは以下のURLで作成してください：

- **入場口**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=entrance`
- **金券売り場**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=ticket`
- **ステージ前**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=stage`
- **文実模擬店１**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=bunmi1`
- **文実模擬店２**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=bunmi2`
- **庭大和**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=yamato`
- **リズム館**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=rhythm`
- **体育館**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=gym`

## 機能
- URLパラメータによるスタンプ収集（QRコード読み取り後）
- カメラ起動とキャラクター表示（スタンプ取得後）
- AR風キャラクター（character.gif）との撮影機能
- スタンプ収集状況の保存（localStorage使用）
- タブ間同期（複数タブで開いても同期）
- 全スタンプ収集時のコンプリート演出
- スタンプリセット機能
- PWA対応（オフラインでも動作）

## 技術仕様
- **PWA対応**: Service Worker実装
- **データ保存**: localStorage（タブ間同期対応）
- **カメラAPI**: MediaDevices.getUserMedia()
- **対応ブラウザ**: モダンブラウザ（Chrome, Safari, Firefox等）
- **スマートフォン対応**: iOS/Android両対応

## ファイル構成
```
ar-stamp-rallybeta/
├── index.html          # メインページ
├── collect.html        # リダイレクト用ページ
├── qr-generator.html   # QRコード生成ツール
├── test-camera.html    # カメラ機能テストページ
├── nisyama1.png        # スタンプ画像
├── character.gif       # キャラクターアニメーション
├── css/style.css       # 統合スタイルシート
├── js/
│   ├── stamp-rally.js  # コアロジック
│   ├── app.js         # メインページ用JS
│   └── stamp-page.js   # スタンプページ用JS（カメラ機能含む）
├── stamps/            # 各スタンプページ（8ファイル）
├── sw.js              # Service Worker
├── manifest.json      # PWA設定
└── README.md          # このファイル
```

## デバッグ機能
開発時はキーボードの1〜8キーでスタンプを追加できます（PC環境のみ）。

## ライセンス
文化祭での使用を目的として作成されています。

## 作成者
kurumayu1043-tech