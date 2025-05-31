import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright設定ファイル
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストファイルのパターン
  testDir: './tests/e2e',

  // 並行実行の設定
  fullyParallel: true,

  // CI環境でのfail fast設定
  forbidOnly: !!process.env.CI,

  // リトライ設定
  retries: process.env.CI ? 2 : 0,

  // ワーカー数の設定
  workers: process.env.CI ? 1 : undefined,

  // レポーター設定
  reporter: 'html',

  // テスト実行時の共通設定
  use: {
    // ベースURL（開発サーバー）
    baseURL: 'http://localhost:3000',

    // スクリーンショットの設定
    screenshot: 'only-on-failure',

    // ビデオ録画の設定
    video: 'retain-on-failure',

    // トレース設定
    trace: 'on-first-retry',
  },

  // プロジェクト設定（ブラウザ別）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 開発サーバー設定
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
