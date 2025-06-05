#!/usr/bin/env bash
# audit結果からメタデータ情報を抽出（環境変数経由で安全にJSON処理）
echo "$AUDIT_RESULT" > audit_temp.json

total_deps=$(jq -r '.metadata.totalDependencies' audit_temp.json)
critical=$(jq -r '.metadata.vulnerabilities.critical' audit_temp.json)
high=$(jq -r '.metadata.vulnerabilities.high' audit_temp.json)
moderate=$(jq -r '.metadata.vulnerabilities.moderate' audit_temp.json)
low=$(jq -r '.metadata.vulnerabilities.low' audit_temp.json)
info=$(jq -r '.metadata.vulnerabilities.info' audit_temp.json)

total_vulns=$((critical + high + moderate + low + info))

echo "total_deps=$total_deps" >> $GITHUB_OUTPUT
echo "critical=$critical" >> $GITHUB_OUTPUT
echo "high=$high" >> $GITHUB_OUTPUT
echo "moderate=$moderate" >> $GITHUB_OUTPUT
echo "low=$low" >> $GITHUB_OUTPUT
echo "info=$info" >> $GITHUB_OUTPUT
echo "total_vulns=$total_vulns" >> $GITHUB_OUTPUT

# advisoriesが空でないかチェック
has_advisories=$(jq -r 'if .advisories == {} then "false" else "true" end' audit_temp.json)
echo "has_advisories=$has_advisories" >> $GITHUB_OUTPUT

# 一時ファイルを削除
rm -f audit_temp.json

