# PWA対応ガイド

本アプリケーションでは `vite-plugin-pwa` を利用して PWA (Progressive Web App) 機能を提供します。オフラインでも最低限の動作が行えるよう、Service Worker と Web Manifest を自動生成しています。

## 基本機能
- Service Worker によるリソースキャッシュ
- `manifest.webmanifest` の自動生成
- `vite.svg` を利用したアイコン設定

## 開発時の注意点
- キャッシュ更新を確認するには、ブラウザでサービスワーカーを一度アンインストールしてから再読み込みしてください。
- 設定変更後は `pnpm --filter app build` を実行して Service Worker を再生成してください。

詳しい設定は `apps/app/vite.config.ts` を参照してください。
