# study_github_agent

## 目的

このリポジトリは**GitHub Copilot agent**を学習するためのmonorepoプロジェクトです。

## 学習目標

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
│   ├── development/            # 開発ガイド
│   ├── architecture/           # アーキテクチャドキュメント
│   ├── packages/               # パッケージドキュメント
│   ├── deployment/             # デプロイメント関連
│   └── guides/                 # 各種ガイド
├── packages/                   # 共有ライブラリパッケージ
│   ├── eslint-config/          # ESLint設定パッケージ
│   └── prettier-config/        # Prettier設定パッケージ
├── package.json                # monorepo設定とTurborepo
├── pnpm-workspace.yaml         # pnpm workspace設定
├── turbo.json                  # Turborepo設定
└── README.md                   # プロジェクト概要
```

## クイックスタート

### 環境セットアップ
```bash
git clone https://github.com/ao-39/study_github_agent.git
cd study_github_agent
pnpm install
```

### 開発サーバー起動
```bash
pnpm --filter app dev
# http://localhost:3000 でアクセス
```

### 品質チェック
```bash
pnpm fullcheck  # 包括的な品質チェック
```

## 環境変数

プロジェクトでは以下の環境変数を使用してビルド動作を制御できます：

| 環境変数 | 説明 | デフォルト値 | 例 |
|----------|------|-------------|-----|
| `VITE_ENABLE_PWA` | PWA機能の有効化 | `true` | `true`/`false` |
| `GITHUB_PAGES` | GitHub Pages用ビルド | `false` | `true`/`false` |
| `ANALYZE` | バンドル分析の有効化 | `false` | `true`/`false` |

### 使用例

```bash
# PWAを無効にしてビルド
VITE_ENABLE_PWA=false pnpm --filter app build

# GitHub Pages用ビルド（PWA有効）
GITHUB_PAGES=true pnpm --filter app build

# PWA無効 + GitHub Pages用ビルド
VITE_ENABLE_PWA=false GITHUB_PAGES=true pnpm --filter app build

# バンドル分析付きビルド
ANALYZE=true pnpm --filter app build
```

**注意**: 環境変数は[Zod](https://github.com/colinhacks/zod)でバリデーションされ、不正な値が設定された場合は詳細なエラーメッセージが表示されます。詳細は **[PWA対応ガイド](docs/development/pwa.md)** を参照してください。

## ドキュメント

### 📚 開発ガイド
- **[環境セットアップ](docs/development/getting-started.md)** - 開発環境の構築手順
- **[コーディング規約](docs/development/coding-standards.md)** - プロジェクトの開発ルール
- **[開発コマンド](docs/development/commands.md)** - 利用可能なコマンド一覧
- **[テスト戦略](docs/development/testing.md)** - テストの書き方とベストプラクティス
- **[PWA対応ガイド](docs/development/pwa.md)** - PWA機能の概要と設定方法

### 🏗️ アーキテクチャ
- **[アーキテクチャ概要](docs/architecture/overview.md)** - プロジェクト全体の設計方針
- **[クリーンアーキテクチャ](docs/architecture/clean-architecture.md)** - 今後実装予定のアーキテクチャ
- **[多言語対応](docs/architecture/i18n.md)** - 国際化対応の実装方針
- **[ルーティング](docs/architecture/routing.md)** - TanStackRouterによるファイルベースルーティング実装

### 🛣️ ルーティング実装
- **[TanStackRouter実装ガイド](docs/development/tanstack-router-guide.md)** - ファイルベースルーティングの詳細実装手順
- **[ハッシュルーティング設定](docs/development/tanstack-router-guide.md#ハッシュルーティング)** - 静的ホスティング対応設定

### 📦 パッケージ
- **[パッケージ一覧](docs/packages/overview.md)** - 利用パッケージと目的

### 🚀 デプロイメント
- **[CI/CDパイプライン](docs/deployment/ci-cd.md)** - 自動化されたビルド・テスト・デプロイ
- **[GitHub Pages設定](docs/deployment/github-pages-setup.md)** - GitHub Pages デプロイ設定
- **[Cloudflare Pages設定](docs/deployment/cloudflare-pages-setup.md)** - Cloudflare Pages デプロイ設定

### 🤖 GitHub Copilot
- **[GitHub Copilot活用ガイド](docs/guides/github-copilot.md)** - 効果的なCopilot活用方法
- **[ブログ記事一覧](docs/blog/)** - 開発中の学びや工夫を社外向けに整理した技術記事

