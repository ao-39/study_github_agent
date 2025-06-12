# TanStackRouterによるファイルベースルーティング実装ガイド

このドキュメントでは、TanStackRouterを使用したファイルベースルーティングの実装について詳しく説明します。

## 概要

TanStackRouterは、React向けの現代的なルーティングライブラリで、以下の特徴を持ちます：

- **ファイルベースルーティング**: Next.jsのようなファイル構造によるルート定義
- **完全な型安全性**: TypeScriptによる強力な型推論
- **ハッシュルーティング対応**: 静的ホスティングサービスでの運用に最適
- **自動コード生成**: ルートツリーの自動生成による開発効率化

## プロジェクト構造

### ディレクトリ構成

```
src/
├── routes/                     # ルートディレクトリ
│   ├── __root.tsx             # ルートレイアウト
│   ├── index.tsx              # ホームページ（/）
│   └── about.tsx              # Aboutページ（/about）
├── routeTree.gen.ts           # 自動生成されるルートツリー
└── main.tsx                   # アプリケーションエントリーポイント
```

### ルートファイルの命名規則

| ファイル名 | 対応するルート | 説明 |
|------------|---------------|------|
| `__root.tsx` | すべてのルート | アプリケーション全体の共通レイアウト |
| `index.tsx` | `/` | ホームページ |
| `about.tsx` | `/about` | Aboutページ |
| `[id].tsx` | `/123` | 動的ルート（パラメータ付き） |
| `[...all].tsx` | `/any/path` | キャッチオールルート |

## セットアップと設定

### 1. 依存関係のインストール

```bash
# メインライブラリ
pnpm add @tanstack/react-router

# 開発ツール
pnpm add -D @tanstack/react-router-devtools @tanstack/router-cli
```

### 2. TanStackRouter CLI設定

`tsr.config.json`を作成：

```json
{
  "routesDirectory": "./src/routes",
  "generatedRouteTree": "./src/routeTree.gen.ts",
  "routeFileIgnorePrefix": "-",
  "quoteStyle": "single",
  "semicolons": false,
  "disableTypes": false
}
```

### 3. package.jsonスクリプト設定

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

## ルーティング実装

### ルートレイアウト (`__root.tsx`)

```typescript
import React, { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootComponent: React.FC = () => {
  const isTestEnvironment = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
  
  return (
    <div>
      <nav>
        <a href="#/">ホーム</a>
        <a href="#/about">About</a>
      </nav>
      <main>
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
  notFoundComponent: () => <div>404 - ページが見つかりません</div>
})
```

### ページルート (`index.tsx`)

```typescript
import { createFileRoute } from '@tanstack/react-router'

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>ホームページ</h1>
      <p>TanStackRouterによるファイルベースルーティング</p>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
```

### メインエントリーポイント (`main.tsx`)

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: createHashHistory(), // ハッシュルーティング
})

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

## ハッシュルーティング

### 設定方法

ハッシュルーティングを有効にするには、`createHashHistory()`を使用します：

```typescript
import { createHashHistory } from '@tanstack/react-router'

const router = createRouter({
  routeTree,
  history: createHashHistory(),
})
```

### URL形式

- 通常のルーティング: `https://example.com/about`
- ハッシュルーティング: `https://example.com/#/about`

### メリット

1. **静的ホスティング対応**: GitHub Pages、Netlify、Vercelなどで設定なしで動作
2. **サーバー設定不要**: リライトルール設定が不要
3. **シンプルな運用**: CDNやプロキシの複雑な設定が不要

## 開発ワークフロー

### 1. ルートファイルの作成

新しいページを追加する場合：

```bash
# 新しいルートファイルを作成
touch src/routes/contact.tsx
```

```typescript
// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'

const ContactPage: React.FC = () => {
  return <div>お問い合わせページ</div>
}

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})
```

### 2. 自動的なルート生成

ファイル保存時に自動的にルートツリーが更新されます：

```bash
# 開発サーバー起動（ルート監視含む）
pnpm dev

# 手動でルート生成
pnpm routes:generate
```

### 3. 型安全なナビゲーション

```typescript
import { Link, useNavigate } from '@tanstack/react-router'

// Link コンポーネント
<Link to="/about" className="nav-link">
  About
</Link>

// プログラマティックナビゲーション
const navigate = useNavigate()
navigate({ to: '/contact' })
```

## テスト戦略

### ルーティングのテスト

```typescript
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

test('ホームページが正常に表示される', async () => {
  renderWithRouter(['/'])
  expect(await screen.findByText('ホームページ')).toBeInTheDocument()
})
```

## 高度な機能

### 1. パラメータ付きルート

```typescript
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  component: UserProfile,
})

function UserProfile() {
  const { userId } = Route.useParams()
  return <div>ユーザーID: {userId}</div>
}
```

### 2. 検索パラメータ

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/products')({
  component: ProductList,
  validateSearch: searchSchema,
})

function ProductList() {
  const { page, search } = Route.useSearch()
  return <div>ページ: {page}, 検索: {search}</div>
}
```

### 3. ローダー（データフェッチ）

```typescript
export const Route = createFileRoute('/users/$userId')({
  component: UserProfile,
  loader: async ({ params }) => {
    const user = await fetchUser(params.userId)
    return { user }
  },
})

function UserProfile() {
  const { user } = Route.useLoaderData()
  return <div>{user.name}</div>
}
```

## ベストプラクティス

### 1. コード分割

```typescript
import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const LazyComponent = lazy(() => import('../components/HeavyComponent'))

export const Route = createFileRoute('/heavy')({
  component: () => (
    <Suspense fallback={<div>読み込み中...</div>}>
      <LazyComponent />
    </Suspense>
  ),
})
```

### 2. エラーハンドリング

```typescript
export const Route = createFileRoute('/error-prone')({
  component: ErrorProneComponent,
  errorComponent: ({ error }) => (
    <div>エラーが発生しました: {error.message}</div>
  ),
})
```

### 3. メタデータとSEO

```typescript
export const Route = createFileRoute('/about')({
  component: AboutPage,
  meta: () => [
    { title: 'About - MyApp' },
    { name: 'description', content: 'About page description' }
  ],
})
```

## デバッグとトラブルシューティング

### 1. ルート生成の確認

```bash
# ルートツリーを手動生成
pnpm routes:generate

# 生成されたファイルを確認
cat src/routeTree.gen.ts
```

### 2. 開発者ツール

開発環境では、画面下部にTanStackRouterDevtoolsが表示され、以下の情報を確認できます：

- 現在のルート情報
- ルートパラメータ
- 検索パラメータ
- ローダーデータ

### 3. よくある問題と解決法

#### ルートが認識されない
- ファイル名が正しいか確認
- `tsr generate`を手動実行
- `src/routeTree.gen.ts`が更新されているか確認

#### 型エラーが発生する
- `declare module '@tanstack/react-router'`が正しく設定されているか確認
- `routeTree.gen.ts`をインポートしているか確認

#### ハッシュルーティングが動作しない
- `createHashHistory()`を使用しているか確認
- リンクが`#/path`形式になっているか確認

## まとめ

TanStackRouterによるファイルベースルーティングは、以下の利点を提供します：

1. **開発効率の向上**: ファイル構造による直感的なルート管理
2. **型安全性**: TypeScriptによる強力な型推論
3. **運用の簡素化**: ハッシュルーティングによる静的ホスティング対応
4. **パフォーマンス**: 自動的なコード分割とプリロード
5. **開発体験**: 充実した開発者ツールとデバッグ機能

このガイドを参考に、効率的で保守性の高いルーティングシステムを構築してください。