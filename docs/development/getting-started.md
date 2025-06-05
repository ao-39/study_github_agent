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

### 4. 依存関係のインストール
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
