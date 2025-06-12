# ルーティング機能方針

このドキュメントでは、TanStackRouterを使用したファイルベースルーティングの設計方針と実装について説明します。

## ルーティング機能の目的

### 学習目標
- **SPA設計**: シングルページアプリケーションの設計パターン学習
- **ファイルベースルーティング**: TanStackRouterによる現代的なルーティング
- **型安全性**: TypeScriptを活用した完全な型推論
- **ユーザーエクスペリエンス**: スムーズなページ遷移とナビゲーション体験
- **SEO対応**: 検索エンジン最適化を考慮したルーティング設計
- **状態管理**: ナビゲーション状態とアプリケーション状態の管理

### 実装済み機能
- **ファイルベースルーティング**: ディレクトリ構造による直感的なルート定義
- **ハッシュルーティング**: 静的ホスティング対応（`#/` 形式）
- **自動ルート生成**: TypeScript型安全なルートツリー自動生成
- **開発者ツール統合**: リアルタイムデバッグ機能

## 技術選定

### メインライブラリ: TanStack Router v1.120.16
```json
{
  "dependencies": {
    "@tanstack/react-router": "^1.120.16"
  },
  "devDependencies": {
    "@tanstack/react-router-devtools": "^1.120.16",
    "@tanstack/router-cli": "^1.120.16"
  }
}
```

### 選定理由
- **ファイルベース**: Next.jsライクな直感的なルート定義
- **完全な型安全性**: TypeScriptファーストな設計
- **自動コード生成**: ルートツリーの自動生成による開発効率化
- **ハッシュルーティング**: 静的ホスティングサービス対応
- **パフォーマンス**: 自動的なコード分割とプリロード機能
- **開発体験**: 充実した開発者ツールとデバッグ機能

### React Routerからの変更理由
- **型安全性の向上**: より強力なTypeScript統合
- **ファイルベース**: 設定ファイルでの複雑な定義が不要
- **自動化**: ルート定義の手動メンテナンスが不要
- **現代的なAPI**: より直感的で使いやすいAPI設計

## アーキテクチャ設計

### ルーティング階層構造
```
App Router (Hash-based)
├── / (Home)                    # ホームページ
├── /about (About)              # プロジェクト概要
└── /404 (Not Found)           # 404エラーページ
```

### ディレクトリ構造
```
src/
├── routes/                     # ルートディレクトリ（TanStackRouter）
│   ├── __root.tsx             # ルートレイアウト
│   ├── index.tsx              # ホームページ（/）
│   └── about.tsx              # Aboutページ（/about）
├── routeTree.gen.ts           # 自動生成されるルートツリー（Git除外）
├── main.tsx                   # ルーター初期化とアプリエントリー
└── App.tsx                    # レガシーコンポーネント（テスト用保持）
```

## ルーター実装

### メインルーター設定
```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: createHashHistory(), // ハッシュルーティング
})

// 型推論のための宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

### ルートレイアウト
```typescript
// src/routes/__root.tsx
import React, { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootComponent: React.FC = () => {
  const isTestEnvironment = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <a href="#/" style={{ marginRight: '1rem' }}>ホーム</a>
        <a href="#/about">About</a>
      </nav>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Suspense fallback={<div>読み込み中...</div>}>
          <Outlet />
        </Suspense>
      </main>
      {!isTestEnvironment && <TanStackRouterDevtools />}
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しません。</p>
      <a href="#/">ホームに戻る</a>
    </div>
  )
})
```

### ページルート例
```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

