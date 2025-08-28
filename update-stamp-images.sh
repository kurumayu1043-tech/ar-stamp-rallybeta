#!/bin/bash

# スタンプデータ
declare -A stamps
stamps["entrance"]="入場口|ようこそ文化祭へ！<br>素敵な一日をお過ごしください。|#ffc0cb"
stamps["ticket"]="金券売り場|金券はこちらでお買い求めください。|#98c1d9"
stamps["stage"]="ステージ前|パフォーマンスをお楽しみください！|#f7e07a"
stamps["bunmi1"]="文実模擬店１|美味しい食べ物がいっぱい！|#a9e2a9"
stamps["bunmi2"]="文実模擬店２|楽しいゲームコーナーです。|#d2b4de"
stamps["yamato"]="庭大和|和の雰囲気を感じる憩いの空間。|#ffb6c1"
stamps["rhythm"]="リズム館|音楽の世界へようこそ！|#87ceeb"
stamps["gym"]="体育館|スポーツイベント開催中！|#dda0dd"

# 各スタンプページを更新
for stamp_id in "${!stamps[@]}"; do
    IFS='|' read -r name desc color <<< "${stamps[$stamp_id]}"
    
    # entrance-updated.htmlをベースにして新しいファイルを作成
    cp stamps/entrance-updated.html "stamps/${stamp_id}-new.html"
    
    # 内容を置換
    sed -i "s/<div class=\"location-badge\">入場口<\/div>/<div class=\"location-badge\">${name}<\/div>/g" "stamps/${stamp_id}-new.html"
    sed -i "s/background: #ffc0cb;/background: ${color};/g" "stamps/${stamp_id}-new.html"
    sed -i "s/>ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。</>$desc</g" "stamps/${stamp_id}-new.html"
    sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = '${stamp_id}'/g" "stamps/${stamp_id}-new.html"
    sed -i "s/const STAMP_NAME = '入場口'/const STAMP_NAME = '${name}'/g" "stamps/${stamp_id}-new.html"
    
    # 元のファイルを置き換え
    mv "stamps/${stamp_id}-new.html" "stamps/${stamp_id}.html"
    
    echo "Updated: stamps/${stamp_id}.html"
done

echo "全スタンプページをnisyama1.png画像版に更新しました！"