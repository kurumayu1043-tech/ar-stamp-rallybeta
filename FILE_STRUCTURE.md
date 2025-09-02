# ARスタンプラリー ファイル構成

## 📁 ディレクトリ構造

```
ar-stamp-rallybeta/
├── index.html              # メインページ
├── collect.html            # リダイレクト用ページ
├── qr-generator.html       # QRコード生成ツール
├── manifest.json           # PWA設定
├── sw.js                   # Service Worker
├── nisyama1.png           # スタンプ画像
├── character.gif          # キャラクターアニメーション
├── .nojekyll              # GitHub Pages設定
├── README.md              # プロジェクト説明
│
├── css/
│   └── style.css          # 統合スタイルシート（全スタイル集約）
│
├── js/
│   ├── stamp-rally.js     # スタンプラリー核心ロジック
│   ├── app.js            # index.html用JavaScript
│   └── stamp-page.js      # スタンプページ共通JavaScript
│
└── stamps/
    ├── entrance.html      # 入場口スタンプ
    ├── ticket.html        # 金券売り場スタンプ
    ├── stage.html         # ステージ前スタンプ
    ├── bunmi1.html        # 文実模擬店１スタンプ
    ├── bunmi2.html        # 文実模擬店２スタンプ
    ├── yamato.html        # 庭大和スタンプ
    ├── rhythm.html        # リズム館スタンプ
    └── gym.html           # 体育館スタンプ
```

## 🔧 ファイルの役割

### HTMLファイル
- **index.html**: メインページ（インラインスタイルなし）
- **collect.html**: QRコードパラメータ処理用リダイレクトページ
- **qr-generator.html**: QRコード生成・印刷ツール
- **stamps/*.html**: 各スタンプ収集ページ（統一フォーマット）

### CSSファイル
- **style.css**: すべてのスタイルを統合した単一ファイル
  - 基本スタイル
  - レイアウト
  - コンポーネント
  - アニメーション
  - レスポンシブ対応

### JavaScriptファイル
- **stamp-rally.js**: 
  - スタンプ収集ロジック
  - LocalStorage管理
  - タブ間同期
  
- **app.js**: 
  - index.html専用機能
  - UI更新
  - Service Worker管理
  
- **stamp-page.js**: 
  - スタンプページ共通処理
  - 自動収集
  - カメラ起動とキャラクター表示
  - 自動リダイレクト処理

### その他
- **sw.js**: Service Worker（キャッシュ管理）
- **manifest.json**: PWA設定
- **nisyama1.png**: スタンプ画像
- **.nojekyll**: GitHub Pages用設定

## 📝 コード構成の特徴

1. **完全分離**: HTML、CSS、JSが明確に分離
2. **再利用性**: 共通処理は専用ファイルに集約
3. **保守性**: 各ファイルの役割が明確
4. **パフォーマンス**: 必要最小限のファイル読み込み
5. **統一性**: すべてのページで同じスタイルシート使用