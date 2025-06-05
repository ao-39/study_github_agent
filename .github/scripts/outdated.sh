#!/usr/bin/env bash
# pnpm outdatedの実行とJSON結果の取得（全ワークスペースを対象）
pnpm outdated --format json --recursive > outdated_output.json 2>/dev/null || true
if [ -s outdated_output.json ] && jq empty outdated_output.json 2>/dev/null; then
  outdated_result=$(cat outdated_output.json)
else
  outdated_result='{}'
fi
echo "outdated_result<<EOF" >> $GITHUB_OUTPUT
echo "$outdated_result" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT
rm -f outdated_output.json

