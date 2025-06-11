# テスト戦略とガイド

本プロジェクトのテスト戦略、実装ガイド、ベストプラクティスを説明します。

## テスト戦略概要

### テストピラミッド
本プロジェクトでは以下のテスト戦略を採用しています：

```
       E2E Tests (Playwright)
      ────────────────────────
    Integration Tests (Vitest)
   ──────────────────────────────
Unit Tests (Vitest + Testing Library)
```

### テストフレームワーク
- **ユニットテスト**: Vitest + Testing Library
- **E2Eテスト**: Playwright
- **モック**: MSW (Mock Service Worker)
- **カバレッジ**: Vitest Coverage (v8)

## ユニットテスト（Vitest）

### 基本設定
Vitestの設定は `vite.config.ts` で定義されています：

```typescript
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test-setup.ts'],
  globals: true,
  coverage: {
    enabled: true,
    provider: 'v8',
    reporter: ['text', 'html'],
    reportsDirectory: './test-results/coverage',
  }
}
```

### テスト実行コマンド
```bash
# 基本的なテスト実行
pnpm --filter app test

# ウォッチモードでテスト実行
pnpm --filter app test --watch

# カバレッジ付きテスト実行
pnpm --filter app test:coverage

# UIモードでテスト実行
pnpm --filter app test --ui
```

### テスト構造の基本パターン
```typescript
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserEvent } from '@testing-library/user-event'

describe('コンポーネント名', () => {
  describe('正常系', () => {
    test('基本的な表示が正しく行われる', () => {
      render(<Component />)
      expect(screen.getByText('期待するテキスト')).toBeInTheDocument()
    })

    test('プロパティが正しく反映される', () => {
      const props = { title: 'テストタイトル' }
      render(<Component {...props} />)
      expect(screen.getByText('テストタイトル')).toBeInTheDocument()
    })
  })

  describe('異常系', () => {
    test('エラー状態の表示が正しく行われる', () => {
      render(<Component error="エラーメッセージ" />)
      expect(screen.getByText('エラーメッセージ')).toBeInTheDocument()
    })
  })

  describe('ユーザーインタラクション', () => {
    test('ボタンクリック時の動作が正しく行われる', async () => {
      const user = UserEvent.setup()
      const handleClick = vi.fn()
      
      render(<Component onClick={handleClick} />)
      await user.click(screen.getByRole('button'))
      
      expect(handleClick).toHaveBeenCalledOnce()
    })
  })
})
```

### テストカバレッジ基準
- **最低カバレッジ**: 80%以上を目標
- **重要な機能**: ビジネスロジックは100%カバレッジを目指す
- **境界値テスト**: エッジケースや異常系のテストを重視
- **カバレッジツール**: v8 provider を使用してHTMLレポート生成

### モック戦略
```typescript
// 外部APIのモック
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'テストユーザー1' },
      { id: 2, name: 'テストユーザー2' }
    ])
  })
)

// テストセットアップ
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## E2Eテスト（Playwright）

### 基本設定
Playwrightの設定は `playwright.config.ts` で定義されています：

```typescript
export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI 
    ? [['html'], ['json']] 
    : [['html']],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

### 環境セットアップ
E2Eテストを実行する前に、システム依存関係のインストールが必要です：

```bash
# Linux/Ubuntu環境での依存関係インストール
sudo apt-get update
sudo apt-get install -y libnss3 libnspr4 libasound2t64

# または Playwright の依存関係を自動インストール
# pnpmがsudoで見つからない場合は、フルパスを指定
sudo $(which pnpm) exec playwright install-deps

# またはnpxを使用
sudo npx playwright install-deps

# または依存関係を個別にインストール
sudo apt-get install -y \
  libnss3-dev \
  libatk-bridge2.0-dev \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libxss1 \
  libasound2
```

**Docker環境での実行**（推奨）:
```bash
# Docker環境でのE2Eテスト実行
docker run --rm -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.52.0 pnpm --filter app test:e2e:chromium
```

### テスト実行コマンド
```bash
# 全ブラウザでE2Eテスト実行
pnpm --filter app test:e2e

# 特定のブラウザでのみ実行
pnpm --filter app test:e2e:chromium
pnpm --filter app test:e2e:firefox
pnpm --filter app test:e2e:webkit

# ヘッド付きモード（ブラウザを表示）
pnpm --filter app test:e2e:headed

# UIモード（インタラクティブ）
pnpm --filter app test:e2e:ui

# テストレポートの表示
pnpm --filter app exec playwright show-report
```

### E2Eテストの基本パターン
```typescript
import { test, expect } from '@playwright/test'

test.describe('アプリケーション基本機能', () => {
  test('トップページが正しく表示される', async ({ page }) => {
    await page.goto('/')
    
    // タイトル確認
    await expect(page).toHaveTitle(/期待するタイトル/)
    
    // メインコンテンツの表示確認
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByText('メインコンテンツ')).toBeVisible()
  })

  test('ナビゲーション機能', async ({ page }) => {
    await page.goto('/')
    
    // ナビゲーションリンクのクリック
    await page.getByRole('link', { name: 'About' }).click()
    
    // URLの変化確認
    await expect(page).toHaveURL(/.*about/)
    
    // ページコンテンツの確認
    await expect(page.getByText('About ページ')).toBeVisible()
  })

  test('フォーム送信機能', async ({ page }) => {
    await page.goto('/contact')
    
    // フォーム入力
    await page.getByLabel('名前').fill('テストユーザー')
    await page.getByLabel('メールアドレス').fill('test@example.com')
    await page.getByLabel('メッセージ').fill('テストメッセージです')
    
    // 送信ボタンクリック
    await page.getByRole('button', { name: '送信' }).click()
    
    // 成功メッセージの確認
    await expect(page.getByText('送信が完了しました')).toBeVisible()
  })
})
```

### 視覚回帰テスト
```typescript
test('視覚回帰テスト', async ({ page }) => {
  await page.goto('/')
  
  // ページ全体のスクリーンショット比較
  await expect(page).toHaveScreenshot('homepage.png')
  
  // 特定要素のスクリーンショット比較
  await expect(page.getByRole('header')).toHaveScreenshot('header.png')
})
```

## TDD（テスト駆動開発）アプローチ

### Red-Green-Refactorサイクル
1. **Red**: 失敗するテストを書く
2. **Green**: テストが通る最小限の実装を行う
3. **Refactor**: コードを改善する

### 実践例
```typescript
// 1. Red: 失敗するテストを書く
test('ユーザー情報を取得できる', async () => {
  const user = await getUserById('123')
  expect(user).toEqual({
    id: '123',
    name: 'テストユーザー',
    email: 'test@example.com'
  })
})

// 2. Green: 最小限の実装
const getUserById = async (id: string) => {
  // 最小限の実装
  return {
    id,
    name: 'テストユーザー',
    email: 'test@example.com'
  }
}

// 3. Refactor: 実際のAPI呼び出しに改善
const getUserById = async (id: string) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

## CI/CDでのテスト実行

### プレコミットフック
```bash
# huskyによるプレコミットテスト実行
pnpm run pre-commit  # fullcheckを実行（ユニットテスト含む）
```

### CI環境でのテスト
```bash
# CI環境での並列テスト実行
pnpm exec turbo run test -- --passWithNoTests

# E2Eテスト（CI環境最適化）
pnpm --filter app test:e2e:chromium  # Chromiumのみで高速化
```

### テストレポート
- **Vitestレポート**: `test-results/index.html`
- **Playwrightレポート**: `playwright-report/index.html`
- **カバレッジレポート**: `test-results/coverage/index.html`

## ベストプラクティス

### テスト命名規則
```typescript
// Good: 具体的で理解しやすい名前
test('ユーザーが有効な認証情報でログインできる', () => {})
test('無効なパスワードでログインが拒否される', () => {})

// Bad: 曖昧な名前
test('ログインテスト', () => {})
test('test1', () => {})
```

### テストの独立性
```typescript
// Good: 各テストが独立している
test('テスト1', () => {
  const data = createTestData()
  // テスト実装
})

test('テスト2', () => {
  const data = createTestData()
  // テスト実装
})

// Bad: テスト間で状態を共有
let sharedData
test('テスト1', () => {
  sharedData = createTestData()
  // テスト実装
})

test('テスト2', () => {
  // sharedDataに依存（危険）
})
```

### 適切なアサーション
```typescript
// Good: 具体的なアサーション
expect(screen.getByText('ログイン成功')).toBeInTheDocument()
expect(mockFunction).toHaveBeenCalledWith('expected-argument')

// Bad: 曖昧なアサーション
expect(result).toBeTruthy()
expect(mockFunction).toHaveBeenCalled()
```

## トラブルシューティング

### よくある問題

#### テストが不安定（flaky test）
```typescript
// 解決方法: 適切な待機処理
await waitFor(() => {
  expect(screen.getByText('読み込み完了')).toBeInTheDocument()
})

// Playwrightの場合
await expect(page.getByText('読み込み完了')).toBeVisible()
```

#### E2Eテストのタイムアウト
```typescript
// Playwrightのタイムアウト設定
test('長時間処理のテスト', async ({ page }) => {
  test.setTimeout(60000) // 60秒に延長
  
  await page.goto('/long-process')
  await expect(page.getByText('処理完了')).toBeVisible({ timeout: 30000 })
})
```

#### メモリリークの回避
```typescript
// 適切なクリーンアップ
afterEach(() => {
  vi.clearAllMocks()
  cleanup() // Testing Libraryのクリーンアップ
})
```

このテスト戦略に従って、品質の高いアプリケーションを構築していきましょう。