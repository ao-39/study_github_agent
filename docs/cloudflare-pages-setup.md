# Cloudflare Pages 自動デプロイ設定ガイド

## 概要

このプロジェクトでは、Cloudflare Pagesを使用してPull Request（PR）作成時とmainブランチへのマージ時に自動デプロイを行う設定が完了しています。

**機能**:
- **PRプレビューデプロイ**: PR作成・更新時に自動的にプレビュー環境を構築
- **本番デプロイ**: mainブランチマージ時に本番環境へ自動デプロイ
- **自動コメント**: PRにデプロイURLとステータスを自動投稿
- **ブランチ別環境**: PRごとに独立したプレビュー環境を提供

## 必要な設定

### 1. Cloudflare アカウントの準備

#### 1.1 Cloudflareアカウント作成
1. [Cloudflare](https://www.cloudflare.com/)にアクセス
2. 「Sign Up」からアカウントを作成
3. ログイン後、ダッシュボードにアクセス

#### 1.2 Cloudflare Pages プロジェクト作成
1. Cloudflareダッシュボードで「Pages」セクションにアクセス
2. 「Create a project」をクリック
3. 「Direct Upload」を選択
4. プロジェクト名を「study-github-agent」に設定
5. プロジェクトを作成

### 2. API認証情報の取得

#### 2.1 API Token の生成
1. Cloudflareダッシュボード右上のプロフィールアイコンをクリック
2. 「My Profile」→ 「API Tokens」を選択
3. 「Create Token」をクリック
4. 「Custom token」の「Get started」をクリック

**Token設定**:
- **Token name**: `GitHub Actions - study-github-agent`
- **Permissions**: 
  - Account: `Cloudflare Pages:Edit`
  - Zone: `Zone:Read` (ドメインを使用する場合)
- **Account Resources**: `Include - <your-account>`
- **Zone Resources**: `Include - All zones` (または特定のゾーン)

5. 「Continue to summary」→ 「Create Token」をクリック
6. 生成されたトークンをコピーして安全に保存

#### 2.2 Account ID の取得
1. Cloudflareダッシュボードの右サイドバーで「Account ID」を確認
2. 値をコピーして保存

### 3. GitHub Secretsの設定

#### 3.1 リポジトリ設定へアクセス
1. GitHub リポジトリページで「Settings」タブをクリック
2. 左サイドバーの「Secrets and variables」→ 「Actions」を選択

#### 3.2 必要なシークレットの追加
以下の2つのシークレットを「New repository secret」から追加します：

**CLOUDFLARE_API_TOKEN**
- Name: `CLOUDFLARE_API_TOKEN`
- Secret: [手順2.1で生成したAPIトークン]

**CLOUDFLARE_ACCOUNT_ID**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Secret: [手順2.2で取得したAccount ID]

## ワークフロー設定

### ワークフロー ファイル
- **設定ファイル**: `.github/workflows/pages-preview.yml`
- **トリガー**: 
  - `pull_request` - PRの作成・更新時
  - `push` - mainブランチへのプッシュ時

### デプロイ プロセス

#### PRプレビューデプロイ
1. PR作成・更新時にワークフローが自動実行
2. アプリケーションをビルド（`pnpm --filter app build`）
3. Cloudflare Pagesにデプロイ（ブランチ名を使用）
4. プレビューURLをPRコメントに自動投稿

#### 本番デプロイ
1. mainブランチへのマージ時にワークフローが自動実行
2. 本番環境にデプロイ
3. 本番URLを確認・通知

## 使用方法

### 1. PRでのプレビュー確認
1. 機能ブランチからPRを作成
2. 自動的にCloudflare Pagesワークフローが実行
3. PRコメントにプレビューURLが投稿される
4. URLをクリックしてプレビュー環境を確認

### 2. 本番デプロイ
1. PRをmainブランチにマージ
2. 自動的に本番環境へデプロイ
3. 本番URLでアプリケーションが公開

## URL構造

### プレビュー環境
- **URL形式**: `https://<branch-name>--study-github-agent.pages.dev`
- **例**: `https://feature-ui-update--study-github-agent.pages.dev`

### 本番環境
- **URL形式**: `https://study-github-agent.pages.dev`

## ビルド設定

### ビルドコマンド
```bash
pnpm --filter app build
```

### 出力ディレクトリ
```
apps/app/dist/
```

### 環境変数
プロジェクトのVite設定により、以下の環境に応じたビルドが行われます：
- **通常ビルド**: ベースパス `/`
- **GitHub Pages用**: ベースパス `/study_github_agent/`（環境変数 `GITHUB_PAGES=true` 時）

## トラブルシューティング

### よくある問題と解決方法

#### 1. デプロイが失敗する場合

**症状**: ワークフローでデプロイエラーが発生

**確認項目**:
- [ ] CLOUDFLARE_API_TOKEN が正しく設定されているか
- [ ] CLOUDFLARE_ACCOUNT_ID が正しく設定されているか
- [ ] Cloudflareでプロジェクト「study-github-agent」が作成されているか
- [ ] APIトークンの権限が正しく設定されているか

**解決方法**:
1. GitHub Actions のログを確認
2. Cloudflareダッシュボードでプロジェクト状態を確認
3. 必要に応じてシークレットを再設定

#### 2. プレビューURLにアクセスできない場合

**症状**: PRコメントのURLクリック後、404エラーや読み込み失敗

**確認項目**:
- [ ] デプロイが完了しているか（数分待つ）
- [ ] ビルドエラーが発生していないか
- [ ] Cloudflareのステータスに問題がないか

**解決方法**:
1. 数分待ってから再度アクセス
2. GitHub Actionsのビルドログを確認
3. Cloudflareダッシュボードでデプロイ状況を確認

#### 3. ビルドエラーが発生する場合

**症状**: ワークフローのビルドステップで失敗

**確認項目**:
- [ ] ローカル環境でビルドが成功するか
- [ ] 依存関係の問題がないか
- [ ] TypeScriptエラーがないか

**解決方法**:
1. ローカルで `pnpm --filter app build` を実行
2. エラーメッセージを確認し修正
3. 修正後、再度PRを更新

#### 4. コメントが投稿されない場合

**症状**: デプロイ成功後もPRにコメントが投稿されない

**確認項目**:
- [ ] ワークフローの権限設定（`pull-requests: write`）
- [ ] GITHUB_TOKEN の権限
- [ ] PRの状態（Draft等）

**解決方法**:
1. ワークフローファイルの権限設定を確認
2. PRがDraft状態でないことを確認
3. 必要に応じてワークフローを再実行

## セキュリティ考慮事項

### シークレット管理
- **APIトークン**: GitHub Secretsで安全に管理
- **最小権限の原則**: 必要最小限の権限のみを付与
- **トークンローテーション**: 定期的なAPIトークンの更新を推奨

### アクセス制御
- **プレビュー環境**: パブリックアクセス可能（機密情報を含めない）
- **本番環境**: 適切なセキュリティ設定を適用

## パフォーマンス最適化

### キャッシュ戦略
- **pnpmキャッシュ**: 依存関係インストール時間の短縮
- **Cloudflare CDN**: 自動的なグローバル配信とキャッシュ

### ビルド最適化
- **Vite**: 高速なビルドとホットリロード
- **Tree shaking**: 不要なコードの自動除去
- **バンドル分析**: サイズ最適化のための詳細分析

## 利用料金

### Cloudflare Pages 料金
- **Free プラン**: 
  - 月間リクエスト数: 100,000回
  - ビルド回数: 500回/月
  - 帯域幅: 無制限
- **Pro プラン**: より多くのビルド回数と高度な機能

**注意**: 基本的な使用では無料プランで十分です。

## 関連リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [GitHub Actions ドキュメント](https://docs.github.com/actions)
- [Vite ドキュメント](https://vitejs.dev/)

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-01-XX | 初期設定完了、PRプレビューとmain自動デプロイ機能を実装 |