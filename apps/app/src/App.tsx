import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Study GitHub Agent</h1>
        <p>GitHub Copilot agentを学習するためのReactアプリケーション</p>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>⚡ Vite</h3>
            <p>高速な開発サーバーとビルドツール</p>
          </div>
          <div className="feature-card">
            <h3>⚛️ React</h3>
            <p>モダンなUIライブラリ</p>
          </div>
          <div className="feature-card">
            <h3>📦 Monorepo</h3>
            <p>pnpm + Turborepoによる効率的な管理</p>
          </div>
          <div className="feature-card">
            <h3>🤖 GitHub Copilot</h3>
            <p>AIアシスタントとの協力開発</p>
          </div>
        </div>
        <div className="action-section">
          <button
            className="primary-button"
            onClick={() => {
              alert('GitHub Copilot agentとの学習を開始しましょう！🎉')
            }}
          >
            学習を開始
          </button>
        </div>
      </header>
    </div>
  )
}

export default App
