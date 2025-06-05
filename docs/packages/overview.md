# パッケージ一覧と目的

このドキュメントでは、プロジェクトで使用している全パッケージの目的、選定理由、利用方法を詳細に説明します。

## プロダクション依存関係

### フロントエンドフレームワーク

#### React (19.1.0)
**目的**: UIコンポーネントベースの開発基盤  
**選定理由**: 
- 最新機能（Concurrent Features、Suspense）の活用
- 豊富なエコシステムとコミュニティサポート
- TypeScriptとの優れた統合

**利用方法**:
```typescript
import React from 'react'
import { createRoot } from 'react-dom/client'
```

#### React DOM (19.1.0)
**目的**: ReactコンポーネントのDOM描画  
**選定理由**: React 19の新機能フル活用

**利用方法**:
```typescript
import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

## 開発依存関係

### ビルドツール

#### Vite (6.3.5)
**目的**: 高速な開発サーバーとビルドツール  
**選定理由**: 
- HMR（Hot Module Replacement）による高速開発
- ESMネイティブサポート
- プラグインエコシステムの充実

**設定ファイル**: `vite.config.ts`
```typescript
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/study_github_agent/' : '/',
  plugins: [react()],
  server: { port: 3000, open: true },
})
```

#### Rollup Plugin Visualizer (6.0.1)
**目的**: バンドルサイズ分析とビジュアライゼーション
**選定理由**: 
- バンドルサイズの詳細分析
- 依存関係の可視化
- パフォーマンス最適化の指針

**利用方法**:
```bash
pnpm --filter app build:analyze
# bundle-report.html が生成される
```

#### Vite Plugin PWA (1.0.0)
**目的**: PWA対応のためのService WorkerとWeb Manifest自動生成
**選定理由**:
- オフラインでの利用を可能にするキャッシュ機構
- Viteとの統合により簡易な設定で導入可能

**利用方法**:
```bash
pnpm --filter app build
# Service Worker と manifest が生成される
```

### 言語・型システム

#### TypeScript (5.8.3)
**目的**: 型安全なJavaScript開発  
**選定理由**: 
- コンパイル時の型チェック
- IDEサポートの向上
- 大規模開発での保守性向上

**設定ファイル**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

#### @types/* パッケージ
- **@types/react (19.1.6)**: React型定義
 - **@types/react-dom (19.1.6)**: React DOM型定義
- **@types/node (22.15.29)**: Node.js型定義

**目的**: TypeScript開発で必要な型情報提供

### テストフレームワーク

#### Vitest (3.2.2)
**目的**: 高速なユニットテストランナー  
**選定理由**: 
- Viteとのネイティブ統合
- Jest互換API
- ES Modules対応
- 高速な実行速度

**設定**: `vite.config.ts`内で設定
```typescript
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test-setup.ts'],
  globals: true,
  coverage: { enabled: true, provider: 'v8' }
}
```

#### @vitest/coverage-v8 (3.2.2)
**目的**: コードカバレッジ計測  
**利用方法**:
```bash
pnpm --filter app test:coverage
```

#### @vitest/ui (3.2.2)
**目的**: テスト実行のUIインターフェース  
**利用方法**:
```bash
pnpm --filter app test --ui
```

#### Playwright (1.52.0)
**目的**: クロスブラウザE2Eテスト  
**選定理由**: 
- Chrome、Firefox、Safari対応
- 高速で安定したテスト実行
- 豊富なデバッグ機能

**設定ファイル**: `playwright.config.ts`
```typescript
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

### Testing Library

#### @testing-library/react (16.3.0)
**目的**: Reactコンポーネントのテスト  
**選定理由**: 
- ユーザー視点でのテスト
- アクセシビリティ重視の設計
- React 19対応

#### @testing-library/jest-dom (6.6.3)
**目的**: DOM操作のためのカスタムマッチャー  
**利用方法**:
```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveClass('active')
```

#### @testing-library/user-event (14.6.1)
**目的**: ユーザーインタラクションのシミュレーション  
**利用方法**:
```typescript
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'テキスト')
```

### コード品質管理

#### ESLint (9.28.0)
**目的**: コードの品質と一貫性の維持  
**選定理由**: 
- 最新のFlat Config形式対応
- プラグインエコシステムの充実
- TypeScript・React対応

**設定**: `eslint.config.js`
```javascript
import config from '@study-github-agent/eslint-config'
export default config
```

#### @typescript-eslint/parser (8.33.1)
**目的**: TypeScriptコードの解析  
**利用**: ESLint設定パッケージで自動設定

#### Prettier (3.5.3)
**目的**: コードフォーマットの自動化  
**選定理由**: 
- 一貫したコードスタイル
- エディタ統合
- チーム開発での統一性

**設定**: `package.json`
```json
{
  "prettier": "@study-github-agent/prettier-config"
}
```

