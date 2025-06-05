#!/usr/bin/env bash
# outdated結果が空でないかチェック（環境変数経由で安全にJSON処理）
echo "$OUTDATED_RESULT" > outdated_temp.json

has_outdated=$(jq -r 'if . == {} then "false" else "true" end' outdated_temp.json)
echo "has_outdated=$has_outdated" >> $GITHUB_OUTPUT

if [ "$has_outdated" = "true" ]; then
  # 古いパッケージの数をカウント
  outdated_count=$(jq -r 'keys | length' outdated_temp.json)
  echo "outdated_count=$outdated_count" >> $GITHUB_OUTPUT
  
  # パッケージ名一覧を取得（表示用）
  outdated_packages=$(jq -r 'keys | join(", ")' outdated_temp.json)
  echo "outdated_packages=$outdated_packages" >> $GITHUB_OUTPUT
else
  echo "outdated_count=0" >> $GITHUB_OUTPUT
  echo "outdated_packages=" >> $GITHUB_OUTPUT
fi

# 一時ファイルを削除
rm -f outdated_temp.json

