# ARスタンプラリー 問題診断手順書

## 問題：QRコードを読み込むと全て入場口のスタンプになる

### ステップ1: ブラウザのキャッシュクリア
1. ブラウザのキャッシュを完全にクリア
2. プライベートブラウジング/シークレットモードで開く
3. 以下のURLにアクセス：
   ```
   https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/simple-test.html
   ```

### ステップ2: 動作確認
1. simple-test.htmlで「localStorageクリア」をクリック
2. 各スタンプボタンを1つずつクリック（例：「金券売り場を開く」）
3. 新しいタブで開いたcollect.htmlページを確認：
   - ページタイトルが正しいスタンプ名になっているか
   - アイコンが正しく表示されているか
   - ブラウザのコンソール（F12キー）でエラーがないか確認

### ステップ3: デバッグモードで詳細確認
1. 以下のURLをブラウザで開く（金券売り場の例）：
   ```
   https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=ticket&debug=1
   ```
2. ページ下部のデバッグ情報を確認：
   - URL: 正しいstampパラメータが含まれているか
   - スタンプID: ticketと表示されているか
   - localStorage: 正しいデータが保存されているか

### ステップ4: QRコード生成の確認
1. QRコードジェネレーターを開く：
   ```
   https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/qr-generator.html
   ```
2. 各QRコードの下に表示されているURLを確認
3. 全てのURLが異なるstampパラメータを持っているか確認

### ステップ5: 実際のQRコード読み取りテスト
1. スマートフォンでQRコードジェネレーターを開く
2. 別のスマートフォンのカメラアプリでQRコードを読み取る
3. 表示されたURLを確認（stampパラメータが正しいか）
4. リンクをタップして開く
5. 正しいスタンプが表示されるか確認

## 問題が解決しない場合の追加確認

### A. コンソールログの確認
1. PCのChromeでF12キーを押してデベロッパーツールを開く
2. Consoleタブを選択
3. collect.htmlページを開く
4. 以下のログが表示されることを確認：
   ```
   現在のURL: [実際のURL]
   URLパラメータ: ?stamp=ticket
   取得したスタンプID: ticket
   スタンプ情報: {name: "金券売り場", ...}
   ```

### B. localStorageの直接確認
1. デベロッパーツールのApplicationタブを開く
2. 左側のStorage > Local Storageを選択
3. サイトのURLをクリック
4. arStamps2024キーの値を確認
5. 正しいスタンプIDが保存されているか確認

### C. ネットワークタブでリダイレクトを確認
1. デベロッパーツールのNetworkタブを開く
2. QRコードから開いたときのリクエストを確認
3. リダイレクトが発生していないか確認

## 一時的な回避策

問題が解決しない場合の一時的な回避策：

1. **手動でスタンプを収集**
   - debug.htmlを使用して手動でスタンプを追加
   
2. **直接URLを共有**
   - QRコードの代わりに、以下のようなURLを直接共有：
   ```
   入場口: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=entrance
   金券売り場: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=ticket
   ステージ前: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=stage
   文実模擬店１: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=bunmi1
   文実模擬店２: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=bunmi2
   庭大和: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=yamato
   リズム館: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=rhythm
   体育館: https://kurumayu1043-tech.github.io/ar-stamp-rallybeta/collect.html?stamp=gym
   ```

## 報告していただきたい情報

問題が続く場合、以下の情報を教えてください：

1. 使用しているデバイス（iPhone/Android、モデル名）
2. ブラウザ（Safari/Chrome、バージョン）
3. コンソールに表示されるエラーメッセージ
4. デバッグモードで表示される情報
5. 特定のスタンプだけの問題か、全てのスタンプで起きるか