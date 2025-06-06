/**
 * @fileoverview ホームページルートコンポーネント
 *
 * @description アプリケーションのホームページを表示するルートコンポーネントです。
 * TanStackRouterのファイルベースルーティングでルート（/）に対応します。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

/**
 * ホームページコンポーネント
 *
 * @description アプリケーションのメインページコンテンツを表示します。
 * ハッシュルーティングに対応したウェルカムメッセージとサンプル機能を提供します。
 *
 * @returns Reactエレメント - ホームページのコンテンツ
 */
const HomePage: React.FC = () => {
  /**
   * メッセージ表示ボタンのクリックハンドラー
   *
   * @description TanStackRouterを使用したルーティング学習を開始するメッセージを表示します。
   *
   * @returns void
   */
  const handleMessageClick = () => {
    alert(
      'TanStackRouterでのファイルベースルーティング学習を開始しましょう！🚀'
    )
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          color: '#343a40',
          marginBottom: '1rem',
        }}
      >
        Study-Github-Agent
      </h1>

      <p
        style={{
          fontSize: '1.2rem',
          color: '#6c757d',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}
      >
        TanStackRouterを使用したファイルベースルーティングの学習プロジェクトです。
        <br />
        ハッシュルーティングを使用して、SPAのナビゲーションを実現しています。
      </p>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #dee2e6',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            color: '#495057',
            marginBottom: '1rem',
          }}
        >
          🚀 機能紹介
        </h2>

        <ul
          style={{
            textAlign: 'left',
            display: 'inline-block',
            fontSize: '1rem',
            color: '#6c757d',
          }}
        >
          <li>TanStackRouterのファイルベースルーティング</li>
          <li>ハッシュルーティング対応（`#/` 形式）</li>
          <li>型安全なルート定義</li>
          <li>自動的なコード分割とルート生成</li>
          <li>開発者ツール統合</li>
        </ul>
      </div>

      <button
        onClick={handleMessageClick}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={e => {
          ;(e.target as HTMLButtonElement).style.backgroundColor = '#0056b3'
        }}
        onMouseOut={e => {
          ;(e.target as HTMLButtonElement).style.backgroundColor = '#007bff'
        }}
      >
        学習メッセージを表示
      </button>

      <div
        style={{
          marginTop: '3rem',
          padding: '1rem',
          backgroundColor: '#e7f3ff',
          borderRadius: '5px',
          border: '1px solid #b3d9ff',
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            color: '#004085',
            marginBottom: '0.5rem',
          }}
        >
          📚 学習ポイント
        </h3>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#004085',
            margin: 0,
          }}
        >
          このプロジェクトでは、TanStackRouterの基本的な使い方から、
          ファイルベースルーティングの実装まで学習できます。
        </p>
      </div>
    </div>
  )
}

/**
 * ホームページルートの定義
 *
 * @description TanStackRouterのファイルベースルーティングで
 * ルートパス（/）に対応するルートを定義します。
 */
export const Route = createFileRoute('/')({
  component: HomePage,
})
