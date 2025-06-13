/**
 * @fileoverview TanStackRouterのルートレイアウトコンポーネント
 *
 * @description アプリケーション全体の共通レイアウトとナビゲーションを提供します。
 * ハッシュルーティングを使用し、エラーバウンダリとサスペンスを含みます。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import React, { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

/**
 * アプリケーションのメインナビゲーションコンポーネント
 *
 * @description ハッシュルーティングに対応したナビゲーションリンクを提供します。
 *
 * @returns Reactエレメント - ナビゲーションバー
 */
const Navigation: React.FC = () => {
  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: '1rem',
        backgroundColor: '#f8f9fa',
      }}
    >
      <a
        href="#/"
        style={{
          textDecoration: 'none',
          color: '#007bff',
          fontWeight: 'bold',
        }}
      >
        ホーム
      </a>
      <a
        href="#/about"
        style={{
          textDecoration: 'none',
          color: '#007bff',
          fontWeight: 'bold',
        }}
      >
        About
      </a>
      <a
        href="#/debug"
        style={{
          textDecoration: 'none',
          color: '#6c757d',
          fontWeight: 'bold',
          fontSize: '0.9rem',
        }}
      >
        🔧 デバッグ
      </a>
    </nav>
  )
}

/**
 * ローディングスピナーコンポーネント
 *
 * @description ページの遅延読み込み中に表示されるスピナーです。
 *
 * @returns Reactエレメント - ローディングインジケーター
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontSize: '1.2rem',
        color: '#6c757d',
      }}
    >
      読み込み中...
    </div>
  )
}

/**
 * ルートレイアウトコンポーネント
 *
 * @description アプリケーション全体の共通レイアウトを提供します。
 * ナビゲーション、メインコンテンツエリア、開発ツールを含みます。
 *
 * @returns Reactエレメント - ルートレイアウト
 */
const RootComponent: React.FC = () => {
  // テスト環境では開発ツールを無効にする
  const isTestEnvironment =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'test'

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Navigation />
      <main style={{ flex: 1, padding: '2rem' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      {!isTestEnvironment && <TanStackRouterDevtools />}
    </div>
  )
}

/**
 * ルートルートの定義
 *
 * @description TanStackRouterのルートルートを作成し、
 * アプリケーション全体の基本構造を定義します。
 */
export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#dc3545',
        }}
      >
        <h1>404 - ページが見つかりません</h1>
        <p>お探しのページは存在しません。</p>
        <a
          href="#/"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ホームに戻る
        </a>
      </div>
    )
  },
})
