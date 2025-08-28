#!/bin/bash

# ステージ前
sed -i 's/入場口のスタンプ/ステージ前のスタンプ/g' stamps/stage.html
sed -i 's/#ffc0cb20/#f7e07a20/g' stamps/stage.html
sed -i 's/🏛️/🎭/g' stamps/stage.html
sed -i 's/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/パフォーマンスをお楽しみください！/g' stamps/stage.html
sed -i 's/<h3>入場口</<h3>ステージ前</g' stamps/stage.html
sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = 'stage'/g" stamps/stage.html
sed -i 's/<title>入場口/<title>ステージ前/g' stamps/stage.html

# 文実模擬店１
sed -i 's/入場口のスタンプ/文実模擬店１のスタンプ/g' stamps/bunmi1.html
sed -i 's/#ffc0cb20/#a9e2a920/g' stamps/bunmi1.html
sed -i 's/🏛️/🍜/g' stamps/bunmi1.html
sed -i 's/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/美味しい食べ物がいっぱい！/g' stamps/bunmi1.html
sed -i 's/<h3>入場口</<h3>文実模擬店１</g' stamps/bunmi1.html
sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = 'bunmi1'/g" stamps/bunmi1.html
sed -i 's/<title>入場口/<title>文実模擬店１/g' stamps/bunmi1.html

# 文実模擬店２
sed -i 's/入場口のスタンプ/文実模擬店２のスタンプ/g' stamps/bunmi2.html
sed -i 's/#ffc0cb20/#d2b4de20/g' stamps/bunmi2.html
sed -i 's/🏛️/🎮/g' stamps/bunmi2.html
sed -i 's/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/楽しいゲームコーナーです。/g' stamps/bunmi2.html
sed -i 's/<h3>入場口</<h3>文実模擬店２</g' stamps/bunmi2.html
sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = 'bunmi2'/g" stamps/bunmi2.html
sed -i 's/<title>入場口/<title>文実模擬店２/g' stamps/bunmi2.html

# 庭大和
sed -i 's/入場口のスタンプ/庭大和のスタンプ/g' stamps/yamato.html
sed -i 's/#ffc0cb20/#ffb6c120/g' stamps/yamato.html
sed -i 's/🏛️/🌸/g' stamps/yamato.html
sed -i 's/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/和の雰囲気を感じる憩いの空間。/g' stamps/yamato.html
sed -i 's/<h3>入場口</<h3>庭大和</g' stamps/yamato.html
sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = 'yamato'/g" stamps/yamato.html
sed -i 's/<title>入場口/<title>庭大和/g' stamps/yamato.html

# リズム館
sed -i 's/入場口のスタンプ/リズム館のスタンプ/g' stamps/rhythm.html
sed -i 's/#ffc0cb20/#87ceeb20/g' stamps/rhythm.html
sed -i 's/🏛️/🎵/g' stamps/rhythm.html
sed -i 's/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/音楽の世界へようこそ！/g' stamps/rhythm.html
sed -i 's/<h3>入場口</<h3>リズム館</g' stamps/rhythm.html
sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = 'rhythm'/g" stamps/rhythm.html
sed -i 's/<title>入場口/<title>リズム館/g' stamps/rhythm.html

# 体育館
sed -i 's/入場口のスタンプ/体育館のスタンプ/g' stamps/gym.html
sed -i 's/#ffc0cb20/#dda0dd20/g' stamps/gym.html
sed -i 's/🏛️/🏐/g' stamps/gym.html
sed -i 's/ようこそ文化祭へ！<br>.*素敵な一日をお過ごしください。/スポーツイベント開催中！/g' stamps/gym.html
sed -i 's/<h3>入場口</<h3>体育館</g' stamps/gym.html
sed -i "s/const STAMP_ID = 'entrance'/const STAMP_ID = 'gym'/g" stamps/gym.html
sed -i 's/<title>入場口/<title>体育館/g' stamps/gym.html

echo "All stamp pages updated successfully!"