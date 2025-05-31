# GitHub Copilot Agent開発環境管理用Makefile
# 様々な環境でのセットアップと管理を簡単にするためのコマンド集

.PHONY: help setup clean build test lint format type-check dev docker-build docker-dev docker-test docker-clean

# デフォルトターゲット
help: ## ヘルプを表示
	@echo "GitHub Copilot Agent開発環境 - 利用可能なコマンド:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🐳 Docker環境:"
	@echo "  make docker-build    - Dockerイメージをビルド"
	@echo "  make docker-dev      - Docker開発環境を起動"
	@echo "  make docker-test     - Dockerでテストを実行"
	@echo "  make docker-clean    - Dockerリソースをクリーンアップ"

# 基本セットアップ
setup: ## 開発環境をセットアップ
	@echo "🚀 GitHub Copilot Agent環境をセットアップ中..."
	@chmod +x setup.sh
	@./setup.sh

# 開発コマンド
dev: ## 開発サーバーを起動
	@echo "🚀 開発サーバーを起動中..."
	@pnpm dev

build: ## プロダクションビルドを実行
	@echo "🏗️ プロダクションビルドを実行中..."
	@pnpm build

clean: ## ビルド成果物をクリーンアップ
	@echo "🧹 クリーンアップを実行中..."
	@pnpm clean
	@rm -rf node_modules/.cache
	@rm -rf apps/app/dist
	@rm -rf coverage

# テスト関連
test: ## 単体テストを実行
	@echo "🧪 単体テストを実行中..."
	@pnpm test

test-coverage: ## カバレッジ付きでテストを実行
	@echo "🧪 カバレッジ付きテストを実行中..."
	@pnpm test --coverage

test-e2e: ## E2Eテストを実行
	@echo "🎭 E2Eテストを実行中..."
	@pnpm test:e2e

test-e2e-ui: ## E2EテストをUIモードで実行
	@echo "🎭 E2EテストをUIモードで実行中..."
	@pnpm test:e2e:ui

# コード品質
lint: ## ESLintを実行
	@echo "✨ ESLintを実行中..."
	@pnpm lint

format: ## Prettierでフォーマット
	@echo "🎨 Prettierでフォーマット中..."
	@pnpm format

type-check: ## TypeScript型チェック
	@echo "🔍 TypeScript型チェックを実行中..."
	@pnpm type-check

# 包括的チェック
check-all: type-check lint test build ## 全ての品質チェックを実行
	@echo "✅ 全ての品質チェックが完了しました！"

# Docker関連
docker-build: ## Dockerイメージをビルド
	@echo "🐳 Dockerイメージをビルド中..."
	@docker-compose build

docker-dev: ## Docker開発環境を起動
	@echo "🐳 Docker開発環境を起動中..."
	@docker-compose up app

docker-test: ## Dockerで単体テストを実行
	@echo "🐳 Dockerで単体テストを実行中..."
	@docker-compose run --rm test

docker-e2e: ## DockerでE2Eテストを実行
	@echo "🐳 DockerでE2Eテストを実行中..."
	@docker-compose run --rm e2e

docker-shell: ## Dockerコンテナ内でシェルを起動
	@echo "🐳 Dockerコンテナ内でシェルを起動中..."
	@docker-compose run --rm app bash

docker-clean: ## Dockerリソースをクリーンアップ
	@echo "🐳 Dockerリソースをクリーンアップ中..."
	@docker-compose down --volumes --remove-orphans
	@docker system prune -f

# パッケージ管理
deps-update: ## 依存関係を更新
	@echo "📦 依存関係を更新中..."
	@pnpm update

deps-audit: ## セキュリティ監査を実行
	@echo "🔒 セキュリティ監査を実行中..."
	@pnpm audit

# GitHub Copilot特化機能
copilot-env-check: ## GitHub Copilot環境をチェック
	@echo "🤖 GitHub Copilot環境をチェック中..."
	@echo "Node.js: $$(node --version)"
	@echo "pnpm: $$(pnpm --version)"
	@echo "TypeScript: $$(pnpm exec tsc --version)"
	@echo "Playwright: $$(pnpm exec playwright --version)"
	@echo "ESLint: $$(pnpm exec eslint --version)"
	@echo "Prettier: $$(pnpm exec prettier --version)"
	@if command -v gh &> /dev/null; then echo "GitHub CLI: $$(gh --version | head -n1)"; else echo "GitHub CLI: Not installed"; fi

# CI/CD関連
ci-setup: ## CI環境セットアップ
	@echo "🔧 CI環境をセットアップ中..."
	@corepack enable
	@corepack prepare pnpm@9.15.0 --activate
	@pnpm install --frozen-lockfile
	@pnpm exec playwright install --with-deps chromium

# 開発者向けショートカット
quick-check: lint type-check test ## 素早い品質チェック
	@echo "⚡ 素早い品質チェックが完了しました！"

full-check: clean setup check-all ## 完全な環境確認
	@echo "🎯 完全な環境確認が完了しました！"