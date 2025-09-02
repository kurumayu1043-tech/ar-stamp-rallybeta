# ニシャマースタンプラリー

## 概要
ニシャマーと一緒に楽しむスタンプラリーアプリケーションです。10の場所でQRコードを見つけて、スマホのカメラアプリで読み取ることでスタンプを集めることができます。マスコットキャラクター「ニシャマー」がみんなの冒険をサポートします！

## スタンプラリー場所（10箇所）
1. **入場口** - ようこそ文化祭へ！
2. **金券売り場** - 金券はこちらで
3. **ステージ前** - パフォーマンスを楽しもう
4. **文実模擬店１** - 美味しい食べ物がいっぱい
5. **文実模擬店２** - 楽しいゲームコーナー
6. **庭大和** - 憩いの空間
7. **リズム館** - 音楽の世界へ
8. **体育館** - スポーツイベント開催中
9. **武道場** - 迫力の武道演武をご覧ください！
10. **特技展示** - 生徒たちの特技を展示しています！

## 使い方

### 参加者向け
1. まずキャラクター紹介ページでニシャマーと出会う
2. 各場所に設置されたQRコードを探す
3. スマホの標準カメラアプリでQRコードを読み取る
4. 表示されたリンクをタップしてスタンプを獲得
5. スタンプが自動的に記録される
6. 3秒後にメイン画面に戻る
7. 10個全て集めるとコンプリート！

### QRコードの作成方法
`qr-generator.html`ページで全スタンプのQRコードを一括生成できます。
各場所用のQRコードは以下のURLで作成されます：

- **入場口**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/entrance.html`
- **金券売り場**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/ticket.html`
- **ステージ前**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/stage.html`
- **文実模擬店１**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/bunmi1.html`
- **文実模擬店２**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/bunmi2.html`
- **庭大和**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/yamato.html`
- **リズム館**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/rhythm.html`
- **体育館**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/gym.html`
- **武道場**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/budo.html`
- **特技展示**: `https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/exhibition.html`

## 機能
- キャラクター紹介ページ（ニシャマー紹介）
- QRコード一括生成機能（qr-generator.html）
- 個別スタンプページによる収集（各stamps/*.html）
- スタンプ収集状況の保存（localStorage使用）
- タブ間同期（複数タブで開いても同期）
- 全スタンプ収集時のコンプリート演出
- スタンプリセット機能
- PWA対応（オフラインでも動作）
- レスポンシブデザイン（スマートフォン最適化）

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