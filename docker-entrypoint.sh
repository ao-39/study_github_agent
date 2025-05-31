#!/bin/bash
# GitHub Copilot Agent用のDockerエントリーポイントスクリプト

set -e

echo "🚀 GitHub Copilot Agent開発環境を起動中..."

# Node.jsとpnpmのバージョン確認
echo "📦 環境情報:"
echo "  Node.js: $(node --version)"
echo "  pnpm: $(pnpm --version)"
echo "  TypeScript: $(pnpm exec tsc --version)"

# プロジェクトのセットアップ確認
if [ ! -d "node_modules" ]; then
    echo "📥 依存関係をインストール中..."
    pnpm install --frozen-lockfile
fi

# Playwrightブラウザが未インストールの場合はインストール
if [ ! -d "/root/.cache/ms-playwright" ]; then
    echo "🎭 Playwrightブラウザをインストール中..."
    pnpm exec playwright install --with-deps
fi

# 型チェック
echo "🔍 TypeScript型チェック実行中..."
pnpm type-check

# リント
echo "✨ ESLint実行中..."
pnpm lint

echo "✅ GitHub Copilot Agent開発環境の準備完了！"
echo ""
echo "🔗 利用可能なコマンド:"
echo "  pnpm dev          - 開発サーバー起動"
echo "  pnpm build        - プロダクションビルド"
echo "  pnpm test         - 単体テスト実行"
echo "  pnpm test:e2e     - E2Eテスト実行"
echo "  pnpm lint         - ESLint実行"
echo "  pnpm format       - Prettier実行"
echo "  pnpm type-check   - TypeScript型チェック"
echo ""

# 渡されたコマンドを実行
exec "$@"