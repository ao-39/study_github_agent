# CI/CD パイプライン

このドキュメントでは、GitHub Actions を使用した継続的インテグレーション・継続的デプロイメント（CI/CD）パイプラインの詳細を説明します。

## CI/CD の基本方針

### 自動化の目標

- **品質保証**: コードの品質を自動的にチェックし、問題を早期発見
- **高速フィードバック**: 開発者が迅速に問題を把握し、修正できる環境
- **一貫性**: 全ての環境で同じプロセスで実行し、環境差異を排除
- **効率性**: 手動作業を最小限に抑え、ヒューマンエラーを防止

## パイプライン構成

### 実行タイミング

- **Pull Request 作成・更新時**: コードレビュー前の自動品質チェック
- **main ブランチプッシュ時**: マージ後の最終確認と本番展開準備、リリース作成
- **手動実行**: 必要に応じて任意のタイミングでの実行

### 環境セットアップ

- **Node.js**: 24（最新 LTS）
- **pnpm**: 10.11.0
- **OS**: ubuntu-latest

## CI/CD ワークフロー詳細

### 1. 環境準備

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "24"

- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10.11.0
    run_install: false
```

### 2. キャッシュ戦略

```yaml
- name: Get pnpm store directory
  shell: bash
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-

- name: Setup Turborepo cache
  uses: actions/cache@v4
  with:
    path: .turbo
    key: ${{ runner.os }}-turbo-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### 3. 依存関係インストール

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

### 4. 品質チェック項目

#### リンティング（ESLint）

```yaml
- name: Lint
  run: pnpm lint
```

**実行内容**:

- ESLint 9.x（Flat Config）による静的解析
- TypeScript、React、React Hooks のルール適用
- 警告 0 件での厳格なチェック

#### フォーマットチェック（Prettier）

```yaml
- name: Format check
  run: pnpm run format:check
```

**実行内容**:

- Prettier によるコードスタイルチェック
- package.json の順序チェック

#### スペルチェック（cspell）

```yaml
- name: Spell check
  run: pnpm spell-check
```

**実行内容**:

- 英語スペリングの自動チェック
- 技術用語辞書による精度向上

#### 型チェック（TypeScript）

```yaml
- name: Type check
  run: pnpm type-check
```

**実行内容**:

- TypeScript の型安全性チェック
- コンパイル時エラーの検出

### 5. ビルド

```yaml
- name: Build
  run: pnpm build
```

**実行内容**:

- TypeScript コンパイル
- Vite による本番ビルド
- バンドル最適化

#### バンドル分析（PR 時のみ）

```yaml
- name: Build with bundle analysis
  if: github.event_name == 'pull_request'
  run: pnpm --filter app build:analyze

- name: Upload bundle analysis
  if: github.event_name == 'pull_request'
  uses: actions/upload-artifact@v4
  with:
    name: bundle-analysis-report-v${{ github.run_number }}
    path: apps/app/bundle-report.html
    retention-days: 14
```

### 6. テスト実行

#### ユニットテスト（Vitest）

```yaml
- name: Test
  run: pnpm exec turbo run test -- --passWithNoTests
```

**実行内容**:

- Vitest による高速テスト実行
- コードカバレッジ計測
- HTML レポート生成

#### E2E テスト（Playwright）

```yaml
- name: Install Playwright browsers
  run: pnpm --filter app exec playwright install chromium

- name: Run E2E tests
  run: pnpm --filter app test:e2e:chromium
```

**実行内容**:

- Chromium でのクロスブラウザテスト
- 実際のユーザー操作シミュレーション
- スクリーンショット・動画による証跡

### 7. テストレポート Artifacts

#### Pull Request 時のレポート作成

```yaml
- name: Upload test reports
  if: always() && github.event_name == 'pull_request'
  uses: actions/upload-artifact@v4
  with:
    name: test-reports-v${{ github.run_number }}
    path: |
      apps/app/test-results/
      apps/app/playwright-report/
    retention-days: 14
```

**含まれるレポート**:

- **Vitest レポート**: ユニットテストの実行結果、カバレッジ詳細
- **Playwright レポート**: E2E テストの実行結果、スクリーンショット
- **保存期間**: 14 日間

## 本番デプロイメント

### GitHub Pages 自動デプロイ

**トリガー**: main ブランチへのプッシュ

```yaml
- name: Build for GitHub Pages
  run: |
    cd apps/app
    GITHUB_PAGES=true pnpm build

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: apps/app/dist
```

**機能**:

- **本番デプロイ**: main ブランチのマージ時に自動実行
- **PR プレビュー**: Pull Request 作成時にビルド確認
- **GitHub Pages 最適化**: ベースパス設定による正しいリソース参照
- **自動 URL 通知**: PR コメントでデプロイメント URL を表示

**デプロイメント URL**: https://ao-39.github.io/study_github_agent/

### Cloudflare Pages 自動デプロイ

