# ルーティング機能方針

このドキュメントでは、今後実装予定のSPA（Single Page Application）ルーティング機能の設計方針と実装計画を説明します。

## ルーティング機能の目的

### 学習目標
- **SPA設計**: シングルページアプリケーションの設計パターン学習
- **ユーザーエクスペリエンス**: スムーズなページ遷移とナビゲーション体験
- **SEO対応**: 検索エンジン最適化を考慮したルーティング設計
- **状態管理**: ナビゲーション状態とアプリケーション状態の管理

### 実装予定機能
- **基本ルーティング**: パス設定とコンポーネントマッピング
- **動的ルーティング**: パラメータベースのページ生成
- **認証ルーティング**: 認証状態に基づくアクセス制御
- **プログラマティックナビゲーション**: コード内からの画面遷移

## 技術選定

### メインライブラリ: React Router v6
```json
{
  "dependencies": {
    "react-router-dom": "^6.26.0",
    "@types/react-router-dom": "^5.3.3"
  }
}
```

### 選定理由
- **React統合**: Reactエコシステムとの優れた統合
- **型安全性**: TypeScriptサポート
- **パフォーマンス**: 遅延読み込み（lazy loading）対応
- **豊富な機能**: 高度なルーティング機能をサポート
- **コミュニティ**: 活発な開発と豊富なドキュメント

## アーキテクチャ設計

### ルーティング階層構造
```
App Router
├── Public Routes（認証不要）
│   ├── / (Home)
│   ├── /about (About)
│   ├── /contact (Contact)
│   └── /login (Login)
├── Protected Routes（認証必要）
│   ├── /dashboard (Dashboard)
│   ├── /profile (Profile)
│   └── /settings (Settings)
├── Admin Routes（管理者権限）
│   ├── /admin (Admin Dashboard)
│   └── /admin/users (User Management)
└── Error Routes（エラー処理）
    ├── /404 (Not Found)
    └── /error (General Error)
```

### ディレクトリ構造
```
src/
├── router/                     # ルーティング設定
│   ├── index.tsx              # メインルーター設定
│   ├── AppRouter.tsx          # アプリケーションルーター
│   ├── ProtectedRoute.tsx     # 認証が必要なルートのラッパー
│   ├── AdminRoute.tsx         # 管理者権限が必要なルートのラッパー
│   └── routes/                # ルート定義
│       ├── publicRoutes.tsx   # パブリックルート
│       ├── protectedRoutes.tsx # 保護されたルート
│       └── adminRoutes.tsx    # 管理者ルート
├── pages/                      # ページコンポーネント
│   ├── public/                # パブリックページ
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── LoginPage.tsx
│   ├── protected/             # 認証が必要なページ
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   ├── admin/                 # 管理者ページ
│   │   ├── AdminDashboardPage.tsx
│   │   └── UserManagementPage.tsx
│   └── error/                 # エラーページ
│       ├── NotFoundPage.tsx
│       └── ErrorPage.tsx
├── components/
│   ├── navigation/            # ナビゲーション関連
│   │   ├── Navbar.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── NavigationGuard.tsx
│   └── layout/                # レイアウト
│       ├── PublicLayout.tsx
│       ├── ProtectedLayout.tsx
│       └── AdminLayout.tsx
└── hooks/
    ├── useNavigation.ts       # ナビゲーション操作フック
    ├── useAuth.ts             # 認証状態管理フック
    └── useBreadcrumb.ts       # パンくずリスト管理フック
```

## ルーター実装

### メインルーター設定
```typescript
// src/router/AppRouter.tsx
import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { PublicLayout } from '../components/layout/PublicLayout'
import { ProtectedLayout } from '../components/layout/ProtectedLayout'
import { AdminLayout } from '../components/layout/AdminLayout'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorPage } from '../pages/error/ErrorPage'
import { NotFoundPage } from '../pages/error/NotFoundPage'

// 遅延読み込み対応
const HomePage = lazy(() => import('../pages/public/HomePage'))
const AboutPage = lazy(() => import('../pages/public/AboutPage'))
const ContactPage = lazy(() => import('../pages/public/ContactPage'))
const LoginPage = lazy(() => import('../pages/public/LoginPage'))
const DashboardPage = lazy(() => import('../pages/protected/DashboardPage'))
const ProfilePage = lazy(() => import('../pages/protected/ProfilePage'))
const SettingsPage = lazy(() => import('../pages/protected/SettingsPage'))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // パブリックルート
      {
        path: '',
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'login', element: <LoginPage /> },
        ],
      },
      // 保護されたルート
      {
        path: 'dashboard',
        element: <ProtectedRoute><ProtectedLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
      // 管理者ルート
      {
        path: 'admin',
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <UserManagementPage /> },
        ],
      },
      // 404ページ
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

const RootLayout: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  )
}

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}
```

