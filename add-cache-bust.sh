#!/bin/bash

# 全スタンプページにキャッシュバスティングを追加
for file in stamps/*.html; do
    if [ "$file" != "stamps/entrance.html" ]; then
        # メタタグを追加（titleタグの後に）
        sed -i '/<title>/a\    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n    <meta http-equiv="Pragma" content="no-cache">\n    <meta http-equiv="Expires" content="0">' "$file"
        
        # CSSにバージョンパラメータを追加
        sed -i 's/href="..\/css\/style.css"/href="..\/css\/style.css?v=2"/' "$file"
        
        echo "Updated: $file"
    fi
done

echo "Cache busting added to all stamp pages!"