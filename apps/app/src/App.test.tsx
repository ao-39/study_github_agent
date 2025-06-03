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
      'Study-Github-Agent'
    )

    // メッセージ表示ボタンが表示されることを確認
    expect(
      screen.getByRole('button', { name: 'メッセージを表示する' })
    ).toBeInTheDocument()
  })

  test('メッセージ表示ボタンが正しく表示される', () => {
    render(<App />)

    const button = screen.getByRole('button', { name: 'メッセージを表示する' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('message-button')
  })

  test('メッセージ表示ボタンをクリックするとアラートが表示される', async () => {
    const user = userEvent.setup()

    // window.alertをモック化
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<App />)

    const button = screen.getByRole('button', { name: 'メッセージを表示する' })
    await user.click(button)

    // アラートが正しいメッセージで呼ばれることを確認
    expect(alertSpy).toHaveBeenCalledWith(
      'GitHub Copilot agentとの学習を開始しましょう！🎉'
    )

    // モックをクリーンアップ
    alertSpy.mockRestore()
  })
})
