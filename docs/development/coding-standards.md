# コーディング規約

このプロジェクトの開発における統一されたコーディング規約を定義します。

## 基本方針

### 言語使用規則
- **変数名・関数名**: 英語で記述
- **コメント**: 日本語で記述
- **READMEやドキュメント**: 日本語で記述
- **エラーメッセージやログ**: 日本語で記述
- **コミットメッセージ**: 日本語で記述

### パッケージマネージャー規約
- **必須**: pnpm を使用
- **禁止**: npm、yarn の使用は絶対禁止
- **フェイルセーフ**: 可能な限りpnpm以外が使用された際にコマンドが失敗するように設定

## TypeScript規約

### 型安全性
- **any型の禁止**: any型の安易な使用は禁止
- **strict mode**: TypeScript strict modeを必須とする
- **型アノテーション**: 明示的な型定義を推奨

### TSDocドキュメント
- **TSDoc必須**: 全てのexport関数・コンポーネント・型にTSDocコメントを記載
- **説明文**: `@description`タグで機能の詳細な説明を記載
- **使用例**: `@example`タグでコードサンプルを提供
- **パラメータ説明**: `@param`タグで引数の詳細を記載
- **戻り値説明**: `@returns`タグで戻り値の詳細を記載
- **TypeDoc生成**: `pnpm typedoc`でAPIドキュメントを自動生成

### インポート・エクスポート規約
- **named export推奨**: 基本的にnamed exportを使用
- **default export**: 限定的な使用に留める
- **絶対パス**: 長い相対パスよりも絶対パスを優先

### TypeScript設定例
```typescript
// Good: 明示的な型定義とTSDocコメント
/**
 * ユーザーデータを取得する
 * 
 * @description 指定されたユーザーIDからユーザーの詳細情報を非同期で取得します。
 * APIエラーが発生した場合は適切なエラーハンドリングを行います。
 * 
 * @param userId - 取得対象のユーザーID
 * @returns ユーザーデータを含むPromise
 * 
 * @example
 * ```typescript
 * const userData = await getUserData('user123')
 * console.log(userData.name)
 * ```
 */
const getUserData = (userId: string): Promise<UserData> => {
  return fetchUser(userId)
}

// Bad: any型の使用とドキュメントの欠如
const getUserData = (userId: any): any => {
  return fetchUser(userId)
}
```

## React規約

### コンポーネント設計
- **関数コンポーネント**: クラスコンポーネントは使用しない
- **Hooks使用**: useState、useEffect等のHooksを適切に使用
- **500行制限**: 1つのコンポーネントは500行を超えないこと

### パフォーマンス最適化
- **React.memo**: 必要に応じて適切に使用
- **useMemo/useCallback**: パフォーマンスが必要な箇所で使用
- **レンダリング最適化**: 不要な再レンダリングを避ける

### 禁止事項
- **直接DOM操作**: Reactを使用している際の直接的なDOM操作は禁止
- **dangerouslySetInnerHTML**: XSSリスクのため使用制限
- **古いReact APIs**: componentDidMount等のクラスコンポーネントAPIは使用しない

## ESLint規約

### 設定パッケージ
本プロジェクトでは `@study-github-agent/eslint-config` を使用：

```javascript
// eslint.config.js
import config from '@study-github-agent/eslint-config'

export default config
```

### 主要ルール
- **console.log警告**: 本番コードでのconsole.logは警告対象
- **未使用変数**: TypeScript未使用変数は警告
- **React Hooks**: eslint-plugin-react-hooksによるHooksルール適用
- **max-warnings 0**: 警告は0件でなければビルドが失敗

### ESLint Flat Config対応
- **ESLint 9.x**: Flat Config形式を標準採用
- **レガシー対応**: 旧形式の.eslintrc.cjsは非推奨

## Prettier規約

### 設定パッケージ
本プロジェクトでは `@study-github-agent/prettier-config` を使用：

```json
{
  "prettier": "@study-github-agent/prettier-config"
}
```

### フォーマット設定
- **セミコロン**: なし (`semi: false`)
- **クォート**: シングルクォート (`singleQuote: true`) 
- **タブ幅**: 2スペース (`tabWidth: 2`)
- **末尾カンマ**: ES5準拠 (`trailingComma: 'es5'`)
- **行幅**: 80文字 (`printWidth: 80`)
- **ブラケットスペース**: あり (`bracketSpacing: true`)
- **アロー関数括弧**: 不要時は省略 (`arrowParens: 'avoid'`)

## package.json管理規約

### バージョン管理
- **固定バージョン**: `^`や`~`プレフィックスは使用禁止
- **具体的指定**: `"react": "19.1.0"` のように具体的なバージョンを指定
- **セマンティックバージョニング**: バージョン更新時はルールに従う

### プロパティ管理
- **自動ソート**: `sort-package-json` による標準順序での自動整列
- **フォーマット強制**: `pnpm run format` 実行時にpackage.jsonも自動整列
- **依存関係整理**: 未使用の依存関係は定期的に削除

### workspace管理
- **ローカル参照**: `workspace:*` を使用してローカルパッケージを参照
- **依存関係方向**: apps → packages の一方向のみ許可
- **循環依存禁止**: パッケージ間の循環依存は絶対に作らない

## 命名規則

### ディレクトリ・ファイル
- **kebab-case**: ディレクトリ名は `kebab-case` を使用
- **パッケージ名**: `@study-github-agent/package-name` 形式を使用

### 変数・関数
```typescript
// Good: camelCase
const userName = 'taro'
const getUserData = () => {}

// Bad: snake_case
const user_name = 'taro'
const get_user_data = () => {}
```

### 定数
```typescript
// Good: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// Bad: camelCase for constants
const apiBaseUrl = 'https://api.example.com'
```

## エラーハンドリング規約

### エラーメッセージ
- **日本語使用**: ユーザー向けエラーメッセージは日本語
- **具体的内容**: 「何が問題で、どうすれば解決できるか」を明示
- **一貫性**: 類似エラーには一貫した表現を使用

```typescript
// Good: 具体的で建設的なエラーメッセージ
throw new Error('ユーザー認証に失敗しました。メールアドレスとパスワードを確認してください。')

// Bad: 曖昧なエラーメッセージ
throw new Error('エラーが発生しました')
```

### 避けるべきパターン
- **過度な最適化**: 必要のない早期最適化
- **deep nesting**: 5階層を超えるネスト構造
- **magic numbers**: 意味が不明な数値のハードコーディング

## セキュリティ規約

### 禁止事項
- **秘密情報のハードコーディング**: APIキーやパスワードのコード内記述は禁止
- **eval()使用禁止**: 動的コード実行は禁止
- **非検証データ使用禁止**: 外部APIからの未検証データの直接使用は禁止

### セキュリティ対策
- **入力値検証**: 全ての外部入力に対する適切なバリデーション
- **XSS対策**: dangerouslySetInnerHTMLの使用制限、サニタイゼーション
- **依存関係監査**: 定期的なセキュリティ監査と脆弱性対応

これらの規約は、プロジェクトの品質と保守性を向上させるために設定されています。違反した場合はCIパイプラインでエラーとなるため、必ず遵守してください。