# @study-github-agent/prettier-config

Study GitHub Agentプロジェクト用のPrettier設定パッケージです。

## 設定内容

- セミコロンなし
- シングルクォート使用
- タブ幅: 2スペース
- 末尾カンマ: ES5準拠
- 行の最大幅: 80文字
- ブラケットスペース: あり
- アロー関数の括弧: 不要な場合は省略

## 使用方法

### インストール

```bash
pnpm add -D @study-github-agent/prettier-config
```

### 設定

#### package.jsonで設定

```json
{
  "prettier": "@study-github-agent/prettier-config"
}
```

#### .prettierrc.jsで設定

```javascript
module.exports = require('@study-github-agent/prettier-config')
```

#### 設定を拡張する場合

```javascript
module.exports = {
  ...require('@study-github-agent/prettier-config'),
  // カスタム設定
  printWidth: 100
}
```

## 必要な依存関係

- prettier ^3.0.0