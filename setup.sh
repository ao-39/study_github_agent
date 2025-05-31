#!/bin/bash
# GitHub Copilot Agent環境セットアップスクリプト
# このスクリプトは開発環境を自動でセットアップします

set -e

# カラー設定
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# GitHub Copilot Agent環境セットアップ開始
echo -e "${BLUE}🚀 GitHub Copilot Agent環境セットアップを開始します...${NC}"
echo ""

# Node.jsバージョンチェック
log_info "Node.jsバージョンを確認中..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$NODE_MAJOR_VERSION" -ge 24 ]; then
        log_success "Node.js $NODE_VERSION が見つかりました"
    else
        log_warning "Node.js 24以上が必要です。現在: $NODE_VERSION"
        log_info "Voltaまたはnvmを使用してNode.js 24.7.1をインストールしてください"
        
        # Voltaのチェック
        if command -v volta &> /dev/null; then
            log_info "Voltaを使用してNode.js 24.7.1をインストール中..."
            volta install node@24.7.1
            volta install pnpm@9.15.0
            log_success "Volta経由でNode.js 24.7.1とpnpm 9.15.0をインストールしました"
        else
            log_error "VoltaまたはNode.js 24+を手動でインストールしてください"
            exit 1
        fi
    fi
else
    log_error "Node.jsが見つかりません。Node.js 24以上をインストールしてください"
    exit 1
fi

# Corepackとpnpmのセットアップ
log_info "pnpmをセットアップ中..."
if ! command -v pnpm &> /dev/null; then
    log_info "Corepackを有効化してpnpmをインストール中..."
    corepack enable
    corepack prepare pnpm@9.15.0 --activate
    log_success "pnpm 9.15.0をインストールしました"
else
    PNPM_VERSION=$(pnpm --version)
    log_success "pnpm $PNPM_VERSION が見つかりました"
fi

# 依存関係のインストール
log_info "プロジェクトの依存関係をインストール中..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
    log_success "依存関係のインストールが完了しました"
else
    pnpm install
    log_success "依存関係のインストールが完了しました"
fi

# Playwrightブラウザのインストール
log_info "Playwrightブラウザをインストール中..."
pnpm exec playwright install --with-deps chromium
log_success "Playwrightブラウザのインストールが完了しました"

# 型チェック
log_info "TypeScript型チェックを実行中..."
pnpm type-check
log_success "TypeScript型チェックが完了しました"

# ESLint実行
log_info "ESLintを実行中..."
pnpm lint
log_success "ESLintチェックが完了しました"

# テスト実行
log_info "単体テストを実行中..."
pnpm test
log_success "単体テストが完了しました"

# ビルドテスト
log_info "ビルドテストを実行中..."
pnpm build
log_success "ビルドテストが完了しました"

# E2Eテスト実行
log_info "E2Eテストを実行中..."
pnpm test:e2e
log_success "E2Eテストが完了しました"

echo ""
echo -e "${GREEN}🎉 GitHub Copilot Agent環境のセットアップが正常に完了しました！${NC}"
echo ""
echo -e "${BLUE}📋 利用可能なコマンド:${NC}"
echo "  pnpm dev          - 開発サーバー起動"
echo "  pnpm build        - プロダクションビルド"
echo "  pnpm test         - 単体テスト実行"
echo "  pnpm test:e2e     - E2Eテスト実行"
echo "  pnpm lint         - ESLint実行"
echo "  pnpm format       - Prettier実行"
echo "  pnpm type-check   - TypeScript型チェック"
echo ""
echo -e "${BLUE}🐳 Docker環境:${NC}"
echo "  docker-compose up app     - Docker開発環境起動"
echo "  docker-compose run test   - Dockerテスト実行"
echo "  docker-compose run e2e    - Docker E2Eテスト実行"
echo ""
echo -e "${GREEN}開発を開始するには 'pnpm dev' を実行してください！${NC}"