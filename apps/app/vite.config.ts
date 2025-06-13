import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { env } from './src/env'
import fs from 'fs'
import path from 'path'

/**
 * Viteビルド設定ファイル
 *
 * PWA対応のため `vite-plugin-pwa` を利用しています。
 * 環境変数でPWA機能の有効化を制御できます。
 * テスト設定は vitest.config.ts で管理されています。
 */

/**
 * package.jsonからバージョン情報を取得
 */
function getAppVersion(): string {
  try {
    const packageJsonPath = path.resolve(__dirname, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}

/**
 * ビルド時刻を取得
 */
function getBuildTime(): string {
  return new Date().toISOString()
}

/**
 * ビルド時に環境変数を表示するプラグイン
 */
function envDisplayPlugin() {
  return {
    name: 'env-display',
    buildStart() {
      console.log('\n📊 ビルド環境変数:')
      console.log(
        `  VITE_ENABLE_PWA: ${env.VITE_ENABLE_PWA} (PWA機能の有効/無効)`
      )
      console.log(
        `  GITHUB_PAGES: ${env.GITHUB_PAGES} (GitHub Pages用ビルド設定)`
      )
      console.log(`  ANALYZE: ${env.ANALYZE} (バンドル分析の有効/無効)`)
      console.log(
        `  NODE_ENV: ${process.env.NODE_ENV || 'development'} (Node.js実行環境)`
      )
      console.log(`  CI: ${process.env.CI || 'false'} (CI環境での実行判定)`)
      console.log('')
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages用のベースパス設定
  base: env.GITHUB_PAGES ? '/study_github_agent/' : '/',
  // ビルド時情報を環境変数として定義
  define: {
    __APP_VERSION__: JSON.stringify(getAppVersion()),
    __BUILD_TIME__: JSON.stringify(getBuildTime()),
  },
  plugins: [
    envDisplayPlugin(),
    react(),
    tsconfigPaths(),
    // PWA機能を環境変数で制御
    ...(env.VITE_ENABLE_PWA
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['vite.svg'],
            manifest: {
              name: 'Study GitHub Agent',
              short_name: 'SGA',
              start_url: '.',
              display: 'standalone',
              background_color: '#ffffff',
              icons: [
                {
                  src: 'vite.svg',
                  sizes: '512x512',
                  type: 'image/svg+xml',
                },
              ],
              description: 'GitHub Copilot agent学習用PWAアプリケーション',
            },
          }) as unknown as PluginOption,
        ]
      : []),
    // バンドル分析を有効にする場合のみvisualizerプラグインを追加
    ...(env.ANALYZE
      ? [
          visualizer({
            filename: 'bundle-report.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap',
          }) as unknown as PluginOption,
        ]
      : []),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0', // バインドをすべてのネットワークインターフェースに設定（E2Eテスト対応）
    open: false, // ブラウザの自動起動を無効化（テスト環境での干渉を防ぐ）
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
