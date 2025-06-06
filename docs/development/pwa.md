# PWA対応ガイド

本アプリケーションでは `vite-plugin-pwa` を利用して PWA (Progressive Web App) 機能を提供します。オフラインでも最低限の動作が行えるよう、Service Worker と Web Manifest を自動生成しています。

## 環境変数による制御

PWA機能は環境変数 `VITE_ENABLE_PWA` によって制御できます：

### PWAを有効にする場合（デフォルト）
```bash
export VITE_ENABLE_PWA=true
pnpm --filter app build
```

### PWAを無効にする場合
```bash
export VITE_ENABLE_PWA=false
pnpm --filter app build
```

PWAが無効な場合、以下のファイルは生成されません：
- `manifest.webmanifest`
- `registerSW.js`
- `sw.js`
- `workbox-*.js`

## 基本機能
- Service Worker によるリソースキャッシュ
- `manifest.webmanifest` の自動生成
- `vite.svg` を利用したアイコン設定

## 環境変数バリデーション

環境変数は Zod を使用してバリデーションされます。不正な値が設定された場合は、以下のような詳細なエラーメッセージが表示されます：

```
❌ 環境変数のバリデーションに失敗しました

🔍 エラー内容:
  - VITE_ENABLE_PWA: VITE_ENABLE_PWA は 'true' または 'false' である必要があります

📋 必要な環境変数:
  - VITE_ENABLE_PWA: PWA機能の有効化 (true/false)
  - GITHUB_PAGES: GitHub Pages用ビルド (true/false) [オプション]
  - ANALYZE: バンドル分析の有効化 (true/false) [オプション]

💡 設定方法:
  export VITE_ENABLE_PWA=true
  export GITHUB_PAGES=false
  export ANALYZE=false

📁 バリデーション設定ファイル:
  /path/to/apps/app/src/env.ts
```

## フロントエンドでの利用

環境変数は TypeScript で型安全に利用できます：

```typescript
import { env } from './env'

// 型安全な環境変数アクセス
if (env.VITE_ENABLE_PWA) {
  // PWA固有の処理
}
```

## 開発時の注意点
- キャッシュ更新を確認するには、ブラウザでサービスワーカーを一度アンインストールしてから再読み込みしてください。
- 設定変更後は `pnpm --filter app build` を実行して Service Worker を再生成してください。
- 環境変数の変更は、ビルド時に反映されるため、開発サーバーの再起動が必要です。

## 設定ファイル

詳しい設定は以下のファイルを参照してください：
- `apps/app/vite.config.ts`: Vite設定とPWAプラグイン設定
- `apps/app/src/env.ts`: 環境変数バリデーション設定
- `apps/app/src/vite-env.d.ts`: TypeScript型定義