### 認証保護ルート
```typescript
// src/router/ProtectedRoute.tsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: string
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { user, isLoading, hasRole } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  // 認証が必要だが未認証の場合
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // 特定の役割が必要だが権限がない場合
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// 管理者専用ルート
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/login">
      {children}
    </ProtectedRoute>
  )
}
```

### プログラマティックナビゲーション
```typescript
// src/hooks/useNavigation.ts
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useCallback } from 'react'

export const useNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const goTo = useCallback((path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options)
  }, [navigate])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const goForward = useCallback(() => {
    navigate(1)
  }, [navigate])

  const reload = useCallback(() => {
    window.location.reload()
  }, [])

  const redirectTo = useCallback((path: string, delay = 0) => {
    setTimeout(() => {
      navigate(path, { replace: true })
    }, delay)
  }, [navigate])

  const getCurrentPath = useCallback(() => {
    return location.pathname
  }, [location.pathname])

  const isCurrentPath = useCallback((path: string) => {
    return location.pathname === path
  }, [location.pathname])

  const getQueryParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  return {
    goTo,
    goBack,
    goForward,
    reload,
    redirectTo,
    getCurrentPath,
    isCurrentPath,
    getQueryParams,
    currentPath: location.pathname,
    currentSearch: location.search,
    currentParams: params,
    currentState: location.state,
  }
}

// 使用例
const SomeComponent: React.FC = () => {
  const { goTo, goBack, isCurrentPath } = useNavigation()

  const handleLogin = () => {
    // ログイン処理後にダッシュボードに遷移
    goTo('/dashboard')
  }

  const handleCancel = () => {
    // 前のページに戻る
    goBack()
  }

  return (
    <div>
      <button
        onClick={handleLogin}
        className={isCurrentPath('/login') ? 'active' : ''}
      >
        ログイン
      </button>
      <button onClick={handleCancel}>
        戻る
      </button>
    </div>
  )
}
```

## ナビゲーション機能

### ナビゲーションバー
```typescript
// src/components/navigation/Navbar.tsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { t } = useTranslation('navigation')

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          {t('appName')}
        </NavLink>
      </div>
      
      <div className="navbar-menu">
        <div className="navbar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {t('home')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {t('about')}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {t('contact')}
          </NavLink>
          
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {t('dashboard')}
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {t('profile')}
              </NavLink>
              <button onClick={logout} className="nav-button">
                {t('logout')}
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('login')}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
```

### パンくずリスト
```typescript
// src/components/navigation/Breadcrumb.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useBreadcrumb } from '../../hooks/useBreadcrumb'

export const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const { getBreadcrumbItems } = useBreadcrumb()
  
  const breadcrumbItems = getBreadcrumbItems(location.pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className="breadcrumb" aria-label="パンくずリスト">
      <ol className="breadcrumb-list">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <li key={item.path} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="breadcrumb-link">
                  {item.label}
                </Link>
              )}
              {!isLast && <span className="breadcrumb-separator">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// src/hooks/useBreadcrumb.ts
import { useTranslation } from './useTranslation'

interface BreadcrumbItem {
  path: string
  label: string
}

export const useBreadcrumb = () => {
  const { t } = useTranslation('navigation')

  const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = [
      { path: '/', label: t('home') }
    ]

    let currentPath = ''
    for (const path of paths) {
      currentPath += `/${path}`
      
      // パス名から表示ラベルをマッピング
      const label = getBreadcrumbLabel(path)
      items.push({ path: currentPath, label })
    }

    return items
  }

  const getBreadcrumbLabel = (path: string): string => {
    const labelMap: Record<string, string> = {
      'dashboard': t('dashboard'),
      'profile': t('profile'),
      'settings': t('settings'),
      'admin': t('admin'),
      'about': t('about'),
      'contact': t('contact'),
    }

    return labelMap[path] || path
  }

  return { getBreadcrumbItems }
}
```

