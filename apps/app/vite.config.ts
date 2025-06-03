import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages用のベースパス設定
  base: process.env.GITHUB_PAGES === 'true' ? '/study_github_agent/' : '/',
  plugins: [
    react(),
    // バンドル分析を有効にする場合のみvisualizerプラグインを追加
    ...(process.env.ANALYZE === 'true'
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
    // レポーター設定
    reporter: process.env.CI
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
