/**
 * @fileoverview アプリケーションのエントリーポイント
 *
 * @description Reactアプリケーションを DOM にマウントするためのエントリーファイルです。
 * TanStackRouterを使用して、ハッシュルーティング対応のSPAを実現します。
 * React 19の新しい createRoot API を使用して、Strict Mode でアプリケーションをレンダリングします。
 *
 * @author Study GitHub Agent Team
 * @version 0.1.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'

/**
 * TanStackRouterのルーターインスタンス
 *
 * @description ファイルベースルーティングによる自動生成されたルートツリーを使用して、
 * ハッシュルーティング対応のルーターを作成します。
 */
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: createHashHistory(),
})

// TanStackRouterの型推論を有効にするための型宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/**
 * アプリケーションの初期化処理
 *
 * @description DOM の 'root' 要素にTanStackRouterを使用したReactアプリケーションをマウントします。
 * React.StrictMode を使用して開発時の潜在的な問題を検出します。
 *
 * @throws {Error} DOM に 'root' 要素が存在しない場合
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