## SEO対応

### メタタグ管理
```typescript
// src/hooks/useDocumentTitle.ts
import { useEffect } from 'react'
import { useTranslation } from './useTranslation'

export const useDocumentTitle = (titleKey: string, namespace?: string) => {
  const { t } = useTranslation(namespace)

  useEffect(() => {
    const title = t(titleKey)
    const appName = t('appName', { ns: 'common' })
    document.title = title ? `${title} - ${appName}` : appName
  }, [t, titleKey])
}

// ページコンポーネントでの使用例
const AboutPage: React.FC = () => {
  useDocumentTitle('aboutPageTitle', 'pages')
  
  return (
    <div>
      <h1>About Us</h1>
      {/* ページコンテンツ */}
    </div>
  )
}
```

### 構造化データ
```typescript
// src/components/seo/StructuredData.tsx
import React from 'react'
import { Helmet } from 'react-helmet-async'

interface StructuredDataProps {
  type: 'WebSite' | 'WebPage' | 'Article' | 'Organization'
  data: Record<string, any>
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  )
}
```

## 実装計画

### フェーズ1: 基本ルーティング（〜2024年Q2）
- [ ] React Router v6のセットアップ
- [ ] 基本的なページルーティング実装
- [ ] ナビゲーションコンポーネントの作成
- [ ] レイアウトシステムの構築

### フェーズ2: 認証・認可（〜2024年Q3）
- [ ] 認証システムの実装
- [ ] 保護されたルートの実装
- [ ] 権限ベースのアクセス制御
- [ ] ログイン・ログアウト機能

### フェーズ3: 高度なナビゲーション（〜2024年Q4）
- [ ] 動的ルーティング（パラメータ対応）
- [ ] パンくずリスト機能
- [ ] ナビゲーションガード
- [ ] 遅延読み込み最適化

### フェーズ4: SEO・UX最適化（2025年〜）
- [ ] メタタグ管理システム
- [ ] 構造化データ対応
- [ ] パフォーマンス最適化
- [ ] アクセシビリティ改善

## パフォーマンス最適化

### コード分割
```typescript
// 動的インポートによる遅延読み込み
const HomePage = lazy(() => import('../pages/public/HomePage'))
const DashboardPage = lazy(() => 
  import('../pages/protected/DashboardPage').then(module => ({
    default: module.DashboardPage
  }))
)

// プリロード対応
const preloadDashboard = () => {
  import('../pages/protected/DashboardPage')
}

// ユーザーがログインボタンにホバーした時にプリロード
<button onMouseEnter={preloadDashboard} onClick={handleLogin}>
  ログイン
</button>
```

### ルートベースの分割
```typescript
// src/router/routes/lazyRoutes.ts
export const lazyRoutes = {
  // パブリックページ
  HomePage: lazy(() => import('../../pages/public/HomePage')),
  AboutPage: lazy(() => import('../../pages/public/AboutPage')),
  
  // 認証が必要なページ（別バンドル）
  DashboardPage: lazy(() => import('../../pages/protected/DashboardPage')),
  ProfilePage: lazy(() => import('../../pages/protected/ProfilePage')),
  
  // 管理者ページ（別バンドル）
  AdminDashboardPage: lazy(() => import('../../pages/admin/AdminDashboardPage')),
}
```

## テスト戦略

### ルーティングテスト
```typescript
// src/router/__tests__/AppRouter.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRouter } from '../AppRouter'
import { AuthProvider } from '../../providers/AuthProvider'

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('AppRouter', () => {
  test('ホームページが正しく表示される', async () => {
    renderWithRouter(['/'])
    
    await waitFor(() => {
      expect(screen.getByText('ホームページ')).toBeInTheDocument()
    })
  })

  test('認証が必要なページは未認証時にログインページにリダイレクトされる', async () => {
    renderWithRouter(['/dashboard'])
    
    await waitFor(() => {
      expect(screen.getByText('ログイン')).toBeInTheDocument()
    })
  })

  test('存在しないパスは404ページを表示する', async () => {
    renderWithRouter(['/non-existent-path'])
    
    await waitFor(() => {
      expect(screen.getByText('ページが見つかりません')).toBeInTheDocument()
    })
  })
})
```

このルーティング機能方針により、ユーザビリティとパフォーマンスを両立した、スケーラブルなSPAアプリケーションの構築を目指します。