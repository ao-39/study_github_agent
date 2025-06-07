import { test, expect } from '@playwright/test'

/**
 * Study GitHub Agent - TanStackRouterアプリケーションの基本機能テスト
 * chromium、firefox、safariで実行されるE2Eテスト
 */
test.describe('Study GitHub Agent - TanStackRouter アプリケーション', () => {
  test('ホームページが正常に読み込まれる', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('/')

    // ページタイトルが正しく表示されることを確認
    await expect(page).toHaveTitle(/Study GitHub Agent/)

    // ナビゲーションが表示されることを確認
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('nav a').first()).toContainText('ホーム')
    await expect(page.locator('nav a').last()).toContainText('About')

    // メインヘッダーが表示されることを確認
    await expect(page.locator('main h1')).toContainText('Study-Github-Agent')

    // 学習メッセージボタンが表示されることを確認（devtoolsのボタンを除外）
    await expect(
      page.locator('main button:has-text("学習メッセージを表示")')
    ).toBeVisible()
  })

  test('ナビゲーションとルーティングが正しく動作する', async ({ page }) => {
    await page.goto('/')

    // ホームページの内容を確認
    await expect(page.locator('main h1')).toContainText('Study-Github-Agent')
    await expect(page.locator('main p').first()).toContainText(
      'TanStackRouterを使用したファイルベースルーティングの学習プロジェクトです。'
    )

    // Aboutページに移動
    await page.click('nav a[href="#/about"]')
    
    // URLが変更されることを確認（ハッシュルーティング）
    await expect(page).toHaveURL(/#\/about/)

    // Aboutページの内容を確認
    await expect(page.locator('main h1')).toContainText('📚 プロジェクトについて')
    await expect(
      page.locator('main').getByText('プロジェクトの目的')
    ).toBeVisible()

    // ホームページに戻る
    await page.click('nav a[href="#/"]')
    
    // URLが変更されることを確認
    await expect(page).toHaveURL(/\/$|#\//)

    // ホームページの内容が再表示されることを確認
    await expect(page.locator('main h1')).toContainText('Study-Github-Agent')
  })

  test('学習メッセージボタンをクリックするとアラートが表示される', async ({
    page,
  }) => {
    await page.goto('/')

    // アラートのダイアログを監視
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(
        'TanStackRouterでのファイルベースルーティング学習を開始しましょう！🚀'
      )
      await dialog.accept()
    })

    // 学習メッセージボタンをクリック（メインコンテンツエリア内のボタンのみ対象）
    await page.click('main button:has-text("学習メッセージを表示")')

    // ボタンが正しく表示されていることを確認
    await expect(
      page.locator('main button:has-text("学習メッセージを表示")')
    ).toBeVisible()
  })

  test('404ページが正しく表示される', async ({ page }) => {
    // 存在しないパスにアクセス
    await page.goto('/#/nonexistent-page')

    // 404ページの内容を確認
    await expect(page.locator('h1')).toContainText('404 - ページが見つかりません')
    await expect(page.locator('text=お探しのページは存在しません。')).toBeVisible()
    
    // ホームに戻るリンクが存在することを確認（ナビゲーション以外の404ページ内のリンク）
    await expect(
      page.locator('a[href="#/"]:has-text("ホームに戻る")')
    ).toBeVisible()

    // ホームに戻るリンクをクリック
    await page.click('a[href="#/"]:has-text("ホームに戻る")')
    
    // ホームページに戻ることを確認
    await expect(page.locator('main h1')).toContainText('Study-Github-Agent')
  })

  test('レスポンシブデザインの確認（モバイルビュー）', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // モバイルでもナビゲーションが正しく表示されることを確認
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('nav a').first()).toContainText('ホーム')
    await expect(page.locator('nav a').last()).toContainText('About')

    // コンテンツが正しく表示されることを確認
    await expect(page.locator('main h1')).toBeVisible()
    await expect(
      page.locator('main button:has-text("学習メッセージを表示")')
    ).toBeVisible()

    // Aboutページでもレスポンシブデザインを確認
    await page.click('nav a[href="#/about"]')
    await expect(page.locator('main h1')).toContainText('📚 プロジェクトについて')
    
    // 技術スタック情報が表示されることを確認（メインコンテンツエリア内のみ）
    await expect(page.locator('main strong:has-text("TanStack Router")')).toBeVisible()
  })

  test('Aboutページの詳細な内容が表示される', async ({ page }) => {
    await page.goto('/#/about')

    // メインタイトルの確認
    await expect(page.locator('main h1')).toContainText('📚 プロジェクトについて')

    // セクションの確認
    await expect(page.locator('text=🎯 プロジェクトの目的')).toBeVisible()
    await expect(page.locator('text=🛠️ 技術スタック')).toBeVisible()
    await expect(page.locator('text=🚀 ルーティング機能')).toBeVisible()

    // 技術スタックの詳細確認（メインコンテンツエリア内のみ）
    await expect(page.locator('main strong:has-text("TanStack Router")')).toBeVisible()
    await expect(page.locator('main').getByText('1.120.16')).toBeVisible()
    await expect(page.locator('main strong:has-text("React")')).toBeVisible()
    await expect(page.locator('main').getByText('19.1.0')).toBeVisible()

    // ルーティング機能の確認（見出しレベルで確認）
    await expect(page.getByRole('heading', { name: 'ファイルベース' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'ハッシュルーティング' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '型安全性' })).toBeVisible()
  })
})
