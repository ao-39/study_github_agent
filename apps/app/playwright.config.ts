/* eslint-env node */
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright設定ファイル
 * chromium、firefox、safariでのE2Eテストを実行します。
 * テスト終了後はアプリケーションが自動終了するように設定されています。
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

  // レポート設定（テスト結果をコンソールに表示して自動終了）
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'e2e-reports/html', open: 'never' }],
        ['json', { outputFile: 'e2e-reports/json/results.json' }],
        ['github'], // GitHub Actions統合レポート
        ['list'], // CI環境ではコンソールにリスト形式で結果を表示
      ]
    : [
        ['html', { outputFolder: 'e2e-reports/html', open: 'never' }], // ローカル環境でもHTMLレポート生成
        ['json', { outputFile: 'e2e-reports/json/results.json' }], // ローカル環境でもJSONレポート生成
        ['list'], // ローカル環境でもコンソールに結果を表示して自動終了
      ],

  // テスト成果物の出力ディレクトリ
  outputDir: 'e2e-reports/artifacts',

  // 全てのテストで使用する設定
  use: {
    // 各テスト実行時のベースURL
    baseURL: 'http://localhost:3000',

    // スクリーンショット取得（常に撮影）
    screenshot: 'on',

    // ビデオ録画（常に録画）
    video: 'on',

    // テスト実行のトレース（常に取得）
    trace: 'on',
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

    // webkitに対応している環境が用意できないためコメントアウト
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

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

  // テスト実行前にローカルサーバーを起動（テスト終了後に自動停止）
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // CI環境では新しいサーバーを起動
    timeout: 60 * 1000, // 60秒でタイムアウト（TanStackRouterの初期化時間を考慮）
    stdout: 'ignore', // サーバーログを非表示にして干渉を防ぐ
    stderr: 'ignore', // エラーログを非表示にして干渉を防ぐ
  },
})
