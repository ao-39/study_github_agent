import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { env } from './src/env'

/**
 * Viteの設定を定義します。
 *
 * PWA対応のため `vite-plugin-pwa` を利用しています。
 * 環境変数でPWA機能の有効化を制御できます。
 */

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages用のベースパス設定
  base: env.GITHUB_PAGES ? '/study_github_agent/' : '/',
  plugins: [
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
          }),
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
          }),
        ]
      : []),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    // テスト環境設定
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    // Watchモードを無効化してテスト完了後に終了
    watch: false,
    testTimeout: 20000,
    // レポーター設定
    reporters: process.env.CI
      ? ['default', 'html', 'json']
      : ['default', 'html'],
    outputFile: {
      html: './test-results/index.html',
      json: './test-results/results.json',
    },
    // コードカバレッジ設定
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './test-results/coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        '**/src/e2e/**', // E2Eテストディレクトリを除外
        '**/*.config.*',
        '**/test-setup.ts',
      ],
    },
    // Playwrightテストファイルを除外
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/src/e2e/**', // Playwrightテストディレクトリを除外
    ],
  },
})
