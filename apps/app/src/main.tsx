/**
 * @fileoverview アプリケーションのエントリーポイント
 *
 * @description Reactアプリケーションを DOM にマウントするためのエントリーファイルです。
 * React 19の新しい createRoot API を使用して、Strict Mode でアプリケーションをレンダリングします。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * アプリケーションの初期化処理
 *
 * @description DOM の 'root' 要素にReactアプリケーションをマウントします。
 * React.StrictMode を使用して開発時の潜在的な問題を検出します。
 *
 * @throws {Error} DOM に 'root' 要素が存在しない場合
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
