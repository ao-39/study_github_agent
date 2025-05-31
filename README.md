# study_github_agent

## 🚀 環境セットアップ

### クイックスタート

GitHub Copilot agentとの開発に最適化された環境を自動でセットアップできます：

```bash
# 自動セットアップスクリプトを実行
./setup.sh

# または、Makefileを使用
make setup
```

### 環境選択肢

#### 1. ローカル開発環境
```bash
# Node.js 24とpnpm 9の環境セットアップ
./setup.sh
pnpm dev
```

#### 2. Docker環境（推奨）
```bash
# Docker Compose環境の起動
docker-compose up app

# または、Makefileを使用
make docker-dev
```

#### 3. VS Code Dev Containers
1. VS Codeでプロジェクトを開く
2. `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"
3. 自動的に環境が構築されます

#### 4. GitHub Codespaces
1. GitHubリポジトリで "Code" → "Codespaces" → "Create codespace"
2. 自動的にセットアップが完了します

詳細な設定手順は [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) を参照してください。

## 📋 利用可能なコマンド

```bash
# 開発
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド

# テスト
pnpm test         # 単体テスト実行
pnpm test:e2e     # E2Eテスト実行

# コード品質
pnpm lint         # ESLint実行
pnpm format       # Prettier実行
pnpm type-check   # TypeScript型チェック

# Docker環境
make docker-dev   # Docker開発環境起動
make docker-test  # Dockerテスト実行

# 環境管理
make setup        # 環境セットアップ
make check-all    # 全品質チェック実行
```

## 🎯 学習目標

このリポジトリを通じて以下の学習を目指します：

- **GitHub Copilot Agentの基本操作** - エージェントとの効果的なやり取り方法
- **monorepo構成の理解** - apps/packages構成でのプロジェクト管理
- **モダンフロントエンド開発** - React + TypeScript + Viteの組み合わせ
- **開発ツールチェーン** - ESLint、Prettier、テスト環境の構築と運用
- **CI/CDパイプライン** - GitHub Actionsを使った自動化
- **コラボレーション** - GitHub Copilotを活用したチーム開発

## 🏗️ プロジェクト構成

## 📁 ディレクトリ構造

```
study_github_agent/
├── .devcontainer/               # VS Code Dev Container設定
├── .github/                     # GitHub関連の設定ファイル
│   ├── codespaces/             # GitHub Codespaces用設定
│   ├── workflows/              # GitHub Actions CI/CD
│   └── copilot-instructions.md # GitHub Copilotの動作設定
├── apps/                       # アプリケーションパッケージ
│   └── app/                    # Reactアプリケーション（Vite + React + TypeScript）
├── packages/                   # 共有ライブラリパッケージ（予定）
├── Dockerfile                  # GitHub Copilot Agent用開発環境
├── docker-compose.yml          # Docker開発環境設定
├── docker-entrypoint.sh        # Docker起動スクリプト
├── setup.sh                    # 自動環境セットアップスクリプト
├── Makefile                    # 環境管理用コマンド集
├── package.json                # monorepo設定とTurborepo
├── pnpm-workspace.yaml         # pnpm workspace設定
├── turbo.json                  # Turborepo設定
├── ENVIRONMENT_SETUP.md        # 環境セットアップ詳細ガイド
└── README.md                   # プロジェクトドキュメント
```

### 主要ディレクトリ説明

#### `.github/`
GitHub関連の設定ファイルを格納するディレクトリです。
- `copilot-instructions.md`: GitHub Copilotエージェントの動作設定とインストラクション
- `workflows/copilot-setup-steps.yml`: GitHub Copilot agent用のCI/CDワークフロー
- `codespaces/setup.sh`: GitHub Codespaces環境セットアップスクリプト

#### `.devcontainer/`
VS Code Dev Container設定ファイルを格納するディレクトリです。
- `devcontainer.json`: VS Code Dev Container設定（GitHub Copilot拡張機能含む）

#### `apps/`
単体で動作するアプリケーションパッケージを設置するディレクトリです。
- `app/`: Vite + React + TypeScriptで構築されたメインアプリケーション

#### `packages/`（予定）
appsのパッケージから利用される共有ライブラリパッケージを設置するディレクトリです。

## アーキテクチャ

本プロジェクトはmonorepo構成で構築されています。

### `apps/app`
Reactアプリケーションを設置します。Vite + React + TypeScriptで構築されており、モダンなフロントエンド開発環境を提供します。

### `packages/`
ライブラリとしてappsのパッケージに利用されるパッケージを設置します。

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

packages/にそれぞれ設定ファイルを入れます。

### テスト
- **E2Eテスト**: playwrightを利用してテストを作成していきます（標準装備）
- **モック**: mswを利用します

### ビルドツール
- **vite**: ビルドツールとして利用します
- **vitest**: テストランナーとして利用します
- **turbo**: monorepoのタスクランナーとして利用します

### CI/CD
- **GitHub Actions**: 継続的インテグレーション・継続的デプロイメントを実現します

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

# テスト実行
pnpm --filter app test

# E2Eテスト実行
pnpm --filter app test:e2e
```

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
- 📋 共有ライブラリパッケージの作成（予定）
- 📋 E2Eテスト環境の構築（予定）
- 📋 CI/CDパイプラインの構築（予定）

### 次のマイルストーン
1. ✅ **開発環境のセットアップ** - pnpm、ESLint、Prettierの設定
2. ✅ **Reactアプリケーションの作成** - apps/appディレクトリにVite + Reactアプリケーション
3. **共有ライブラリの作成** - packages/下に基本的なユーティリティライブラリ
4. **テスト環境の構築** - Playwright E2E、Vitest単体テスト
5. **CI/CDパイプライン** - GitHub Actionsでの自動化

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