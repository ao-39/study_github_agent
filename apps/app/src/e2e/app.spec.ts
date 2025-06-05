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
    await expect(page.locator('h1')).toContainText('Study-Github-Agent')

    // メッセージ表示ボタンが表示されることを確認
    await expect(page.locator('.message-button')).toContainText(
      'メッセージを表示する'
    )
  })

  test('シンプルなレイアウトが正しく表示される', async ({ page }) => {
    await page.goto('/')

    // アプリコンテナが存在することを確認
    await expect(page.locator('.app-container')).toBeVisible()

    // タイトルが正しく表示されることを確認
    await expect(page.locator('.app-title')).toContainText('Study-Github-Agent')

    // メッセージボタンが存在することを確認
    await expect(page.locator('.message-button')).toBeVisible()
  })

  test('メッセージ表示ボタンをクリックするとアラートが表示される', async ({
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

    // メッセージ表示ボタンをクリック
    await page.click('.message-button')

    // ボタンが正しく表示されていることを確認
    await expect(page.locator('.message-button')).toContainText(
      'メッセージを表示する'
    )
  })

  test('レスポンシブデザインの確認（モバイルビュー）', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // モバイルでもコンテンツが正しく表示されることを確認
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.app-container')).toBeVisible()
    await expect(page.locator('.message-button')).toBeVisible()

    // タイトルとボタンが表示されることを確認
    await expect(page.locator('.app-title')).toContainText('Study-Github-Agent')
    await expect(page.locator('.message-button')).toContainText(
      'メッセージを表示する'
    )
  })

  test('CSSスタイルが正しく適用されている', async ({ page }) => {
    await page.goto('/')

    // 背景色が正しく適用されていることを確認
    const appElement = page.locator('.app')
    await expect(appElement).toHaveCSS('background-color', 'rgb(255, 255, 255)')

    // ボタンのスタイルが適用されていることを確認
    const button = page.locator('.message-button')
    await expect(button).toHaveCSS('background-color', 'rgb(0, 23, 193)')
    await expect(button).toHaveCSS('border-radius', '8px')
    await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)')
  })
})
