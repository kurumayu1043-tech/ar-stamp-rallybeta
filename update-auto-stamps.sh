#!/bin/bash

# スタンプデータ
declare -A stamps
stamps["ticket"]="金券売り場|🎫|金券はこちらでお買い求めください。|#98c1d9"
stamps["stage"]="ステージ前|🎭|パフォーマンスをお楽しみください！|#f7e07a"
stamps["bunmi1"]="文実模擬店１|🍜|美味しい食べ物がいっぱい！|#a9e2a9"
stamps["bunmi2"]="文実模擬店２|🎮|楽しいゲームコーナーです。|#d2b4de"
stamps["yamato"]="庭大和|🌸|和の雰囲気を感じる憩いの空間。|#ffb6c1"
stamps["rhythm"]="リズム館|🎵|音楽の世界へようこそ！|#87ceeb"
stamps["gym"]="体育館|🏐|スポーツイベント開催中！|#dda0dd"

# 各スタンプページを作成
for stamp_id in "${!stamps[@]}"; do
    IFS='|' read -r name icon desc color <<< "${stamps[$stamp_id]}"
    
    # entrance-auto.htmlをベースにして新しいファイルを作成
    cp stamps/entrance-auto.html "stamps/${stamp_id}-auto.html"
    
    # 内容を置換
    sed -i "s/入場口/${name}/g" "stamps/${stamp_id}-auto.html"
    sed -i "s/🏛️/${icon}/g" "stamps/${stamp_id}-auto.html"
    sed -i "s/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/${desc}/g" "stamps/${stamp_id}-auto.html"
    sed -i "s/#ffc0cb20/${color}20/g" "stamps/${stamp_id}-auto.html"
    sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = '${stamp_id}'/g" "stamps/${stamp_id}-auto.html"
    sed -i "s/const STAMP_NAME = '入場口'/const STAMP_NAME = '${name}'/g" "stamps/${stamp_id}-auto.html"
    
    echo "Created: stamps/${stamp_id}-auto.html"
done

# 既存のスタンプページを自動版に置き換え
for stamp_id in entrance "${!stamps[@]}"; do
    mv "stamps/${stamp_id}.html" "stamps/${stamp_id}-ar.html"
    mv "stamps/${stamp_id}-auto.html" "stamps/${stamp_id}.html"
    echo "Replaced: stamps/${stamp_id}.html (AR版は stamps/${stamp_id}-ar.html として保存)"
done

echo "全スタンプページを自動取得版に更新しました！"