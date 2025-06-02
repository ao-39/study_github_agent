import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import App from './App'

/**
 * App コンポーネントの単体テスト
 * Vitestとreact-testing-libraryを使用したコンポーネントテスト
 */
describe('App コンポーネント', () => {
  test('正常にレンダリングされる', () => {
    render(<App />)

    // メインタイトルが表示されることを確認
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '🚀 Study GitHub Agent'
    )

    // 説明文が表示されることを確認
    expect(
      screen.getByText(
        'GitHub Copilot agentを学習するためのReactアプリケーション'
      )
    ).toBeInTheDocument()
  })

  test('4つの機能カードが表示される', () => {
    render(<App />)

    // Viteカード
    expect(screen.getByText('⚡ Vite')).toBeInTheDocument()
    expect(
      screen.getByText('高速な開発サーバーとビルドツール')
    ).toBeInTheDocument()

    // Reactカード
    expect(screen.getByText('⚛️ React')).toBeInTheDocument()
    expect(screen.getByText('モダンなUIライブラリ')).toBeInTheDocument()

    // Monorepoカード
    expect(screen.getByText('📦 Monorepo')).toBeInTheDocument()
    expect(
      screen.getByText('pnpm + Turborepoによる効率的な管理')
    ).toBeInTheDocument()

    // GitHub Copilotカード
    expect(screen.getByText('🤖 GitHub Copilot')).toBeInTheDocument()
    expect(screen.getByText('AIアシスタントとの協力開発')).toBeInTheDocument()
  })

  test('学習開始ボタンが表示される', () => {
    render(<App />)

    const button = screen.getByRole('button', { name: '学習を開始' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('primary-button')
  })

  test('学習開始ボタンをクリックするとアラートが表示される', async () => {
    const user = userEvent.setup()

    // window.alertをモック化
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<App />)

    const button = screen.getByRole('button', { name: '学習を開始' })
    await user.click(button)

    // アラートが正しいメッセージで呼ばれることを確認
    expect(alertSpy).toHaveBeenCalledWith(
      'GitHub Copilot agentとの学習を開始しましょう！🎉'
    )

    // モックをクリーンアップ
    alertSpy.mockRestore()
  })

  test('機能カードのCSSクラスが正しく適用される', () => {
    render(<App />)

    const featureCards = screen.getAllByText(/^(⚡|⚛️|📦|🤖)/)

    featureCards.forEach(card => {
      // h3要素の親（feature-card）のクラスを確認
      const featureCard = card.closest('.feature-card')
      expect(featureCard).toBeInTheDocument()
    })
  })
})
