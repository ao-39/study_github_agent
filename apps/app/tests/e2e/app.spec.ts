import { test, expect } from '@playwright/test'

/**
 * アプリケーションの基本的な動作をテストする
 */
test.describe('アプリケーション基本動作', () => {
  test('ページが正常に読み込まれること', async ({ page }) => {
    // メインページにアクセス
    await page.goto('/')

    // タイトルが正しく設定されていることを確認
    await expect(page).toHaveTitle(/Study GitHub Agent/)
  })

  test('ページに必要な要素が存在すること', async ({ page }) => {
    // メインページにアクセス
    await page.goto('/')

    // アプリケーションのルート要素が存在することを確認
    const root = page.locator('#root')
    await expect(root).toBeVisible()
  })
})
