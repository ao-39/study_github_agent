# 開発環境セットアップガイド

## 環境要件

### 必須環境
- **Node.js**: 最新のLTS版（推奨：18以上）
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

### 4. GitHub CLI (gh) のインストール（Claude Code用）
Claude CodeでPR作成など、GitHub操作を自動化するためにGitHub CLIが必要です：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install gh

# macOS（Homebrew）
brew install gh

# または公式スクリプト（Linux/macOS）
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh

# 認証（初回のみ）
gh auth login
```

**認証手順**:
1. `gh auth login`実行
2. `GitHub.com`を選択
3. `HTTPS`を選択
4. `Login with a web browser`を選択
5. ブラウザでGitHubにログイン
6. 表示されたコードを入力

**目的**: Claude CodeがPR作成、イシュー管理、リポジトリ操作を自動実行するために必要

### 5. 依存関係のインストール
```bash
# プロジェクトルートで実行
pnpm install
```

## 開発サーバーの起動

```bash
# メインアプリケーション（apps/app）の開発サーバー起動
pnpm --filter app dev
```

ブラウザで http://localhost:3000 にアクセスして動作確認を行ってください。

## 初回セットアップ確認

### フルチェックの実行
```bash
# 開発環境が正しくセットアップされていることを確認
pnpm fullcheck
```

このコマンドが正常に完了すれば、開発環境のセットアップは完了です。

### 実行される内容
- リンティング（ESLint）
- フォーマットチェック（Prettier）
- スペルチェック（cspell）
- ビルド（TypeScript + Vite）
- 単体テスト（Vitest）

## トラブルシューティング

### よくある問題

#### pnpm コマンドが見つからない
```bash
# Voltaの再読み込み
source ~/.bashrc  # または ~/.zshrc

# pnpmの再インストール
volta install pnpm
```

#### ポート3000が使用中
```bash
# 別のポートで起動
pnpm --filter app dev -- --port 3001
```

#### キャッシュの問題
```bash
# pnpmキャッシュのクリア
pnpm store prune

# Turborepoキャッシュのクリア
pnpm exec turbo clean

# 再インストール
pnpm install
```

詳細なトラブルシューティングについては、[troubleshooting.md](troubleshooting.md) を参照してください。
## 開発記録のすすめ
プロジェクト中に詰まった点や解決策、工夫した方法は、社外へ共有できる技術ブログとしてまとめます。`docs/blog/template.md` をコピーし、日付なしのファイル名で保存してください。記事は「タイトル」「内容」「まとめ」の三部構成とし、箇条書きを避けて経緯やノウハウを丁寧に記述します。内容では初めに何を学べるか、そのメリットを説明し、続いて具体的な手順やサンプルコードを載せると読み手に伝わりやすくなります。
