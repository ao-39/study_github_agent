# 開発コマンドリファレンス

このドキュメントでは、プロジェクトで利用可能な開発コマンドを詳細に説明します。

## 基本コマンド

### 依存関係管理

```bash
# 依存関係のインストール
pnpm install

# 特定のパッケージを追加
pnpm add <package-name>

# 開発依存関係として追加
pnpm add -D <package-name>

# 特定のパッケージにのみ依存関係を追加
pnpm --filter <package-name> add <dependency>
```

### 開発サーバー

```bash
# メインアプリケーション（apps/app）の開発サーバー起動
pnpm app dev

# 別のポートで起動
pnpm app dev -- --port 3001

# 全てのパッケージの開発サーバーを起動（該当する場合）
pnpm dev
```

### ビルド

```bash
# 全パッケージのビルド
pnpm build

# 特定のパッケージのみビルド
pnpm app build

# バンドル分析付きビルド
pnpm app build:analyze

# プレビューサーバーでビルド成果物を確認
pnpm app preview
```

#### 環境変数を使用したビルド

```bash
# PWA機能を無効にしてビルド
VITE_ENABLE_PWA=false pnpm app build

# GitHub Pages用ビルド
GITHUB_PAGES=true pnpm app build

# バンドル分析を有効にしてビルド
ANALYZE=true pnpm app build

# 複数の環境変数を組み合わせ
VITE_ENABLE_PWA=false GITHUB_PAGES=true pnpm app build
```

## 品質チェックコマンド

### リンティング

```bash
# 全パッケージのリンティング
pnpm lint

# 全パッケージのリンティング修正
pnpm lint:fix

# 単一パッケージでの実行も可能
pnpm app lint
pnpm app lint:fix
```

### フォーマット

```bash
# 全パッケージのフォーマットチェック
pnpm fmt

# 全パッケージのフォーマット修正
pnpm fmt:fix

# 単一パッケージでの実行も可能
pnpm app fmt
pnpm app fmt:fix
```

### スペルチェック

```bash
# 全パッケージのスペルチェック
pnpm spell

# 単一パッケージでの実行も可能
pnpm app spell
```

### 型チェック

```bash
# 全パッケージの型チェック
pnpm type-check

# 単一パッケージでの実行も可能
pnpm app type-check
```

## テストコマンド

### ユニットテスト（Vitest）

```bash
# 全パッケージのテスト実行
pnpm test

# CI用テスト実行（テストファイル不存在でもOK）
pnpm test:ci

# ウォッチモードでテスト実行
pnpm app test:watch

# カバレッジ付きテスト実行
pnpm app test:coverage
```

### E2E テスト（Playwright）

```bash
# E2Eテスト実行（Chromiumのみ、高速）
pnpm e2e

# 特定のブラウザでのみ実行
pnpm app e2e:chromium  # Chromiumのみ
pnpm app e2e:firefox   # Firefoxのみ

# ヘッド付きモード（ブラウザを表示）
pnpm app e2e:headed

# UIモード（インタラクティブ）
pnpm app e2e:ui

# テストレポートの表示
pnpm app exec playwright show-report
```

## 包括的チェックコマンド

### フルチェック

```bash
# 基本的なフルチェック（日常開発用）
pnpm fullcheck

# E2Eテスト込みの完全チェック（時間がかかる）
pnpm fullcheck:e2e

# プレコミットチェック（fullcheckと同じ）
pnpm run pre-commit
```

**フルチェックの実行内容**:

1. リンティング（ESLint）
2. フォーマットチェック（Prettier）
3. スペルチェック（cspell）
4. ビルド（TypeScript + Vite）
5. 単体テスト（Vitest）

**fullcheck:e2e の追加内容**:
- E2E テスト（Playwright）

### 使い分けの指針

- **日常開発**: `pnpm fullcheck` - 高速で包括的なチェック
- **リリース前**: `pnpm fullcheck:e2e` - E2E テスト込みの完全チェック
- **自動実行**: `pnpm run pre-commit` - Git コミット時に自動実行

## monorepo 操作コマンド

### ルートコマンド vs フィルターコマンド

```bash
# ルートpackage.jsonに定義されたコマンド（推奨）
pnpm lint      # 全パッケージでリンティング実行
pnpm test      # 全パッケージでテスト実行
pnpm build     # 全パッケージでビルド実行

# フィルターコマンド（特定パッケージのみ、または未定義コマンド）
pnpm --filter app dev              # 開発サーバー（ルートに未定義）
pnpm --filter app test:watch       # ウォッチモード（ルートに未定義）
pnpm --filter app lint             # 単一パッケージでのリンティング
```

### パッケージ指定実行

```bash
# 特定のパッケージでコマンド実行
pnpm --filter <package-name> <command>

# 例: appパッケージでdevサーバー起動
pnpm --filter app dev

# 例: eslint-configパッケージでビルド実行
pnpm --filter @study-github-agent/eslint-config build
```

### 設定パッケージについて

設定パッケージ（eslint-config、prettier-config）には scripts セクションがありません。Turborepo では、コマンドが定義されていないパッケージは自動的にスキップされるため、全パッケージ実行時に問題は発生しません。

```bash
# 設定パッケージではコマンドが未定義のため自動スキップ
pnpm build  # eslint-config、prettier-configは自動でスキップされる
```

### 全パッケージ実行

```bash
# 全パッケージでコマンド実行
pnpm -r <command>

# 例: 全パッケージでinstall実行
pnpm -r install

# 例: 全パッケージでclean実行
pnpm -r clean
```

### Turborepo 直接実行

```bash
# Turborepoで特定のタスクを実行
pnpm exec turbo run <task>

# 例: 全パッケージでビルドとテストを並列実行
pnpm exec turbo run build test

# 例: 変更されたパッケージのみでリンティング実行
pnpm exec turbo run lint --filter=[HEAD^1]
```

## CI/CD 関連コマンド

### CI 環境再現

```bash
# CI全体の実行（ローカルでのCI環境再現）
pnpm ci

# フォーマットチェック（CIと同じ）
pnpm fmt

# テストファイル未存在でもOKなテスト実行
pnpm exec turbo run test -- --passWithNoTests
```

### バンドル分析

```bash
# バンドル分析付きビルド実行
pnpm --filter app build:analyze

# 生成されたレポートを確認
# apps/app/bundle-report.html をブラウザで開く
```

**バンドル分析レポートの活用**:

- ツリーマップ表示でファイルサイズを視覚化
- 依存関係ライブラリのサイズ内訳を確認
- gzip・brotli 圧縮後のサイズ比較
- パフォーマンス最適化箇所の特定

## ユーティリティコマンド

### クリーンアップ

```bash
# ビルド成果物のクリーンアップ
pnpm clean

# 特定のパッケージのみ
pnpm --filter app clean

# node_modulesとキャッシュのクリーンアップ
pnpm store prune
pnpm exec turbo clean
```

### 依存関係分析

```bash
# 依存関係ツリーの表示
pnpm list

# 特定のパッケージの依存関係
pnpm --filter app list

# アウトデートなパッケージの確認
pnpm outdated
```

### API ドキュメント生成

```bash
# TypeDocでAPIドキュメント生成
pnpm typedoc

# 特定のアプリのみ
pnpm --filter app typedoc

# 生成されたドキュメントを確認
# apps/app/docs-api/index.html をブラウザで開く
```

**API ドキュメントの活用**:

- TypeScript ソースコードからの API リファレンス自動生成
- TSDoc コメントの内容を HTML 形式で表示
- 関数・クラス・型の詳細情報と使用例を提供
- CI/CD でのレポート生成とダウンロード配布

## デバッグ・トラブルシューティング

### ログレベル調整

```bash
# 詳細ログ付きでコマンド実行
pnpm --loglevel=debug <command>

# Turborepoの詳細ログ
pnpm exec turbo run <task> --verbosity=2
```

### キャッシュ管理

```bash
# Turborepoキャッシュの表示
pnpm exec turbo run <task> --dry

# キャッシュを無視して実行
pnpm exec turbo run <task> --force

# キャッシュのクリア
pnpm exec turbo clean
```

### 環境診断

```bash
# pnpm環境の確認
pnpm config list

# Node.js・pnpmバージョン確認
node --version
pnpm --version

# Volta設定確認（使用している場合）
volta list
```

## 開発効率化の Tips

### よく使うエイリアス例

```bash
# .bashrc または .zshrc に追加推奨
alias pdev="pnpm --filter app dev"
alias pbuild="pnpm --filter app build"
alias ptest="pnpm --filter app test"
alias pcheck="pnpm fullcheck"
```

### VS Code 統合

- **タスク設定**: `.vscode/tasks.json` でコマンドをタスク化
- **デバッグ設定**: `.vscode/launch.json` でテストデバッグ設定
- **拡張機能**: ESLint、Prettier、TypeScript 拡張機能の活用

このコマンドリファレンスを活用して、効率的な開発を行ってください。
