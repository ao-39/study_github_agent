# 環境設定ガイド

このドキュメントは、GitHub Copilot agent学習環境のセットアップ手順をまとめたものです。

## 🚀 クイックスタート

### 自動セットアップスクリプト

最も簡単な方法は、用意されたセットアップスクリプトを使用することです：

```bash
# 自動セットアップを実行
./setup.sh

# またはMakefileを使用
make setup
```

### 各種環境での利用方法

#### 1. ローカル開発環境
```bash
# スクリプトを使用したセットアップ
./setup.sh

# Makefileを使用したセットアップ
make setup
```

#### 2. Docker環境
```bash
# Docker開発環境を起動
docker-compose up app

# またはMakefileを使用
make docker-dev
```

#### 3. VS Code Dev Containers
1. VS Codeでプロジェクトを開く
2. `Ctrl+Shift+P` (Cmd+Shift+P) → "Dev Containers: Reopen in Container"を選択
3. 自動的に環境が構築されます

#### 4. GitHub Codespaces
1. GitHubリポジトリで "Code" → "Codespaces" → "Create codespace"
2. 自動的にセットアップスクリプトが実行されます

## 🛠️ 環境構成ファイル

このプロジェクトには、さまざまな開発環境に対応したセットアップファイルが含まれています：

### セットアップスクリプト
- `setup.sh` - ローカル環境の自動セットアップ
- `.github/codespaces/setup.sh` - GitHub Codespaces用セットアップ
- `Makefile` - 環境管理用コマンド集

### コンテナ環境
- `Dockerfile` - GitHub Copilot Agent用の開発環境
- `docker-compose.yml` - Docker開発環境設定
- `docker-entrypoint.sh` - Dockerコンテナ起動スクリプト

### VS Code Dev Containers
- `.devcontainer/devcontainer.json` - VS Code Dev Container設定

### CI/CD
- `.github/workflows/copilot-setup-steps.yml` - GitHub Actions CI/CDワークフロー

## 📋 環境要件

### 必須要件
- **Node.js**: 24.7.1以上
- **pnpm**: 9.15.0以上
- **Docker**: 20.10以上（Docker環境を使用する場合）

### Node.js 24 移行
```bash
# Voltaを使用してNode.js 24をインストール
volta install node@24

# プロジェクトでの設定確認
node --version  # v24.x.x が表示されることを確認
```

### pnpm 9系セットアップ
```bash
# corepackを有効化
corepack enable

# pnpm 9系をインストール
corepack prepare pnpm@9.15.0 --activate

# バージョン確認
pnpm --version  # 9.15.0 が表示されることを確認
```

## 環境移行手順

### 1. 依存関係のインストール
```bash
# プロジェクトルートで実行
pnpm install
```

### 2. Playwrightブラウザのインストール
```bash
# ChromiumまたはWebKit、Firefoxブラウザをインストール
cd apps/app
pnpm exec playwright install chromium

# 全ブラウザをインストールする場合
pnpm exec playwright install
```

### 3. 動作確認
```bash
# ビルドの確認
pnpm build

# 単体テストの実行
pnpm test

# E2Eテストの実行（ブラウザインストール後）
pnpm test:e2e

# 開発サーバーの起動
pnpm dev
```

## トラブルシューティング

### 1. Node.jsバージョン警告
```
WARN  Unsupported engine: wanted: {"node":">=24"} (current: {"node":"v20.19.1"})
```
**解決方法**: Voltaを使用してNode.js 24にアップグレードしてください。

### 2. Playwrightブラウザインストールエラー
**症状**: ブラウザダウンロード時にInfinity エラーが発生
**解決方法**: 
- 安定したネットワーク環境で実行
- 個別にブラウザをインストール: `pnpm exec playwright install chromium`

### 3. E2Eテストが単体テストランナーで実行される
**解決方法**: vite.config.tsにてE2Eテストディレクトリを除外設定済み。
```typescript
test: {
  exclude: ['**/tests/e2e/**', '**/node_modules/**', '**/dist/**'],
}
```

## ファイル構成

```
.
├── package.json                     # volta設定, engines更新済み
├── apps/app/
│   ├── package.json                 # Playwright依存関係追加済み
│   ├── playwright.config.ts         # Playwright設定
│   ├── vite.config.ts              # vitest設定（E2E除外）
│   ├── tests/e2e/                  # E2Eテストディレクトリ
│   │   └── app.spec.ts             # サンプルE2Eテスト
│   └── src/__tests__/              # 単体テストディレクトリ
│       └── basic.test.ts           # サンプル単体テスト
└── turbo.json                      # test:e2eタスク追加済み
```

## 利用可能なコマンド

### 開発コマンド
```bash
pnpm dev                # 開発サーバー起動
pnpm build              # プロダクションビルド
pnpm test               # 単体テスト実行
pnpm test:e2e           # E2Eテスト実行
pnpm lint               # ESLintによるコードチェック
pnpm format             # Prettierによるフォーマット
pnpm type-check         # TypeScript型チェック
```

### 個別パッケージでの実行
```bash
pnpm --filter app dev           # apps/appの開発サーバー
pnpm --filter app test:e2e      # apps/appのE2Eテスト
```

## 参考資料

- [Volta公式ドキュメント](https://volta.sh/)
- [pnpm公式ドキュメント](https://pnpm.io/)
- [Playwright公式ドキュメント](https://playwright.dev/)
- [Vite公式ドキュメント](https://vitejs.dev/)