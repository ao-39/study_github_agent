/**
 * @fileoverview メインアプリケーションコンポーネント（現在未使用）
 *
 * @description このファイルは以前のSPAアプリケーションのメインコンポーネントでした。
 * 現在はTanStackRouterのルーティングシステムに置き換えられており、
 * main.tsxから直接RouterProviderが使用されています。
 *
 * テスト用途のために保持されています。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import './App.css'

/**
 * レガシーメインアプリケーションコンポーネント
 *
 * @description 現在は使用されていませんが、テスト用途のために保持されています。
 * TanStackRouterのルーティングシステムに置き換えられました。
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
