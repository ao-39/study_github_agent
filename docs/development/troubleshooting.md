# トラブルシューティング

このドキュメントでは、開発中によく遭遇する問題とその解決方法を説明します。

## 環境セットアップの問題

### pnpm コマンドが見つからない
**症状**: `pnpm: command not found`エラーが発生する

**解決方法**:
```bash
# Voltaの再読み込み
source ~/.bashrc  # または ~/.zshrc

# pnpmの再インストール
volta install pnpm

# パスの確認
echo $PATH
which pnpm
```

### Node.jsバージョンの不整合
**症状**: 異なるNode.jsバージョンでエラーが発生する

**解決方法**:
```bash
# 現在のバージョン確認
node --version
pnpm --version

# Voltaで正しいバージョンをインストール
volta install node@24
volta install pnpm@10.11.0

# プロジェクトディレクトリで確認
cd study_github_agent
node --version  # 24.x.x であることを確認
```

### 依存関係インストールエラー
**症状**: `pnpm install`でエラーが発生する

**解決方法**:
```bash
# キャッシュをクリア
pnpm store prune

# node_modulesを削除して再インストール
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

## 開発サーバーの問題

### ポート3000が使用中
**症状**: `Error: listen EADDRINUSE :::3000`

**解決方法**:
```bash
# 使用中のプロセスを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>

# または別のポートで起動
pnpm --filter app dev -- --port 3001
```

### 開発サーバーが起動しない
**症状**: `pnpm --filter app dev`でエラーが発生する

**解決方法**:
```bash
# apps/appディレクトリで依存関係を確認
cd apps/app
pnpm install

# ビルドしてからdevサーバー起動
pnpm build
pnpm dev

# 詳細ログで確認
pnpm dev --debug
```

## ビルド・テストの問題

### TypeScriptコンパイルエラー
**症状**: `pnpm build`で型エラーが発生する

**解決方法**:
```bash
# 型チェックを単独で実行
pnpm type-check

# 詳細なエラー情報を確認
pnpm --filter app run type-check --verbose

# TypeScript設定を確認
cat apps/app/tsconfig.json
```

### ESLintエラー
**症状**: `pnpm lint`でエラーが発生する

**解決方法**:
```bash
# 自動修正を試行
pnpm lint --fix

# 特定ファイルのみチェック
pnpm --filter app lint src/problem-file.tsx

# ESLint設定を確認
cat apps/app/eslint.config.js
```

### Vitestテストが失敗する
**症状**: `pnpm test`でテストが失敗する

**解決方法**:
```bash
# 単体でテスト実行
pnpm --filter app test --reporter=verbose

# 特定のテストファイルのみ実行
pnpm --filter app test src/specific.test.tsx

# テスト設定を確認
cat apps/app/vite.config.ts
```

### Playwrightテストが不安定
**症状**: E2Eテストが時々失敗する（flaky test）

**解決方法**:
```bash
# ブラウザを明示的にインストール
pnpm --filter app exec playwright install

# ヘッド付きモードでデバッグ
pnpm --filter app test:e2e:headed

# 特定のテストのみ実行
pnpm --filter app exec playwright test --grep "テスト名"

# タイムアウトを調整（playwright.config.ts）
# timeout: 30000 を 60000 に増加
```

## CI/CDの問題

### GitHub Actions失敗
**症状**: PRでCIが失敗する

**解決方法**:
```bash
# ローカルで同じコマンドを実行
pnpm fullcheck

# 特定のステップを個別実行
pnpm lint
pnpm run format:check
pnpm build
pnpm test

# キャッシュ問題の場合
# GitHub ActionsのページでCacheをクリア
```

### デプロイエラー
**症状**: GitHub Pages/Cloudflare Pagesデプロイが失敗する

**解決方法**:
```bash
# GitHub Pages用ビルドをローカルで確認
cd apps/app
GITHUB_PAGES=true pnpm build
ls -la dist/

# ベースパス設定を確認
cat vite.config.ts
# base: process.env.GITHUB_PAGES === 'true' ? '/study_github_agent/' : '/'
```

## パフォーマンスの問題

### ビルドが遅い
**症状**: `pnpm build`に時間がかかりすぎる

**解決方法**:
```bash
# Turborepoキャッシュを活用
pnpm exec turbo run build --dry  # キャッシュ状況確認