#### cspell (9.0.2)
**目的**: 英語スペルチェック  
**選定理由**: 
- 技術用語辞書の充実
- カスタム辞書対応
- CI/CD統合

**設定ファイル**: `.cspell.json`
```json
{
  "version": "0.2",
  "language": "en",
  "files": ["**/*.{ts,tsx,js,jsx,md,json}"]
}
```

#### TypeDoc (0.28.5)
**目的**: TypeScriptソースコードからAPIドキュメントを自動生成  
**選定理由**: 
- TSDocコメントからHTMLドキュメント生成
- TypeScript型情報の自動抽出
- CI/CDでの自動生成とレポート配布
- 開発チーム向けの詳細なAPIリファレンス

**設定ファイル**: `typedoc.json`
```json
{
  "name": "Study GitHub Agent App API Documentation",
  "entryPoints": ["src"],
  "out": "docs-api",
  "exclude": ["**/*.test.*", "**/*.d.ts", "test-setup.ts", "e2e/"]
}
```

**生成コマンド**:
```bash
# APIドキュメント生成
pnpm typedoc

# 特定のアプリのみ
pnpm --filter app typedoc
```

### monorepo管理

#### Turborepo (2.5.4)
**目的**: monorepoのタスクランナーとキャッシュ最適化  
**選定理由**: 
- 増分ビルドとキャッシュ
- 並列実行による高速化
- 依存関係グラフの管理

**設定ファイル**: `turbo.json`
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

#### sort-package-json (3.2.1)
**目的**: package.jsonの自動整列  
**選定理由**: 
- プロパティの標準順序維持
- チーム開発での統一性
- 自動化による効率性

**利用方法**:
```bash
pnpm run format:package
```

### Git管理

#### husky (9.1.7)
**目的**: Gitフックの管理とプレコミットチェック  
**選定理由**: 
- 簡単なセットアップ
- クロスプラットフォーム対応
- 品質保証の自動化

**設定**: `.husky/pre-commit`
```bash
#!/usr/bin/env sh
pnpm run pre-commit
```

### その他ツール

#### jsdom (26.1.0)
**目的**: Node.js環境でのDOM API提供  
**利用**: Vitestのテスト環境で使用

#### yaml (2.8.0)
**目的**: YAML形式のデータ処理  
**利用方法**:
```typescript
import YAML from 'yaml'
const data = YAML.parse(yamlString)
```

#### wrangler (4.19.1)
**目的**: Cloudflare開発ツール  
**利用**: Cloudflare Pages デプロイ用（将来的な使用想定）

## 共有パッケージ

### @study-github-agent/eslint-config
**目的**: プロジェクト統一のESLint設定  
**含まれる機能**:
- TypeScript対応
- React + React Hooks対応
- Flat Config形式

**主要ルール**:
```javascript
rules: {
  'no-console': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
}
```

### @study-github-agent/prettier-config
**目的**: プロジェクト統一のPrettier設定  
**設定内容**:
```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'avoid'
}
```

## パッケージバージョン管理方針

### 固定バージョン戦略
- **原則**: `^`や`~`プレフィックスは使用しない
- **理由**: 予期しない動作変更の防止
- **例外**: なし（全て具体的なバージョン指定）

### セマンティックバージョニング対応
- **MAJOR**: 破壊的変更（慎重に検討）
- **MINOR**: 新機能追加（後方互換性維持）
- **PATCH**: バグ修正とセキュリティ修正

### 更新タイミング
- **定期更新**: 月次でのセキュリティアップデート確認
- **機能更新**: 新機能需要に応じた計画的更新
- **緊急更新**: セキュリティ脆弱性対応

## 依存関係の管理

### workspace指定
```json
{
  "dependencies": {
    "@study-github-agent/eslint-config": "workspace:*",
    "@study-github-agent/prettier-config": "workspace:*"
  }
}
```

### 循環依存の防止
- **apps → packages**: 許可された依存方向
- **packages → packages**: 慎重に管理
- **packages → apps**: 禁止

### 未使用依存関係の削除
```bash
# 定期的に実行して確認
pnpm exec depcheck
```

## パフォーマンス考慮

### 開発時パフォーマンス
- **Vite**: 高速なHMR
- **Turborepo**: 増分ビルドとキャッシュ
- **pnpm**: 効率的なnode_modules管理

### ビルド時パフォーマンス
- **Tree Shaking**: 未使用コードの自動除去
- **Code Splitting**: dynamic import対応
- **Bundle Analysis**: rollup-plugin-visualizerによる最適化

### 実行時パフォーマンス
- **React 19**: Concurrent Features活用
- **ES Modules**: モダンブラウザでの高速読み込み

この包括的なパッケージ管理により、高品質で保守性の高い開発環境を実現しています。