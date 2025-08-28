# GitHub Pages デプロイメント診断ガイド

## 🔍 問題の状況
コミットはGitHubにプッシュされているが、GitHub Pagesサイトに変更が反映されない。

## ✅ 実施済みの対策

### 1. キャッシュバスティング機能
- Service Workerのキャッシュバージョンを`v6`に更新し、タイムスタンプベースのキャッシュ名を実装
- すべてのCSS/JSファイルにバージョンパラメータを追加
- HTMLにキャッシュ制御メタタグを追加

### 2. Service Worker改善
- ネットワークファースト戦略をHTMLファイルに適用
- 10秒ごとの自動更新チェック
- メッセージベースのキャッシュクリア機能
- 強制更新ボタンの実装

### 3. デバッグツール
- `version.html` - バージョン確認ページ
- `check-deployment.html` - 包括的なデプロイメント検証ツール
- `test-deployment.txt` - シンプルなテキストファイルでデプロイ確認

### 4. GitHub Pages最適化
- `.nojekyll`ファイルを追加（Jekyllプロセシングを無効化）

## 📋 確認手順

### ステップ1: GitHub Pages設定の確認
1. GitHubリポジトリの Settings → Pages を確認
2. Source が正しく設定されているか確認（Deploy from a branch）
3. Branch が `main` で、folder が `/ (root)` になっているか確認
4. カスタムドメインが設定されていないか確認

### ステップ2: デプロイメントステータスの確認
1. GitHubリポジトリの Actions タブを確認
2. "pages-build-deployment" ワークフローの状態を確認
3. 最新のデプロイメントが成功しているか確認

### ステップ3: ブラウザでの検証
1. **シークレット/プライベートウィンドウで開く**
   ```
   https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/test-deployment.txt
   ```
   このファイルの内容が最新（Version: 6.0.1）になっているか確認

2. **デプロイメント検証ツールを開く**
   ```
   https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/check-deployment.html
   ```

3. **開発者ツールでネットワークを確認**
   - F12で開発者ツールを開く
   - Networkタブで「Disable cache」にチェック
   - ページをリロードして、ファイルが304（Not Modified）ではなく200で取得されているか確認

### ステップ4: CDNキャッシュのクリア
GitHub PagesはFastly CDNを使用しているため、キャッシュがクリアされるまで時間がかかる場合があります。

**強制的にキャッシュをバイパスする方法:**
1. URLにランダムパラメータを追加
   ```
   https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/?t=1693238400
   ```

2. 異なるブラウザまたはデバイスで確認

3. VPNを使用して異なる地域から接続

### ステップ5: DNS/SSL証明書の確認
1. `nslookup kurumayu1043-tech.github.io` でDNSが正しく解決されているか確認
2. SSL証明書が有効か確認

## 🛠️ トラブルシューティング

### 問題: ファイルが404エラー
**解決策:**
- ファイル名の大文字小文字を確認
- パスが正しいか確認
- `.nojekyll`ファイルが存在するか確認

### 問題: 古いバージョンが表示される
**解決策:**
1. ブラウザのキャッシュをクリア
2. Service Workerを削除（開発者ツール → Application → Service Workers → Unregister）
3. IndexedDB、LocalStorageをクリア
4. シークレットウィンドウで確認

### 問題: Service Workerが更新されない
**解決策:**
1. index.htmlの「最新版に更新」ボタンをクリック
2. 手動でService Workerを削除:
   ```javascript
   navigator.serviceWorker.getRegistrations().then(function(registrations) {
     for(let registration of registrations) {
       registration.unregister();
     }
   });
   ```

## 📊 確認用URL一覧

基本確認:
- メインページ: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/
- テスト用テキスト: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/test-deployment.txt
- バージョン情報: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/version.html
- デプロイメント検証: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/check-deployment.html

スタンプページ確認:
- https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/entrance.html
- https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/cafeteria.html
- https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/stamps/library.html

## 🚀 次のステップ

1. 上記の確認手順を実行
2. `check-deployment.html`で診断を実行
3. 問題が解決しない場合は、GitHubサポートに問い合わせることを検討

## 📝 更新履歴
- 2024-08-28 16:30 - Version 6.0.1: 積極的なキャッシュバスティング実装
- 2024-08-28 16:15 - Version 5: Service Worker更新、.nojekyll追加
- 2024-08-28 15:52 - スタンプ画像をnisyama1.pngに統一