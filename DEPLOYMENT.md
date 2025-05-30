# デプロイメント設定ガイド

このプロジェクトはVercelへの自動デプロイが設定されています。

## Vercel設定

### 1. Vercelアカウントの作成
1. [Vercel](https://vercel.com)でアカウントを作成
2. GitHubアカウントと連携

### 2. プロジェクトのインポート
1. Vercelダッシュボードで「New Project」をクリック
2. このGitHubリポジトリを選択
3. 以下の設定を行う：
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/app`
   - **Build Command**: `cd ../../ && npm install -g pnpm && pnpm install && pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install -g pnpm && pnpm install`

### 3. GitHub Secrets設定
以下のシークレットをGitHubリポジトリの設定で追加：

```
VERCEL_TOKEN=<Vercelアカウント設定で取得したtoken>
VERCEL_ORG_ID=<Vercel組織ID>
VERCEL_PROJECT_ID=<VercelプロジェクトID>
```

#### トークンとIDの取得方法

**VERCEL_TOKEN:**
1. Vercelダッシュボード → Settings → Tokens
2. 「Create Token」でトークンを生成

**VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
1. プロジェクトルートで `vercel link` を実行
2. `.vercel/project.json` ファイルから値を取得

## 自動デプロイフロー

### CI/CD パイプライン
1. **CI (Continuous Integration)**
   - プルリクエスト・メインブランチプッシュ時に実行
   - TypeScript型チェック
   - ESLint・Prettier
   - ビルド
   - テスト実行

2. **CD (Continuous Deployment)**
   - メインブランチへのプッシュ時に実行
   - CIパスした場合のみ実行
   - Vercelへの自動デプロイ

### ブランチ戦略
- `main`: 本番環境（Vercel本番デプロイ）
- `develop`: 開発環境（Vercelプレビューデプロイ）
- feature branches: プルリクエスト作成時にプレビューデプロイ

## 手動デプロイ

緊急時やテスト用に手動でデプロイする場合：

```bash
# Vercel CLIインストール
npm i -g vercel

# プロジェクトリンク
vercel link

# デプロイ
vercel --prod
```

## トラブルシューティング

### よくある問題

1. **ビルドエラー**: `pnpm install` が失敗する
   - Solution: Vercelの「Build Command」で `npm install -g pnpm` を最初に実行

2. **ルーティングエラー**: SPAのページリフレッシュで404
   - Solution: `vercel.json` でSPAルーティング設定済み

3. **依存関係エラー**: monorepo設定が認識されない
   - Solution: ルートでの `pnpm install` 実行確認

### デバッグ方法

1. Vercelダッシュボードでビルドログ確認
2. ローカルで `pnpm build` の実行確認
3. GitHub Actionsのログ確認

## パフォーマンス最適化

### 推奨設定
- Vercel Analytics有効化
- Core Web Vitals監視
- 自動画像最適化（Next.jsの場合）
- エッジキャッシング設定

### 監視とアラート
- Vercel Insights導入
- GitHub Actionsでのビルド時間監視
- 定期的なパフォーマンステスト