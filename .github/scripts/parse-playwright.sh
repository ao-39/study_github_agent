#!/usr/bin/env bash
# apps/appのplaywright-results/results.jsonから結果を解析
if [ -f "apps/app/playwright-results/results.json" ]; then
  json_file="apps/app/playwright-results/results.json"
  
  # 基本統計情報の抽出
  total_suites=$(jq -r '.suites | length' "$json_file")
  total_tests=$(jq -r '[.suites[].specs[].tests] | flatten | length' "$json_file")
  
  # テスト結果の集計
  passed_tests=$(jq -r '[.suites[].specs[].tests[] | select(.results[0].status == "passed")] | length' "$json_file")
  failed_tests=$(jq -r '[.suites[].specs[].tests[] | select(.results[0].status == "failed")] | length' "$json_file")
  flaky_tests=$(jq -r '[.suites[].specs[].tests[] | select(.results[0].status == "flaky")] | length' "$json_file")
  skipped_tests=$(jq -r '[.suites[].specs[].tests[] | select(.results[0].status == "skipped")] | length' "$json_file")
  
  # 実行時間の計算（ミリ秒から秒に変換）
  duration_ms=$(jq -r '[.suites[].specs[].tests[].results[].duration] | add' "$json_file")
  duration_sec=$((duration_ms / 1000))
  
  # 成功率の計算
  if [ "$total_tests" -gt 0 ]; then
    success_rate=$(echo "scale=1; $passed_tests * 100 / $total_tests" | bc -l)
  else
    success_rate="0.0"
  fi
  
  # 失敗したテストの詳細情報（存在する場合）
  failed_test_details=""
  if [ "$failed_tests" -gt 0 ]; then
    failed_test_details=$(jq -r '
      .suites[] |
      .specs[] |
      select(.tests[].results[0].status == "failed") |
      "### ❌ 失敗したテストファイル: **\(.file | split("/") | last)**\n" +
      "- **\(.title)**: `\(.tests[].results[0].error.message // "詳細はレポートを確認してください")`\n"
    ' "$json_file" | head -20)  # Limit output length
  fi
  
  # ブラウザ別の実行状況（chrominumのみ実行の場合）
  browser_info="chromium"
  
  # GitHub Actions出力に設定
  echo "total_suites=$total_suites" >> $GITHUB_OUTPUT
  echo "total_tests=$total_tests" >> $GITHUB_OUTPUT
  echo "passed_tests=$passed_tests" >> $GITHUB_OUTPUT
  echo "failed_tests=$failed_tests" >> $GITHUB_OUTPUT
  echo "flaky_tests=$flaky_tests" >> $GITHUB_OUTPUT
  echo "skipped_tests=$skipped_tests" >> $GITHUB_OUTPUT
  echo "duration_sec=$duration_sec" >> $GITHUB_OUTPUT
  echo "success_rate=$success_rate" >> $GITHUB_OUTPUT
  echo "browser_info=$browser_info" >> $GITHUB_OUTPUT
  
  # 失敗したテストの詳細をマルチライン出力として設定
  if [ -n "$failed_test_details" ]; then
    echo "failed_test_details<<EOF" >> $GITHUB_OUTPUT
    echo "$failed_test_details" >> $GITHUB_OUTPUT
    echo "EOF" >> $GITHUB_OUTPUT
  else
    echo "failed_test_details=" >> $GITHUB_OUTPUT
  fi
  
  # 全体の成功状況
  if [ "$failed_tests" -eq 0 ]; then
    echo "overall_success=true" >> $GITHUB_OUTPUT
  else
    echo "overall_success=false" >> $GITHUB_OUTPUT
  fi
  
  echo "json_exists=true" >> $GITHUB_OUTPUT
else
  echo "json_exists=false" >> $GITHUB_OUTPUT
fi

