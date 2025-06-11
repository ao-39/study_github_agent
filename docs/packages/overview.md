# パッケージ一覧と目的

このドキュメントでは、プロジェクトで使用している全パッケージの目的、選定理由、利用方法を詳細に説明します。

## プロダクション依存関係

### フロントエンドフレームワーク

#### React (19.1.0)

**目的**: UI コンポーネントベースの開発基盤  
**選定理由**:

- 最新機能（Concurrent Features、Suspense）の活用
- 豊富なエコシステムとコミュニティサポート
- TypeScript との優れた統合

**利用方法**:

```typescript
import React from "react";
import { createRoot } from "react-dom/client";
```

#### React DOM (19.1.0)

**目的**: React コンポーネントの DOM 描画  
**選定理由**: React 19 の新機能フル活用

**利用方法**:

```typescript
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
```

## 開発依存関係

### ビルドツール

#### Vite (6.3.5)

**目的**: 高速な開発サーバーとビルドツール  
**選定理由**:

- HMR（Hot Module Replacement）による高速開発
- ESM ネイティブサポート
- プラグインエコシステムの充実

**設定ファイル**: `vite.config.ts`

```typescript
export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/study_github_agent/" : "/",
  plugins: [react()],
  server: { port: 3000, open: true },
});
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

**目的**: PWA 対応のための Service Worker と Web Manifest 自動生成
**選定理由**:

- オフラインでの利用を可能にするキャッシュ機構
- Vite との統合により簡易な設定で導入可能

**利用方法**:

```bash
pnpm --filter app build
# Service Worker と manifest が生成される
```

### 言語・型システム

#### TypeScript (5.8.3)

**目的**: 型安全な JavaScript 開発  
**選定理由**:

- コンパイル時の型チェック
- IDE サポートの向上
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

#### @types/\* パッケージ

- **@types/react (19.1.6)**: React 型定義
- **@types/react-dom (19.1.6)**: React DOM 型定義
- **@types/node (22.15.29)**: Node.js 型定義

**目的**: TypeScript 開発で必要な型情報提供

### テストフレームワーク

#### Vitest (3.2.2)

**目的**: 高速なユニットテストランナー  
**選定理由**:

- Vite とのネイティブ統合
- Jest 互換 API
- ES Modules 対応
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

**目的**: テスト実行の UI インターフェース  
**利用方法**:

```bash
pnpm --filter app test --ui
```

#### Playwright (1.52.0)

**目的**: クロスブラウザ E2E テスト  
**選定理由**:

- Chrome、Firefox、Safari 対応
- 高速で安定したテスト実行
- 豊富なデバッグ機能

**設定ファイル**: `playwright.config.ts`

```typescript
export default defineConfig({
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
```

### Testing Library

#### @testing-library/react (16.3.0)

**目的**: React コンポーネントのテスト  
**選定理由**:

- ユーザー視点でのテスト
- アクセシビリティ重視の設計
- React 19 対応

#### @testing-library/jest-dom (6.6.3)

**目的**: DOM 操作のためのカスタムマッチャー  
**利用方法**:

```typescript
expect(element).toBeInTheDocument();
expect(element).toHaveClass("active");
```

#### @testing-library/user-event (14.6.1)

**目的**: ユーザーインタラクションのシミュレーション  
**利用方法**:

```typescript
const user = userEvent.setup();
await user.click(button);
await user.type(input, "テキスト");
```

### コード品質管理

#### ESLint (9.28.0)

**目的**: コードの品質と一貫性の維持  
**選定理由**:

- 最新の Flat Config 形式対応
- プラグインエコシステムの充実
- TypeScript・React 対応

**設定**: `eslint.config.js`

```javascript
import config from "@study-github-agent/eslint-config";
export default config;
```

#### @typescript-eslint/parser (8.33.1)

**目的**: TypeScript コードの解析  
**利用**: ESLint 設定パッケージで自動設定

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
- CI/CD 統合

**設定ファイル**: `.cspell.json`

```json
{
  "version": "0.2",
  "language": "en",
  "files": ["**/*.{ts,tsx,js,jsx,md,json}"]
}
```

#### TypeDoc (0.28.5)

**目的**: TypeScript ソースコードから API ドキュメントを自動生成  
**選定理由**:

- TSDoc コメントから HTML ドキュメント生成
- TypeScript 型情報の自動抽出
- CI/CD での自動生成とレポート配布
- 開発チーム向けの詳細な API リファレンス

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

### monorepo 管理

#### Turborepo (2.5.4)

**目的**: monorepo のタスクランナーとキャッシュ最適化  
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

### Git 管理

#### husky (9.1.7)

**目的**: Git フックの管理とプレコミットチェック  
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

**目的**: Node.js 環境での DOM API 提供  
**利用**: Vitest のテスト環境で使用

#### yaml (2.8.0)

**目的**: YAML 形式のデータ処理  
**利用方法**:

```typescript
import YAML from "yaml";
const data = YAML.parse(yamlString);
```

#### wrangler (4.19.1)

**目的**: Cloudflare 開発ツール  
**利用**: Cloudflare Pages デプロイ用（将来的な使用想定）

## 共有パッケージ

### @study-github-agent/eslint-config

**目的**: プロジェクト統一の ESLint 設定  
**含まれる機能**:

- TypeScript 対応
- React + React Hooks 対応
- Flat Config 形式

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

**目的**: プロジェクト統一の Prettier 設定  
**設定内容**:

```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: "avoid",
};
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

### workspace 指定

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

- **Vite**: 高速な HMR
- **Turborepo**: 増分ビルドとキャッシュ
- **pnpm**: 効率的な node_modules 管理

### ビルド時パフォーマンス

- **Tree Shaking**: 未使用コードの自動除去
- **Code Splitting**: dynamic import 対応
- **Bundle Analysis**: rollup-plugin-visualizer による最適化

### 実行時パフォーマンス

- **React 19**: Concurrent Features 活用
- **ES Modules**: モダンブラウザでの高速読み込み

この包括的なパッケージ管理により、高品質で保守性の高い開発環境を実現しています。
