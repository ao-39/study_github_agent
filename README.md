# study_github_agent

## 目的

このリポジトリはGitHub Copilot agentを試すためのリポジトリです。

## 学習目標

このリポジトリを通じて以下の学習を目指します：

- **GitHub Copilot Agentの基本操作** - エージェントとの効果的なやり取り方法
- **monorepo構成の理解** - apps/packages構成でのプロジェクト管理
- **モダンフロントエンド開発** - React + TypeScript + Viteの組み合わせ
- **開発ツールチェーン** - ESLint、Prettier、テスト環境の構築と運用
- **CI/CDパイプライン** - GitHub Actionsを使った自動化
- **コラボレーション** - GitHub Copilotを活用したチーム開発

## ディレクトリ構造

```
study_github_agent/
├── .github/                    # GitHub関連の設定ファイル
│   └── copilot-instructions.md # GitHub Copilotの動作設定
├── apps/                       # アプリケーションパッケージ
│   └── app/                    # Reactアプリケーション（Vite + React + TypeScript）
├── docs/                       # プロジェクトドキュメント
│   ├── github-pages-setup.md  # GitHub Pages設定ガイド
│   └── cloudflare-pages-setup.md # Cloudflare Pages設定ガイド
├── packages/                   # 共有ライブラリパッケージ（予定）
├── package.json                # monorepo設定とTurborepo
├── pnpm-workspace.yaml         # pnpm workspace設定
├── turbo.json                  # Turborepo設定
└── README.md                   # プロジェクトドキュメント
```

### 主要ディレクトリ説明

#### `.github/`
GitHub関連の設定ファイルを格納するディレクトリです。
- `copilot-instructions.md`: GitHub Copilotエージェントの動作設定とインストラクション
- `workflows/copilot-setup-steps.yml`: Copilot coding agent用の開発環境セットアップ

#### `apps/`
単体で動作するアプリケーションパッケージを設置するディレクトリです。
- `app/`: Vite + React + TypeScriptで構築されたメインアプリケーション

#### `packages/`
appsのパッケージから利用される共有ライブラリパッケージを設置するディレクトリです。

現在の共有パッケージ：
- `eslint-config/`: ESLint設定パッケージ（@study-github-agent/eslint-config）
- `prettier-config/`: Prettier設定パッケージ（@study-github-agent/prettier-config）

#### `docs/`
プロジェクトの設定ガイドやドキュメントを格納するディレクトリです。
- `github-pages-setup.md`: GitHub Pages自動デプロイの設定ガイド
- `cloudflare-pages-setup.md`: Cloudflare Pages自動デプロイの設定ガイド

## アーキテクチャ

本プロジェクトはmonorepo構成で構築されています。

### `apps/app`
Reactアプリケーションを設置します。Vite + React + TypeScriptで構築されており、モダンなフロントエンド開発環境を提供します。

### `packages/`
ライブラリとしてappsのパッケージに利用されるパッケージを設置します。

#### 共有設定パッケージ

##### @study-github-agent/eslint-config
TypeScript + React対応のESLint設定パッケージです。

**特徴：**
- TypeScript、React、React Hooksに対応
- ESLint推奨 + TypeScript推奨 + React Hooksルールを含む
- console.log警告、未使用変数警告などのカスタムルールを追加

**使用方法：**
```javascript
// .eslintrc.js
module.exports = {
  extends: ['@study-github-agent/eslint-config']
}
```

##### @study-github-agent/prettier-config
プロジェクト統一のPrettier設定パッケージです。

**特徴：**
- セミコロンなし、シングルクォート、タブ幅2などの統一設定
- 既存のapps/appの設定を踏襲

**使用方法：**
```json
// package.json
{
  "prettier": "@study-github-agent/prettier-config"
}
```

## 技術スタック

### Node.jsバージョン管理
Node.jsのバージョン管理にはvoltaを利用します。

### パッケージマネージャー
パッケージマネージャーはpnpmを利用します。
pnpmのバージョン管理もいずれはvoltaを利用する予定です。

