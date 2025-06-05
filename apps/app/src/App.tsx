import './App.css'

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <h1 className="app-title">Study-Github-Agent</h1>
        <button
          className="message-button"
          onClick={() => {
            alert('GitHub Copilot agentとの学習を開始しましょう！🎉')
          }}
        >
          メッセージを表示する
        </button>
      </div>
    </div>
  )
}

export default App
