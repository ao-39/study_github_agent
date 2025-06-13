import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

/**
 * TanStackRouterアプリケーションの統合テスト
 * ルーティング機能とページコンポーネントをテストします
 */

/**
 * テスト用のルーターを作成するヘルパー関数
 *
 * @param initialEntries - 初期ルート
 * @returns テスト用ルーターインスタンス
 */
function createTestRouter(initialEntries: string[] = ['/']) {
  return createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries,
    }),
  })
}

/**
 * RouterProviderをラップしたレンダリングヘルパー
 *
 * @param initialEntries - 初期ルート
 * @returns レンダリング結果
 */
function renderWithRouter(initialEntries: string[] = ['/']) {
  const router = createTestRouter(initialEntries)
  return render(<RouterProvider router={router} />)
}

describe('TanStackRouter アプリケーション', () => {
  test('ホームページが正常にレンダリングされる', async () => {
    renderWithRouter(['/'])

    // ページタイトルが表示されることを確認
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      'Study-Github-Agent'
    )

    // 学習メッセージボタンが表示されることを確認
    expect(
      await screen.findByRole('button', { name: '学習メッセージを表示' })
    ).toBeInTheDocument()

    // 機能紹介セクションが表示されることを確認
    expect(screen.getByText('🚀 機能紹介')).toBeInTheDocument()
    expect(
      screen.getByText('TanStackRouterのファイルベースルーティング')
    ).toBeInTheDocument()
  })

  test('Aboutページが正常にレンダリングされる', async () => {
    renderWithRouter(['/about'])

    // ページタイトルが表示されることを確認
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      '📚 プロジェクトについて'
    )

    // プロジェクト目的セクションが表示されることを確認
    expect(screen.getByText('🎯 プロジェクトの目的')).toBeInTheDocument()

    // 技術スタックセクションが表示されることを確認
    expect(screen.getByText('🛠️ 技術スタック')).toBeInTheDocument()
    expect(screen.getByText('TanStack Router')).toBeInTheDocument()
  })

  test('ナビゲーションリンクが正しく機能する', async () => {
    renderWithRouter(['/'])

    // DOM構造を確認してからテストを実行
    await screen.findByRole('heading', { level: 1 })

    // アンカータグを直接検索する（aタグはrole="link"を持つ）
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3) // ホーム、About、デバッグの3つ

    // ホームリンク、About リンク、デバッグリンクを確認
    const homeLink = links.find(link => link.textContent === 'ホーム')
    const aboutLink = links.find(link => link.textContent === 'About')
    const debugLink = links.find(link => link.textContent === '🔧 デバッグ')

    expect(homeLink).toHaveAttribute('href', '#/')
    expect(aboutLink).toHaveAttribute('href', '#/about')
    expect(debugLink).toHaveAttribute('href', '#/debug')
  })

  test('学習メッセージボタンをクリックするとアラートが表示される', async () => {
    const user = userEvent.setup()

    // window.alertをモック化
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    renderWithRouter(['/'])

    const button = await screen.findByRole('button', {
      name: '学習メッセージを表示',
    })
    await user.click(button)

    // アラートが正しいメッセージで呼ばれることを確認
    expect(alertSpy).toHaveBeenCalledWith(
      'TanStackRouterでのファイルベースルーティング学習を開始しましょう！🚀'
    )

    // モックをクリーンアップ
    alertSpy.mockRestore()
  })

  test('存在しないパスでは404ページが表示される', async () => {
    renderWithRouter(['/non-existent-path'])

    // 404メッセージが表示されることを確認
    expect(
      await screen.findByText('404 - ページが見つかりません')
    ).toBeInTheDocument()
    expect(
      screen.getByText('お探しのページは存在しません。')
    ).toBeInTheDocument()

    // ホームに戻るリンクが表示されることを確認
    const homeLink = screen.getByRole('link', { name: 'ホームに戻る' })
    expect(homeLink).toHaveAttribute('href', '#/')
  })

  test('デバッグページが正常にレンダリングされる', async () => {
    renderWithRouter(['/debug'])

    // デバッグページの主要な要素が表示されることを確認
    expect(
      await screen.findByText('🔧 開発者用デバッグページ')
    ).toBeInTheDocument()
    expect(
      screen.getByText('アプリケーションのビルド情報と環境変数を確認できます')
    ).toBeInTheDocument()

    // 各セクションの見出しが表示されることを確認
    expect(screen.getByText('📱 アプリケーション情報')).toBeInTheDocument()
    expect(screen.getByText('⚙️ ビルド時環境変数')).toBeInTheDocument()
    expect(screen.getByText('🌐 実行時環境情報')).toBeInTheDocument()

    // 環境変数の項目が表示されることを確認
    expect(screen.getByText('VITE_ENABLE_PWA:')).toBeInTheDocument()
    expect(screen.getByText('GITHUB_PAGES:')).toBeInTheDocument()
    expect(screen.getByText('ANALYZE:')).toBeInTheDocument()

    // アプリケーション情報の項目が表示されることを確認
    expect(screen.getByText('バージョン:')).toBeInTheDocument()
    expect(screen.getByText('ビルド時刻:')).toBeInTheDocument()
  })
})
