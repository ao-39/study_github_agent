import { test, expect } from '@playwright/test'

/**
 * Study GitHub Agentアプリケーションの基本機能テスト
 * chromium、firefox、safariで実行されるE2Eテスト
 */
test.describe('Study GitHub Agent アプリケーション', () => {
  test('アプリケーションが正常に読み込まれる', async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto('/')

    // ページタイトルが正しく表示されることを確認
    await expect(page).toHaveTitle(/Study GitHub Agent/)

    // メインヘッダーが表示されることを確認
    await expect(page.locator('h1')).toContainText('🚀 Study GitHub Agent')

    // 説明文が表示されることを確認
    await expect(page.locator('p').first()).toContainText(
      'GitHub Copilot agentを学習するためのReactアプリケーション'
    )
  })

  test('機能カードが正しく表示される', async ({ page }) => {
    await page.goto('/')

    // 各機能カードの存在を確認
    const featureCards = page.locator('.feature-card')

    // 4つの機能カードが存在することを確認
    await expect(featureCards).toHaveCount(4)

    // Viteカードの確認
    await expect(featureCards.nth(0).locator('h3')).toContainText('⚡ Vite')
    await expect(featureCards.nth(0).locator('p')).toContainText(
      '高速な開発サーバーとビルドツール'
    )

    // Reactカードの確認
    await expect(featureCards.nth(1).locator('h3')).toContainText('⚛️ React')
    await expect(featureCards.nth(1).locator('p')).toContainText(
      'モダンなUIライブラリ'
    )

    // Monorepoカードの確認
    await expect(featureCards.nth(2).locator('h3')).toContainText('📦 Monorepo')
    await expect(featureCards.nth(2).locator('p')).toContainText(
      'pnpm + Turborepoによる効率的な管理'
    )

    // GitHub Copilotカードの確認
    await expect(featureCards.nth(3).locator('h3')).toContainText(
      '🤖 GitHub Copilot'
    )
    await expect(featureCards.nth(3).locator('p')).toContainText(
      'AIアシスタントとの協力開発'
    )
  })

  test('学習開始ボタンをクリックするとアラートが表示される', async ({
    page,
  }) => {
    await page.goto('/')

    // アラートのダイアログを監視
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(
        'GitHub Copilot agentとの学習を開始しましょう！🎉'
      )
      await dialog.accept()
    })

    // 学習開始ボタンをクリック
    await page.click('.primary-button')

    // ボタンが正しく表示されていることを確認
    await expect(page.locator('.primary-button')).toContainText('学習を開始')
  })

  test('レスポンシブデザインの確認（モバイルビュー）', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // モバイルでもコンテンツが正しく表示されることを確認
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.feature-grid')).toBeVisible()
    await expect(page.locator('.primary-button')).toBeVisible()

    // 機能カードがモバイルレイアウトで表示されることを確認
    const featureCards = page.locator('.feature-card')
    await expect(featureCards).toHaveCount(4)
  })

  test('CSSスタイルが正しく適用されている', async ({ page }) => {
    await page.goto('/')

    // 背景のグラデーションが適用されていることを確認
    const appElement = page.locator('.app')
    await expect(appElement).toHaveCSS('background', /gradient/)

    // ボタンのスタイルが適用されていることを確認
    const button = page.locator('.primary-button')
    await expect(button).toHaveCSS('background', /gradient/)
    await expect(button).toHaveCSS('border-radius', '50px')
  })
})
