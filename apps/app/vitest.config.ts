import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Vitestテスト設定ファイル
 *
 * Vitestでのユニットテストとコンポーネントテストの設定を定義します。
 * テスト環境にjsdomを使用し、Reactコンポーネントのテストをサポートします。
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // テスト環境でのグローバル変数定義
  define: {
    __APP_VERSION__: JSON.stringify('test-version'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
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
      ? ['default', 'html', 'json', 'github-actions']
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
