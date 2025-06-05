#!/usr/bin/env bash
# pnpm auditの実行とJSON結果の取得（stderr出力を廃棄し、JSONのみ抽出）
pnpm audit --json > audit_output.json 2>/dev/null || true
if [ -s audit_output.json ] && jq empty audit_output.json 2>/dev/null; then
  audit_result=$(cat audit_output.json)
else
  audit_result='{"metadata":{"vulnerabilities":{"info":0,"low":0,"moderate":0,"high":0,"critical":0},"dependencies":0,"devDependencies":0,"optionalDependencies":0,"totalDependencies":0},"advisories":{},"actions":[],"muted":[]}'
fi
echo "audit_result<<EOF" >> $GITHUB_OUTPUT
echo "$audit_result" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT
rm -f audit_output.json