**重要**: パッケージマネージャーにpnpm以外を利用することは禁止します。
出来るだけ、pnpm以外のパッケージマネージャーを利用した際はコマンドが動かないでフェイルセーフになるようにします。

### 開発ツール
- **lint**: eslintを利用します
- **format**: prettierを利用します  
- **スペルチェック**: cspellを利用します

**共有設定パッケージ**：ESLintとPrettierの設定は`packages/`ディレクトリに共有パッケージとして配置されています。
- `@study-github-agent/eslint-config`: TypeScript + React対応のESLint設定
- `@study-github-agent/prettier-config`: プロジェクト統一のPrettier設定

### テスト
- **E2Eテスト**: playwrightを利用してテストを作成し、CI/CDパイプラインで自動実行しています（標準装備）
  - **HTMLレポート**: テスト実行時に詳細なHTMLレポートを自動生成
  - **スクリーンショット**: 失敗時の画面状態を自動キャプチャ
  - **マルチブラウザ対応**: Chromium、Firefox、Safariでの動作確認
- **ユニットテスト**: vitestを利用してReactコンポーネントやロジックをテスト
  - **カバレッジレポート**: テストカバレッジの詳細HTMLレポート生成
- **コードカバレッジ**: vitestで自動カバレッジ計測、HTMLレポート生成対応
- **モック**: mswを利用します

### ビルドツール
- **vite**: ビルドツールとして利用します
- **vitest**: テストランナーとして利用します
- **turbo**: monorepoのタスクランナーとして利用します
- **rollup-plugin-visualizer**: バンドルサイズ分析とレポート生成に利用します

### CI/CD
GitHub Actionsを使用して包括的なCI/CDパイプラインを構築しています。

#### 実行タイミング
- **Pull Request作成時**: コードレビュー前の自動品質チェック
- **mainブランチプッシュ時**: マージ後の最終確認と本番展開準備、リリース作成

#### CI実行項目
**通常のCI/CD環境**:
1. **環境セットアップ**: Node.js 24 + pnpm 10.11.0
2. **依存関係インストール**: `pnpm install`
3. **リンティング**: `pnpm lint` (ESLint)
4. **フォーマットチェック**: Prettier + package.json順序チェック
5. **型チェック**: `pnpm type-check` (TypeScript)
6. **ビルド**: `pnpm build` (Vite + TypeScript)
7. **バンドル分析レポート生成**: `pnpm build:analyze` (rollup-plugin-visualizer, PR時のみ)
8. **テスト実行**: `pnpm test --passWithNoTests` (Vitest)
9. **E2Eテスト実行**: `pnpm test:e2e:chromium` (Playwright)

#### テストレポートArtifacts
Pull Request作成時には、テスト結果の詳細なHTMLレポートがGitHub ArtifactsとしてPRに自動添付されます。

**保存されるレポート**:
- **Vitestテストレポート**: ユニットテストの実行結果、カバレッジ情報、実行時間詳細
- **Playwrightテストレポート**: E2Eテストの実行結果、スクリーンショット、各ブラウザでの動作確認結果

**レポートの確認方法**:
1. PRページでCIが完了後、自動コメントのリンクからGitHub Actionsページにアクセス
2. ページ下部の「Artifacts」セクションからHTMLレポートをダウンロード
3. ローカルでHTMLファイルを開いて詳細な結果を確認

**保存期間**: 14日間

#### パフォーマンス最適化
- **pnpmキャッシュ**: 依存関係のインストール時間を大幅短縮
- **Turborepoキャッシュ**: ビルド・テスト結果をキャッシュして増分実行
- **monorepo対応**: 変更されたパッケージのみ効率的に処理

#### 品質ゲート
- **ESLintエラー0件**: コーディング規約の完全遵守
- **TypeScriptエラー0件**: 型安全性の保証
- **ビルド成功**: 本番環境への展開可能性確認
- **テスト通過**: 全ての自動テストが正常に実行
- **E2Eテスト通過**: ブラウザ実行環境での統合テストが正常に実行

#### GitHub Pages自動デプロイ
mainブランチへのプッシュ時に、apps/appのビルド成果物をGitHub Pagesに自動デプロイします。

**デプロイ機能**:
- **本番デプロイ**: mainブランチのマージ時に自動実行
- **PRプレビュー**: Pull Request作成時にビルド確認とコメント投稿
- **GitHub Pages用最適化**: ベースパス設定による正しいリソース参照
- **自動URL通知**: PRコメントで本番デプロイメントURLを表示

**デプロイメントURL**: https://ao-39.github.io/study_github_agent/

**PRでの確認プロセス**:
1. PR作成時にGitHub Pages用ビルドが実行される
2. ビルド成功後、PRに自動コメントでデプロイメント情報が投稿される
3. メインブランチにマージされると本番環境に自動デプロイされる

#### Cloudflare Pages自動デプロイ
Pull Request作成時とmainブランチマージ時に、apps/appのビルド成果物をCloudflare Pagesに自動デプロイします。

**デプロイ機能**:
- **PRプレビューデプロイ**: Pull Request作成・更新時に自動的にプレビュー環境を構築
- **本番デプロイ**: mainブランチマージ時に本番環境へ自動デプロイ
- **自動コメント**: PRにプレビューURLとデプロイ情報を自動投稿
- **ブランチ別環境**: PRごとに独立したプレビュー環境を提供
- **高速CDN**: Cloudflareのグローバルネットワークによる高速配信

**デプロイメントURL**:
- **本番環境**: https://study-github-agent.pages.dev
- **プレビュー環境**: https://{branch-name}--study-github-agent.pages.dev

**PRでの確認プロセス**:
1. PR作成時にCloudflare Pagesワークフローが自動実行される
2. アプリケーションがビルドされ、Cloudflare Pagesにデプロイされる
3. PRに自動コメントでプレビューURLとデプロイ情報が投稿される
4. プレビューURLから即座にアプリケーションを確認可能
5. メインブランチにマージされると本番環境に自動デプロイされる

**設定要件**:
- Cloudflare API Token (GitHub Secrets: `CLOUDFLARE_API_TOKEN`)
- Cloudflare Account ID (GitHub Secrets: `CLOUDFLARE_ACCOUNT_ID`)
- 詳細な設定手順: [Cloudflare Pages設定ガイド](docs/cloudflare-pages-setup.md)

#### リリース自動化
mainブランチへのプッシュ時に、apps/appのビルド成果物と各種テストレポートを含むGitHub Releaseを自動作成します。

**リリース機能**:
- **自動タグ付け**: `v{run_number}` 形式でのタグ作成
- **ビルド成果物添付**: apps/appのdistディレクトリをzipファイルとして添付
- **テストレポート添付**: Vitest、Playwright、バンドル分析レポートを添付
- **リリースノート生成**: コミット履歴を基にした自動リリースノート作成
- **永続的なダウンロードURL**: `/releases/latest` から常に最新版を取得可能

**含まれるファイル**:
- **study-github-agent-app-v{run_number}.zip**: アプリケーションのビルド成果物
- **vitest-report-v{run_number}.zip**: Vitestユニットテストの詳細HTMLレポート
- **playwright-report-v{run_number}.zip**: Playwright E2Eテストの詳細HTMLレポート
- **bundle-analysis-report-v{run_number}.zip**: JavaScriptバンドルサイズ分析レポート

**ダウンロード方法**:
```bash
# 最新のビルド成果物を取得
curl -L https://github.com/ao-39/study_github_agent/releases/latest/download/study-github-agent-app-v*.zip -o study-github-agent-app.zip

# 最新のVitestレポートを取得
curl -L https://github.com/ao-39/study_github_agent/releases/latest/download/vitest-report-v*.zip -o vitest-report.zip

# 最新のPlaywrightレポートを取得
curl -L https://github.com/ao-39/study_github_agent/releases/latest/download/playwright-report-v*.zip -o playwright-report.zip

# 最新のバンドル分析レポートを取得
curl -L https://github.com/ao-39/study_github_agent/releases/latest/download/bundle-analysis-report-v*.zip -o bundle-analysis-report.zip
```

#### GitHub Copilot Coding Agent 環境設定
このリポジトリはGitHub Copilot coding agentに対応した開発環境設定を提供しています。

**Copilot Agent用の環境仕様**:
- **Node.js**: 24 (最新LTS)
- **pnpm**: 10.11.0
- **セットアップファイル**: `.github/workflows/copilot-setup-steps.yml`

Copilot agentは独自の一時的な開発環境でコードの探索、変更、テスト実行を行います。
この環境は通常のCI/CDとは独立して動作し、最新の技術スタックを使用して効率的な開発をサポートします。

**手動テスト**: リポジトリの「Actions」タブから `Copilot Setup Steps` ワークフローを手動実行してセットアップをテストできます。

#### バンドル分析機能
PR作成時にJavaScriptバンドルのサイズ分析を自動実行し、詳細なレポートを提供します。

**機能内容**:
- **バンドル分析レポート**: rollup-plugin-visualizerによる詳細なサイズ分析
- **自動レポート生成**: PR作成時にCI環境で自動実行
- **Artifactsダウンロード**: GitHub ActionsからHTMLレポートをダウンロード可能
- **ツリーマップ表示**: 依存関係とファイルサイズの視覚的な表示

**CI/CDでの実行フロー**:
1. PR作成時にバンドル分析ビルドを実行
2. `bundle-report.html` ファイルを生成
3. GitHub Artifactsにレポートをアップロード
4. PRコメントでダウンロードリンクと分析結果の説明を自動投稿

**レポート内容**:
- JavaScriptバンドルサイズの詳細内訳
- 依存関係ライブラリのサイズ貢献度
- gzip・brotli圧縮後のサイズ比較
- パフォーマンス最適化の指針

## 環境要件

### 必須環境
- **Node.js**: 最新のLTS版（推奨）
- **Volta**: Node.jsバージョン管理
- **pnpm**: パッケージマネージャー（yarn、npmの使用は禁止）

### 推奨環境
- **エディタ**: Visual Studio Code + GitHub Copilot拡張機能
- **OS**: macOS、Linux、Windows（WSL2推奨）

## インストール・セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/ao-39/study_github_agent.git
cd study_github_agent
```

### 2. Voltaのインストール（未インストールの場合）
```bash
# macOS/Linux
curl https://get.volta.sh | bash

# Windows
# 公式サイトからインストーラーをダウンロード
```

### 3. Node.jsとpnpmのインストール
```bash
# Voltaを使ってNode.jsをインストール
volta install node

# pnpmをグローバルインストール
volta install pnpm
```

### 4. 依存関係のインストール
```bash
# プロジェクトルートで実行
pnpm install
```

## 開発コマンド

### 基本コマンド
```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動（apps/app）
pnpm --filter app dev

# ビルド
pnpm --filter app build

# バンドル分析付きビルド
pnpm --filter app build:analyze

# テスト実行
pnpm --filter app test

# テスト実行（コードカバレッジ付き）
pnpm --filter app test:coverage

# E2Eテスト実行（Playwright）
pnpm --filter app test:e2e

# 特定のブラウザでのE2Eテスト実行
pnpm --filter app test:e2e:chromium   # Chromiumのみ
pnpm --filter app test:e2e:firefox    # Firefoxのみ
pnpm --filter app test:e2e:webkit     # Safari（WebKit）のみ

# Playwrightテスト（UIモード）
pnpm --filter app test:e2e:ui

# Playwrightテスト（ヘッド付きモード）
pnpm --filter app test:e2e:headed

# PlaywrightのHTMLレポート表示（テスト実行後）
pnpm --filter app exec playwright show-report
```

**Playwrightテストレポートについて**:
- テスト実行後、`apps/app/playwright-report/`にHTMLレポートが生成されます
- レポートには実行結果、スクリーンショット、実行ログが含まれます
- `playwright show-report`コマンドでブラウザでレポートを表示できます

### 開発ツール
```bash
# リンティング
pnpm lint

# フォーマット
pnpm format

# package.jsonのフォーマット
pnpm run format:package

# スペルチェック
pnpm spell-check

# 型チェック
pnpm type-check
```

### バンドル分析
バンドルサイズの分析には`rollup-plugin-visualizer`を使用しています。

```bash
# バンドル分析付きビルド実行
pnpm --filter app build:analyze

# 生成されたレポートを確認
# apps/app/bundle-report.html をブラウザで開く
```

**バンドル分析レポートの内容：**
- **ツリーマップ表示**: ファイルサイズの視覚的な表示
- **依存関係の詳細**: 各ライブラリのサイズ内訳
- **圧縮サイズ比較**: gzip・brotli圧縮後のサイズ
- **最適化の指針**: 大きなファイルの特定と最適化箇所の発見

**CI/CDでの活用：**
- PR作成時に自動でバンドル分析レポートを生成
- GitHub ArtifactsからHTMLレポートをダウンロード可能
- バンドルサイズの変化をレビュー時に確認可能

### CI/CD関連コマンド
```bash
# CI全体の実行（ローカルでのCI環境再現）
pnpm ci

# フォーマットチェック（CIと同じ）
pnpm exec turbo run lint:format
pnpm run format:package --check

# ビルドとテストの並列実行
pnpm exec turbo run build test

# 全パッケージでのテスト実行（テストファイル未存在でもOK）
pnpm exec turbo run test -- --passWithNoTests
```

### monorepo操作
```bash
# 特定のパッケージでコマンド実行
pnpm --filter <package-name> <command>

# 全パッケージでコマンド実行
pnpm -r <command>

# 新しいパッケージの追加
pnpm create-package <package-name>
```

## プロジェクトステータス

### 現在の状況
- ✅ プロジェクト基盤の設計完了
- ✅ README.md ドキュメント整備完了
- ✅ GitHub Copilot インストラクション設定完了
- ✅ monorepo環境の構築完了（pnpm + Turborepo）
- ✅ Reactアプリケーションの実装完了（Vite + React + TypeScript）
- ✅ CI/CDパイプラインの構築完了（GitHub Actions）
- ✅ 共有設定パッケージの作成完了（ESLint・Prettier）
- ✅ リリース自動化の実装完了（GitHub Release Assets）
- ✅ 共有ライブラリパッケージの作成完了（ESLint・Prettier設定）
- ✅ E2Eテストの構築完了（CI統合済み）
- ✅ GitHub Pages自動デプロイの実装完了（本番・PR対応）

### 次のマイルストーン
1. ✅ **開発環境のセットアップ** - pnpm、ESLint、Prettierの設定
2. ✅ **Reactアプリケーションの作成** - apps/appディレクトリにVite + Reactアプリケーション
3. ✅ **CI/CDパイプライン** - GitHub Actionsでの自動化
4. ✅ **共有設定パッケージの作成** - ESLint・Prettierの設定パッケージ
5. ✅ **リリース自動化** - mainブランチプッシュ時のGitHub Release Assets自動作成
6. ✅ **共有ライブラリの作成** - packages/下に基本的なESLint・Prettier設定ライブラリ
7. ✅ **テスト環境の構築** - Playwright E2E、Vitest単体テスト
8. ✅ **GitHub Pages自動デプロイ** - apps/appのビルド成果物の自動公開

## コントリビューション

### 開発の流れ
1. **Issue作成** - 新機能や改善提案をIssueとして作成
2. **ブランチ作成** - `feature/xxx`、`fix/xxx`の命名規則
3. **GitHub Copilot活用** - エージェントと協力して開発
4. **Pull Request** - レビューとマージ

### コーディング規約
- **コミットメッセージ**: 日本語で記述
- **コード**: 変数名・関数名は英語、コメントは日本語
- **GitHub Copilot**: 積極的に活用し、学習記録を残す

### package.jsonの管理規約
- **パッケージバージョン**: `^`や`~`は使用せず、具体的なバージョンを指定
- **プロパティ順序**: `sort-package-json`を使用して自動的に標準順序でソート
- **フォーマット**: `pnpm run format`実行時にpackage.jsonも自動整列
- **依存関係の追加**: 新しい依存関係追加後は必ず`pnpm run format:package`を実行

### 学習記録
開発過程でのGitHub Copilot agentとのやり取りや学習内容を記録し、ナレッジを蓄積していきます。