# キャッシュをクリア
pnpm exec turbo clean

# 並列実行を最適化
cat turbo.json  # dependsOnの設定確認
```

### テスト実行が遅い
**症状**: `pnpm test`に時間がかかりすぎる

**解決方法**:
```bash
# ウォッチモードを無効化
pnpm --filter app test --run

# 特定のテストファイルのみ実行
pnpm --filter app test --reporter=verbose src/slow.test.tsx

# テスト並列実行数を調整
# vitest.config.ts で threads: false に設定
```

## メモリ・リソースの問題

### Out of Memory エラー
**症状**: `JavaScript heap out of memory`エラー

**解決方法**:
```bash
# Node.jsのメモリ制限を増加
export NODE_OPTIONS="--max-old-space-size=4096"

# または一時的に実行
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

# package.json にスクリプト追加
"build:mem": "NODE_OPTIONS='--max-old-space-size=4096' pnpm build"
```

### ディスク容量不足
**症状**: `ENOSPC: no space left on device`エラー

**解決方法**:
```bash
# node_modulesキャッシュをクリア
pnpm store prune

# Turborepoキャッシュをクリア
pnpm exec turbo clean

# 不要なDockerイメージ削除（該当する場合）
docker system prune -a
```

## monorepo特有の問題

### パッケージ間依存関係エラー
**症状**: `workspace:*`パッケージが見つからない

**解決方法**:
```bash
# ワークスペース設定を確認
cat pnpm-workspace.yaml

# 依存関係を再インストール
pnpm install --force

# 特定パッケージの依存関係確認
pnpm --filter app list
```

### Turborepoタスクエラー
**症状**: `turbo run`でタスクが失敗する

**解決方法**:
```bash
# タスク定義を確認
cat turbo.json

# 依存関係グラフを表示
pnpm exec turbo run build --dry --graph

# 特定パッケージのみ実行
pnpm exec turbo run build --filter=app
```

## デバッグのコツ

### 詳細ログの有効化
```bash
# pnpmの詳細ログ
pnpm --loglevel=debug install

# Turborepoの詳細ログ
pnpm exec turbo run build --verbosity=2

# Vitestの詳細ログ
pnpm --filter app test --reporter=verbose
```

### 設定ファイルの確認
```bash
# 主要設定ファイルの確認
cat package.json
cat pnpm-workspace.yaml
cat turbo.json
cat apps/app/vite.config.ts
cat apps/app/tsconfig.json
```

### 環境変数の確認
```bash
# 現在の環境変数確認
env | grep NODE
env | grep GITHUB
echo $PATH
```

## よくある質問

### Q: 新しいパッケージを追加したい
```bash
# appsディレクトリに新しいアプリケーション追加
mkdir apps/new-app
cd apps/new-app
pnpm init

# packagesディレクトリに新しい共有ライブラリ追加
mkdir packages/new-package
cd packages/new-package
pnpm init
```

### Q: ESLint設定をカスタマイズしたい
```bash
# apps/app/eslint.config.js を編集
export default [
  ...config,
  {
    // カスタムルール
    rules: {
      'no-console': 'off'
    }
  }
]
```

### Q: GitHub Copilotが期待通りに動作しない
1. `.github/copilot-instructions.md`を確認
2. プロンプトをより具体的に記述
3. [GitHub Copilot活用ガイド](../guides/github-copilot.md)を参照

## ヘルプが必要な場合

### ログの収集
問題報告時には以下の情報を含めてください：

```bash
# 環境情報
node --version
pnpm --version
echo $SHELL
uname -a

# エラーログ
pnpm fullcheck 2>&1 | tee error.log

# 設定ファイル
cat package.json
cat pnpm-workspace.yaml
```

### コミュニティサポート
- **GitHub Issues**: プロジェクト固有の問題
- **GitHub Discussions**: 一般的な質問や議論
- **公式ドキュメント**: Vite、Vitest、Playwrightの公式ドキュメント

このトラブルシューティングガイドで解決しない問題がある場合は、GitHub Issuesで詳細な状況とエラーログを共有してください。