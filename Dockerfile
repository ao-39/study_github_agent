# GitHub Copilot Agent用の開発環境Dockerfile
# Node.js 24、pnpm 9、Playwrightを含む統合開発環境

FROM node:24.7.1-bullseye

# 環境変数の設定
ENV NODE_ENV=development
ENV PNPM_VERSION=9.15.0
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false

# 作業ディレクトリの設定
WORKDIR /workspace

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    # Playwright用の依存関係
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    # 日本語フォント
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

# Corepackを有効化してpnpmをインストール
RUN corepack enable && \
    corepack prepare pnpm@${PNPM_VERSION} --activate

# グローバルツールのインストール
RUN pnpm add -g \
    typescript \
    @playwright/test \
    turbo \
    sort-package-json

# GitHub Copilot CLI (将来的に利用)
# RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
#     && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
#     && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
#     && apt update \
#     && apt install gh -y

# プロジェクトファイルのコピー
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/app/package.json ./apps/app/

# 依存関係のインストール
RUN pnpm install --frozen-lockfile

# Playwrightブラウザのインストール
RUN pnpm exec playwright install --with-deps

# 開発用のエントリーポイント
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ポートの公開 (Vite開発サーバー用)
EXPOSE 5173

# プロジェクトファイルをコピー
COPY . .

# エントリーポイントの設定
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "dev"]