const HomePage: React.FC = () => {
  const handleMessageClick = () => {
    alert('TanStackRouterでのファイルベースルーティング学習を開始しましょう！🚀')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Study-Github-Agent</h1>
      <p>TanStackRouterを使用したファイルベースルーティングの学習プロジェクトです。</p>
      <button onClick={handleMessageClick}>
        学習メッセージを表示
      </button>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
```

## ハッシュルーティング

### 設定と動作
- **URL形式**: `https://example.com/#/about`
- **設定方法**: `createHashHistory()`を使用
- **利点**: 静的ホスティングサービスでの設定不要運用

### 対応サービス
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 Static Website Hosting

## 開発ワークフロー

### CLIコマンド設定
```json
{
  "scripts": {
    "dev": "tsr watch --open=false & vite",
    "build": "tsr generate && tsc && vite build",
    "routes:generate": "tsr generate",
    "routes:watch": "tsr watch --open=false"
  }
}
```

### 自動ルート生成
- ファイル保存時の自動更新
- TypeScript型定義の自動生成
- 開発サーバーでのホットリロード

## テスト戦略

### ルーティングテスト
```typescript
// src/App.test.tsx
import { render, screen } from '@testing-library/react'
import { RouterProvider, createRouter, createMemoryHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

function createTestRouter(initialEntries: string[] = ['/']) {
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries }),
  })
}

function renderWithRouter(initialEntries: string[] = ['/']) {
  const router = createTestRouter(initialEntries)
  return render(<RouterProvider router={router} />)
}

describe('TanStackRouter アプリケーション', () => {
  test('ホームページが正常にレンダリングされる', async () => {
    renderWithRouter(['/'])
    expect(await screen.findByRole('heading', { level: 1 }))
      .toHaveTextContent('Study-Github-Agent')
  })
  
  test('404ページが正しく表示される', async () => {
    renderWithRouter(['/non-existent-path'])
    expect(await screen.findByText('404 - ページが見つかりません'))
      .toBeInTheDocument()
  })
})
```

### テスト環境での考慮事項
- 開発者ツールの自動無効化
- メモリヒストリーの使用
- ルート遷移のテスト

## 実装済み機能

### フェーズ1: 基本ルーティング ✅
- [x] TanStack Router v1.120.16のセットアップ
- [x] ファイルベースルーティング実装
- [x] ハッシュルーティング設定
- [x] 基本的なページルーティング実装
- [x] ナビゲーションコンポーネントの作成
- [x] レイアウトシステムの構築
- [x] 404エラーハンドリング

### 今後の拡張予定

#### フェーズ2: 高度なルーティング機能
- [ ] 動的ルーティング（パラメータ対応）
- [ ] 検索パラメータの型安全な管理
- [ ] ローダー機能によるデータフェッチ
- [ ] 遅延読み込み最適化

#### フェーズ3: 認証・認可
- [ ] 認証システムの実装
- [ ] 保護されたルートの実装
- [ ] 権限ベースのアクセス制御
- [ ] ログイン・ログアウト機能

#### フェーズ4: UX・パフォーマンス最適化
- [ ] プリロード戦略の最適化
- [ ] エラーバウンダリの強化
- [ ] SEOメタデータ管理
- [ ] アクセシビリティ改善

## パフォーマンス最適化

### 自動コード分割
```typescript
// TanStackRouterは自動的にルートベースのコード分割を実行
// 追加設定不要でパフォーマンス最適化

// カスタムコード分割（必要に応じて）
import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const HeavyComponent = lazy(() => import('../components/HeavyComponent'))

export const Route = createFileRoute('/heavy')({
  component: () => (
    <Suspense fallback={<div>読み込み中...</div>}>
      <HeavyComponent />
    </Suspense>
  ),
})
```

### プリロード戦略
```typescript
const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // マウスホバー時にプリロード
  // defaultPreload: 'viewport', // ビューポート内のリンクをプリロード
})
```

## ベストプラクティス

### 1. ファイル命名規則
- `index.tsx`: ルートページ（`/`）
- `about.tsx`: 静的ページ（`/about`）
- `$id.tsx`: 動的パラメータ（`/users/123`）
- `[...all].tsx`: キャッチオールルート

### 2. TypeScript活用
- 自動生成される型定義の活用
- パラメータ・検索クエリの型安全性
- ルートナビゲーションの型チェック

### 3. エラーハンドリング
- ルートレベルでのエラーバウンダリ
- 404ページの適切な実装
- ユーザーフレンドリーなエラーメッセージ

### 4. テスト戦略
- ルート単位でのテスト
- ナビゲーション機能のテスト
- エラーケースのテスト

## 関連ドキュメント

- [TanStackRouter実装ガイド](../development/tanstack-router-guide.md) - 詳細な実装手順
- [アーキテクチャ概要](./overview.md) - プロジェクト全体設計
- [開発ガイド](../development/) - 開発環境とワークフロー

このルーティング機能により、現代的で保守性の高い、型安全なSPAアプリケーションの構築を実現しています。