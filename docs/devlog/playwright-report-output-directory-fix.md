# PlaywrightレポートのE2Eテスト出力ディレクトリ構成とCIアップロード問題修正

## 指示内容

CIでE2Eテストのレポートがアップロードできていない問題を確認し修正。要求事項:
- result.jsonとHTMLレポートを`/apps/app/reports/`の中に別々で出力
- CIでのレポートアップロード機能を修正

## 発生問題

### 問題1: レポート出力ディレクトリの分散
- HTMLレポート: `playwright-report` ディレクトリ
- JSONレポート: `playwright-results/results.json` ディレクトリ
- 統一されたディレクトリ構成になっていない

### 問題2: CIでのアップロード設定
- `apps/app/playwright-report/`をアップロード対象にしていた
- JSONレポートのアップロードが設定されていない

### 問題3: 関連ファイルの整合性
- `.gitignore`で古いディレクトリ名を指定
- CIスクリプトで古いパスを参照

## 対応内容

### 1. playwright.config.ts修正

**修正前:**
```typescript
reporter: process.env.CI
  ? [
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['json', { outputFile: 'playwright-results/results.json' }],
      ['list'],
    ]
  : [
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
outputDir: 'playwright-results',
```

**修正後:**
```typescript
reporter: process.env.CI
  ? [
      ['html', { outputFolder: 'reports/html', open: 'never' }],
      ['json', { outputFile: 'reports/json/results.json' }],
      ['list'],
    ]
  : [
      ['list'],
      ['html', { outputFolder: 'reports/html', open: 'never' }],
    ],
outputDir: 'reports/artifacts',
```

### 2. CIワークフロー修正 (.github/workflows/ci.yml)

**HTMLレポートアップロード修正:**
```yaml
- name: PlaywrightテストレポートのArtifactsアップロード（PR時のみ）
  if: always() && github.event_name == 'pull_request'
  uses: actions/upload-artifact@v4
  with:
    name: playwright-html-report-${{ github.event.pull_request.number }}
    path: apps/app/reports/html/  # 修正: playwright-report/ → reports/html/
    retention-days: 14
```

**JSONレポートアップロード追加:**
```yaml
- name: PlaywrightテストJSONレポートのArtifactsアップロード（PR時のみ）
  if: always() && github.event_name == 'pull_request'
  uses: actions/upload-artifact@v4
  with:
    name: playwright-json-report-${{ github.event.pull_request.number }}
    path: apps/app/reports/json/
    retention-days: 14
```

**PRコメント内の説明更新:**
- HTMLレポートとJSONレポートの両方をダウンロード可能と説明
- 各レポートの用途を明記

### 3. CIスクリプト修正 (.github/scripts/parse-playwright.sh)

**修正前:**
```bash
if [ -f "apps/app/playwright-results/results.json" ]; then
  json_file="apps/app/playwright-results/results.json"
```

**修正後:**
```bash
if [ -f "apps/app/reports/json/results.json" ]; then
  json_file="apps/app/reports/json/results.json"
```

### 4. .gitignore修正

**修正前:**
```gitignore
# Testing
coverage
test-results
playwright-report
playwright-results
```

**修正後:**
```gitignore
# Testing
coverage
test-results
reports
```

## 対応結果

### 成功項目
1. **統一ディレクトリ構成**: `/apps/app/reports/`配下に整理
   - `reports/html/`: HTMLレポート
   - `reports/json/`: JSONレポート (results.json)
   - `reports/artifacts/`: テスト実行時の成果物（スクリーンショット、ビデオ等）

2. **CIアップロード改善**: HTMLとJSONの両方をアップロード可能

3. **設定ファイル整合性**: 関連するすべてのファイルのパス統一

### 技術的成果
- Playwrightの設定体系化により保守性向上
- CIでのレポート取得の確実性向上
- JSONレポートによるプログラム処理への対応

## 学習事項

### 重要な知見
1. **Playwrightレポート設定の柔軟性**: 
   - HTMLとJSONで別々の出力ディレクトリ指定可能
   - `outputDir`はテスト実行時の成果物用（スクリーンショット等）

2. **CI/CDでのファイル整合性の重要性**:
   - 設定変更時は関連するすべてのファイルを確認
   - CIスクリプト、設定ファイル、gitignoreの連携

3. **GitHub ActionsのArtifacts管理**:
   - 同一PR番号で複数のArtifactsを分けて管理可能
   - retention-days設定によるストレージ効率化

### ベストプラクティス
- **ディレクトリ命名**: 用途別に明確な命名（html, json, artifacts）
- **変更影響範囲の確認**: 設定変更時の関連ファイル全体チェック
- **CIでのエラーハンドリング**: `if: always()`による確実なレポート取得

### 追加対応: ローカル環境でのHTMLレポート生成問題

**問題発見**: `pnpm e2e`実行時にHTMLレポートが出力されない

**原因**: ローカル環境（`process.env.CI`未設定）でHTMLレポーターが含まれていなかった

**修正内容**:
```typescript
// 修正前: ローカル環境ではHTMLレポート生成なし
: [
    ['list'], // ローカル環境でもコンソールに結果を表示して自動終了
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],

// 修正後: ローカル環境でもHTMLレポート生成
: [
    ['html', { outputFolder: 'reports/html', open: 'never' }], // ローカル環境でもHTMLレポート生成
    ['list'], // ローカル環境でもコンソールに結果を表示して自動終了
  ],
```

**結果**: ローカル開発時も`apps/app/reports/html/`にHTMLレポートが生成される

### 追加対応: テスト成果物の記録強化

**要求**: `pnpm e2e`実行時もテスト成果物（スクリーンショット、ビデオ、トレース）を記録したい

**修正内容**:
```typescript
// 修正前: 失敗時のみ記録
screenshot: 'only-on-failure',
video: 'retain-on-failure',
trace: 'on-first-retry',

// 修正後: 全ての成果物を常に記録
screenshot: 'on',
video: 'on',
trace: 'on',
```

**CIでの成果物保持追加**:
- HTMLレポート: `playwright-html-report-{PR番号}`
- JSONレポート: `playwright-json-report-{PR番号}`
- テスト成果物: `playwright-test-artifacts-{PR番号}` (新規追加)

**結果**: 
- ローカル開発時: `reports/artifacts/`に全テストの詳細記録
- CI環境: 効率性を保ちつつ必要な成果物をArtifactsで保持

### 今後の改善点
- E2Eテスト実行結果のSlack通知連携の検討
- レポートの長期保存戦略（重要なマイルストーン時）
- 複数ブラウザでのテスト実行時のレポート統合方法