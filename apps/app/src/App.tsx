import './App.css'

/**
 * メインアプリケーションコンポーネント
 *
 * @description GitHub Copilot agentの学習用Reactアプリケーションのルートコンポーネントです。
 * シンプルなボタンクリックでメッセージを表示する機能を提供します。
 *
 * @returns Reactエレメント - アプリケーションのメインコンテンツ
 *
 * @example
 * ```tsx
 * import App from './App'
 *
 * function MainApp() {
 *   return <App />
 * }
 * ```
 */
function App() {
  /**
   * メッセージ表示ボタンのクリックハンドラー
   *
   * @description GitHub Copilot agentとの学習開始を知らせるアラートを表示します。
   *
   * @returns void
   */
  const handleMessageClick = () => {
    alert('GitHub Copilot agentとの学習を開始しましょう！🎉')
  }

  return (
    <div className="app">
      <div className="app-container">
        <h1 className="app-title">Study-Github-Agent</h1>
        <button className="message-button" onClick={handleMessageClick}>
          メッセージを表示する
        </button>
      </div>
    </div>
  )
}

export default App