**トリガー**: Pull Request 作成・更新、main ブランチプッシュ

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy apps/app/dist --project-name=study-github-agent
```

**機能**:

- **PR プレビューデプロイ**: Pull Request 作成・更新時に自動プレビュー環境構築
- **本番デプロイ**: main ブランチマージ時に本番環境へ自動デプロイ
- **自動コメント**: PR にプレビュー URL とデプロイ情報を自動投稿
- **ブランチ別環境**: PR ごとに独立したプレビュー環境
- **高速 CDN**: Cloudflare のグローバルネットワーク活用

**デプロイメント URL**:

- **本番環境**: https://study-github-agent.pages.dev
- **プレビュー環境**: https://{branch-name}--study-github-agent.pages.dev

## リリース自動化

### GitHub Release 作成

**トリガー**: main ブランチへのプッシュ

```yaml
- name: Create Release
  uses: softprops/action-gh-release@v2
  with:
    tag_name: v${{ github.run_number }}
    name: Release v${{ github.run_number }}
    files: |
      study-github-agent-app-v${{ github.run_number }}.zip
      vitest-report-v${{ github.run_number }}.zip
      playwright-report-v${{ github.run_number }}.zip
      bundle-analysis-report-v${{ github.run_number }}.zip
```

**機能**:

- **自動タグ付け**: `v{run_number}` 形式でのタグ作成
- **ビルド成果物添付**: apps/app の dist ディレクトリを zip ファイルで添付
- **テストレポート添付**: Vitest、Playwright、バンドル分析レポートを添付
- **リリースノート生成**: コミット履歴を基にした自動リリースノート作成
- **永続的なダウンロード URL**: `/releases/latest` から常に最新版を取得可能

## パフォーマンス最適化

### キャッシュ戦略詳細

#### pnpm ストアキャッシュ

- **目的**: 依存関係インストール時間の大幅短縮
- **キーセット**: OS + pnpm-lock.yaml ハッシュ
- **ヒット率**: 95%以上（依存関係変更時以外）

#### Turborepo キャッシュ

- **目的**: ビルド・テスト結果の効率的な再利用
- **キーセット**: OS + Git SHA ハッシュ
- **スコープ**: パッケージ単位での増分キャッシュ

### 並列実行最適化

#### monorepo 対応

- **Turborepo の活用**: 変更されたパッケージのみビルド・テスト
- **依存関係グラフ**: パッケージ間の依存関係を考慮した最適な実行順序
- **増分ビルド**: 前回の実行結果を活用した効率的な CI

#### GitHub Actions 並列化

```yaml
strategy:
  matrix:
    node-version: [24]
    shard: [1, 2]
```

## 品質ゲート基準

### 必須チェック項目

- **ESLint エラー 0 件**: コーディング規約の完全遵守
- **TypeScript エラー 0 件**: 型安全性の保証
- **フォーマットチェック**: コードスタイルの統一
- **ビルド成功**: 本番環境への展開可能性確認
- **テスト通過**: 全ての自動テストが正常に実行

### 警告の扱い

- **ESLint 警告**: 可能な限り 0 件を目指すが、一部許容
- **TypeScript 警告**: 原則として修正対象
- **フォーマット警告**: 自動修正により必ず解決

## セキュリティ考慮事項

### GitHub Secrets 管理

- **CLOUDFLARE_API_TOKEN**: Cloudflare API 認証
- **CLOUDFLARE_ACCOUNT_ID**: Cloudflare アカウント識別子
- **GITHUB_TOKEN**: 自動提供される標準トークン

### 権限管理

- **最小権限の原則**: 必要最小限の権限での CI 実行
- **トークンスコープ**: 各 Secrets の使用範囲を限定
- **監査ログ**: GitHub Actions の実行履歴による追跡可能性

## 監視・アラート

### 実行監視

- **CI 実行時間**: 定期的な実行時間の測定と改善
- **成功率**: CI 成功率の追跡と問題分析
- **キャッシュ効率**: キャッシュヒット率の監視

### 失敗時の対応

- **自動リトライ**: 一時的な障害に対する自動再実行
- **失敗通知**: Slack/Email 通知（設定により）
- **ログ分析**: 詳細なエラーログによる問題特定

## GitHub Copilot Coding Agent 対応

### 専用環境設定

```yaml
# .github/workflows/copilot-setup-steps.yml
name: Copilot Setup Steps
on:
  workflow_dispatch:

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 24
        uses: actions/setup-node@v4
        with:
          node-version: "24"
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.11.0
```

**目的**: GitHub Copilot coding agent の開発環境セットアップ検証

## CI/CD 最適化の継続的改善

### 定期レビュー項目

- **月次レビュー**: CI/CD プロセスの効果と課題の確認
- **改善提案**: チームからのフィードバック収集と反映
- **技術アップデート**: 新しい CI/CD 技術の評価と導入検討

### メトリクス収集

- **実行時間変化**: CI 実行時間の推移追跡
- **コスト効率**: GitHub Actions 実行時間の最適化
- **開発者満足度**: CI/CD プロセスに対するフィードバック

この包括的な CI/CD パイプラインにより、高品質なコードの継続的なデリバリーを実現しています。
