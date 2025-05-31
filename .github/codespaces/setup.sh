#!/bin/bash
# GitHub Codespaces用の環境セットアップスクリプト
# GitHub Copilot agentが効率的に作業できる環境を構築

set -e

echo "🚀 GitHub Codespaces環境をGitHub Copilot agent用にセットアップ中..."

# Node.js 24とpnpm 9.15.0のセットアップ
echo "📦 Node.js 24とpnpm 9.15.0をセットアップ中..."

# Voltaのインストール（既存の場合はスキップ）
if ! command -v volta &> /dev/null; then
    curl https://get.volta.sh | bash
    export VOLTA_HOME="$HOME/.volta"
    export PATH="$VOLTA_HOME/bin:$PATH"
fi

# Node.js 24.7.1とpnpm 9.15.0のインストール
volta install node@24.7.1
volta install pnpm@9.15.0

# プロジェクトのpinning
volta pin node@24.7.1
volta pin pnpm@9.15.0

echo "✅ Node.js $(node --version) と pnpm $(pnpm --version) がインストールされました"

# 依存関係のインストール
echo "📥 プロジェクト依存関係をインストール中..."
pnpm install --frozen-lockfile

# Playwrightブラウザのインストール
echo "🎭 Playwrightブラウザをインストール中..."
pnpm exec playwright install --with-deps

# GitHub CLI拡張機能（GitHub Copilot CLI）
echo "🤖 GitHub CLI拡張機能をセットアップ中..."
if command -v gh &> /dev/null; then
    # GitHub Copilot CLI（ベータ版）
    # gh extension install github/gh-copilot
    echo "GitHub CLIが利用可能です"
else
    echo "GitHub CLIが見つかりません"
fi

# VS Code設定の適用（Codespacesのユーザー設定）
echo "⚙️ VS Code設定を適用中..."
mkdir -p "$HOME/.vscode-remote/data/Machine"
cat > "$HOME/.vscode-remote/data/Machine/settings.json" << 'EOF'
{
  "terminal.integrated.defaultProfile.linux": "bash",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true,
    "typescript": true,
    "typescriptreact": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.pnpm-store": true
  }
}
EOF

# 環境確認
echo "🔍 環境確認を実行中..."
echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "TypeScript: $(pnpm exec tsc --version)"

# 型チェック
echo "🔍 TypeScript型チェック実行中..."
pnpm type-check

echo "✅ GitHub Codespaces環境のセットアップが完了しました！"
echo ""
echo "🎯 利用可能なコマンド:"
echo "  pnpm dev          - 開発サーバー起動"
echo "  pnpm test         - テスト実行"
echo "  pnpm test:e2e     - E2Eテスト実行"
echo "  pnpm build        - ビルド実行"
echo "  pnpm lint         - リント実行"
echo "  pnpm format       - フォーマット実行"
echo ""
echo "🚀 GitHub Copilot agentとの開発を開始してください！"