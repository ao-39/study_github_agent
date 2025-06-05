/* eslint-env node */
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright設定ファイル
 * chromium、firefox、safariでのE2Eテストを実行します。
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './src/e2e',

  // 並列実行を無効にしてCI環境での安定性を向上
  fullyParallel: false,

  // CI環境では失敗時のリトライを無効に
  forbidOnly: !!process.env.CI,

  // CI環境ではリトライを1回に制限
  retries: process.env.CI ? 1 : 0,

  // 並列実行するワーカー数（CI環境では1つに制限）
  workers: process.env.CI ? 1 : undefined,

  // レポート設定
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'playwright-results/results.json' }],
      ]
    : [['html', { outputFolder: 'playwright-report' }]],

  // テスト成果物の出力ディレクトリ
  outputDir: 'playwright-results',

  // 全てのテストで使用する設定
  use: {
    // 各テスト実行時のベースURL
    baseURL: 'http://localhost:3000',

    // 失敗時のスクリーンショット取得
    screenshot: 'only-on-failure',

    // 失敗時のビデオ録画
    video: 'retain-on-failure',

    // テスト実行のトレース（デバッグ用）
    trace: 'on-first-retry',
  },

  // 各ブラウザでのテスト設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // モバイル端末でのテストも追加可能
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // テスト実行前にローカルサーバーを起動
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // 常に既存のサーバーを再利用
    timeout: 30 * 1000, // 30秒でタイムアウト
  },
})
