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

`.eslintrc.cjs`ファイルで以下のように設定してください：

```javascript
module.exports = {
  extends: ['@study-github-agent/eslint-config']
}
```

## 含まれるルール

- ESLint推奨ルール
- TypeScript ESLint推奨ルール
- React Hooksのルール
- React Refreshのルール
- カスタムルール（console.log警告、未使用変数警告など）

## 必要な依存関係

- eslint ^8.0.0
- @typescript-eslint/parser ^6.0.0

Reactプロジェクトで使用する場合は追加で以下が必要です：

- @typescript-eslint/eslint-plugin
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh