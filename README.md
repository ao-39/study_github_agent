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
- **[ルーティング](docs/architecture/routing.md)** - SPA ルーティング機能の設計

### 📦 パッケージ
- **[パッケージ一覧](docs/packages/overview.md)** - 利用パッケージと目的

### 🚀 デプロイメント
- **[CI/CDパイプライン](docs/deployment/ci-cd.md)** - 自動化されたビルド・テスト・デプロイ
- **[GitHub Pages設定](docs/deployment/github-pages-setup.md)** - GitHub Pages デプロイ設定
- **[Cloudflare Pages設定](docs/deployment/cloudflare-pages-setup.md)** - Cloudflare Pages デプロイ設定

### 🤖 GitHub Copilot
- **[GitHub Copilot活用ガイド](docs/guides/github-copilot.md)** - 効果的なCopilot活用方法