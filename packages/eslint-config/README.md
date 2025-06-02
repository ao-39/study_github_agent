# @study-github-agent/eslint-config

Study GitHub Agentプロジェクト用のESLint設定パッケージです。

## 機能

- TypeScript対応
- React対応  
- React Hooks対応
- 基本的なコーディング規約

## 使用方法

### インストール

```bash
pnpm add -D @study-github-agent/eslint-config
```

### 設定

**ESLint 9.x（Flat Config）を使用する場合（推奨）：**

`eslint.config.js`ファイルで以下のように設定してください：

```javascript
import config from '@study-github-agent/eslint-config'

export default config
```

**ESLint 8.x（Legacy Config）を使用する場合：**

`.eslintrc.cjs`ファイルで以下のように設定してください：

```javascript
module.exports = {
  extends: ['@study-github-agent/eslint-config']
}
```

**注意：** ESLint 9.x以降では、Flat Config形式が標準となっています。新規プロジェクトではFlat Config形式の使用を推奨します。

## 含まれるルール

- ESLint推奨ルール
- TypeScript ESLint推奨ルール
- React Hooksのルール
- React Refreshのルール
- カスタムルール（console.log警告、未使用変数警告など）

## 必要な依存関係

- eslint ^9.0.0
- @typescript-eslint/parser ^8.0.0

Reactプロジェクトで使用する場合は追加で以下が必要です：

- @typescript-eslint/eslint-plugin
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh