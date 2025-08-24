#!/usr/bin/env bash
# スクリプト失敗時に即座に停止させる
set -euo pipefail

# results.jsonファイルのパスを定義
RESULTS_FILE="apps/app/test-results/results.json"

# ファイルの存在確認（最大10秒間リトライ）
for i in {1..10}; do
  if [ -f "$RESULTS_FILE" ]; then
    echo "results.jsonファイルが見つかりました: $RESULTS_FILE"
    break
  fi
  echo "results.jsonファイルが見つかりません。待機中... ($i/10)"
  sleep 1
done

# 最終的な存在確認
if [ ! -f "$RESULTS_FILE" ]; then
  echo "エラー: results.jsonファイルが見つかりません: $RESULTS_FILE"
  echo "json_exists=false" >> $GITHUB_OUTPUT
  exit 0
fi

# ファイルが空でないことを確認
if [ ! -s "$RESULTS_FILE" ]; then
  echo "エラー: results.jsonファイルが空です: $RESULTS_FILE"
  echo "json_exists=false" >> $GITHUB_OUTPUT
  exit 0
fi

# JSONファイルの有効性を確認
if ! jq . "$RESULTS_FILE" > /dev/null 2>&1; then
  echo "エラー: results.jsonファイルが無効なJSONです: $RESULTS_FILE"
  echo "json_exists=false" >> $GITHUB_OUTPUT
  exit 0
fi

# results.jsonから結果を解析
json_file="$RESULTS_FILE"
  
  # 基本統計情報の抽出
  total_tests=$(jq -r '.numTotalTests' "$json_file")
  passed_tests=$(jq -r '.numPassedTests' "$json_file")
  failed_tests=$(jq -r '.numFailedTests' "$json_file")
  pending_tests=$(jq -r '.numPendingTests' "$json_file")
  todo_tests=$(jq -r '.numTodoTests' "$json_file")
  success=$(jq -r '.success' "$json_file")
  start_time=$(jq -r '.startTime' "$json_file")
  
  # テストスイート情報の抽出
  total_suites=$(jq -r '.numTotalTestSuites' "$json_file")
  passed_suites=$(jq -r '.numPassedTestSuites' "$json_file")
  failed_suites=$(jq -r '.numFailedTestSuites' "$json_file")
  
  # 実行時間の計算（最新テスト結果の終了時間から開始時間を引く）
  if [ "$(jq -r '.testResults | length' "$json_file")" -gt 0 ]; then
    latest_end=$(jq -r '[.testResults[].endTime] | max | floor' "$json_file")
    duration_ms=$((latest_end - start_time))
    duration_sec=$((duration_ms / 1000))
  else
    duration_sec=0
  fi
  
  # 失敗したテストの詳細情報（存在する場合）
  failed_test_details=""
  if [ "$failed_tests" -gt 0 ]; then
    failed_test_details=$(jq -r '
      .testResults[] |
      select(.status == "failed") |
      "### ❌ 失敗したテストファイル: **\(.name | split("/") | last)**\n" +
      (.assertionResults[] |
        select(.status == "failed") |
        "- **\(.title)**: `\(.failureMessages[0] | split("\n")[0])`"
      ) + "\n"
    ' "$json_file" | head -20)  # Limit output length
  fi
  
  # GitHub Actions出力に設定
  echo "total_tests=$total_tests" >> $GITHUB_OUTPUT
  echo "passed_tests=$passed_tests" >> $GITHUB_OUTPUT
  echo "failed_tests=$failed_tests" >> $GITHUB_OUTPUT
  echo "pending_tests=$pending_tests" >> $GITHUB_OUTPUT
  echo "todo_tests=$todo_tests" >> $GITHUB_OUTPUT
  echo "success=$success" >> $GITHUB_OUTPUT
  echo "duration_sec=$duration_sec" >> $GITHUB_OUTPUT
  echo "total_suites=$total_suites" >> $GITHUB_OUTPUT
  echo "passed_suites=$passed_suites" >> $GITHUB_OUTPUT
  echo "failed_suites=$failed_suites" >> $GITHUB_OUTPUT
  
  # 失敗したテストの詳細をマルチライン出力として設定
  if [ -n "$failed_test_details" ]; then
    echo "failed_test_details<<EOF" >> $GITHUB_OUTPUT
    echo "$failed_test_details" >> $GITHUB_OUTPUT
    echo "EOF" >> $GITHUB_OUTPUT
  else
    echo "failed_test_details=" >> $GITHUB_OUTPUT
  fi
  
  echo "json_exists=true" >> $GITHUB_OUTPUT
  
  echo "Vitestテスト結果の解析が完了しました。"
  echo "総テスト数: $total_tests, 成功: $passed_tests, 失敗: $failed_tests"
