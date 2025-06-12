# 変更影響チェックリスト

このファイルは、プロジェクトで特定の変更を行う際に影響する可能性のある関連ファイルを記録し、見落としを防ぐためのチェックリストです。

## 使用方法

1. 変更作業時にこのファイルを参照
2. 該当する変更タイプのチェックリストを確認
3. 記載されているファイルを必ず確認・修正
4. 新しい影響関係を発見した場合は即座にこのファイルに追記

## package.json scriptsセクション変更時

**変更対象**: package.jsonのscriptsセクション（コマンド名変更、追加、削除）

### 必須確認・修正ファイル

#### 1. CI/CDワークフロー
- **`.github/workflows/ci.yml`** - GitHub Actions CI設定
  - Format check: `pnpm exec turbo run lint:format` → `pnpm fmt`
  - E2E test: `pnpm --filter app test:e2e:chromium` → `pnpm e2e`
  - Lint: `pnpm lint` (変更なし)
  - Type check: `pnpm type-check` (変更なし)
  - Build: `pnpm build` (変更なし)
  - Test: `pnpm test` (変更なし)

#### 2. Turborepo設定
- **`turbo.json`** - Turborepoタスク定義
  - tasksセクションのキー名をpackage.jsonのコマンド名と一致させる
  - outputsの設定も確認（ビルド成果物の出力先）

#### 3. ルートpackage.json
- **`package.json`** (ルート) - monorepo全体のコマンド定義
  - turbo runコマンドの引数をappsパッケージのコマンド名と一致させる
  - fullcheck、fullcheck:e2eコマンドの実行順序も確認

#### 4. ドキュメント
- **`docs/development/commands.md`** - コマンドリファレンス
- **`CLAUDE.md`** - 主要コマンドセクション
- **`.github/copilot-instructions.md`** - GitHub Copilot用インストラクション

### チェック観点

1. **コマンド名の一貫性**: 全ファイルで同じコマンド名が使用されているか
2. **実行順序**: fullcheckなどでの実行順序が適切か
3. **CI実行時間**: 変更によりCI実行時間に影響がないか
4. **outputs設定**: turbo.jsonでビルド成果物が適切に設定されているか

### 実際の変更例（2025年01月06日）

**変更内容**: package.jsonコマンド名の統一
- `format`/`format:check` → `fmt`/`fmt:fix`
- `spell-check` → `spell`  
- `test:e2e:*` → `e2e`/`e2e:*`

**実際に修正が必要だったファイル**:
- `.github/workflows/ci.yml`: フォーマットチェック、E2Eテスト、単体テストコマンド
- `turbo.json`: task名の変更とoutputs設定
- `package.json` (ルート): fullcheckコマンドの構成変更とtest:ci追加
- `apps/app/package.json`: test:ciコマンド追加
- `docs/development/commands.md`: 全コマンドリファレンス更新
- `CLAUDE.md`: 主要コマンドセクションのコマンド名更新と--filter不要コマンド修正
- `.github/copilot-instructions.md`: （今回は開発フローのdevコマンドは変更なし）

## 依存関係変更時

**変更対象**: package.jsonのdependencies、devDependencies

### 必須確認・修正ファイル

#### 1. TypeScript設定
- **`tsconfig.json`**, **`tsconfig.node.json`** - 型定義の追加が必要な場合

#### 2. テスト設定
- **`vitest.config.ts`**, **`playwright.config.ts`** - テストライブラリの設定変更

#### 3. Lint/Format設定
- **`eslint.config.js`** - ESLintプラグインの追加・削除
- 設定パッケージ (packages/eslint-config/, packages/prettier-config/)

## ディレクトリ構造変更時

**変更対象**: ファイル・ディレクトリの移動、リネーム

### 必須確認・修正ファイル

#### 1. インポート/エクスポート
- TypeScriptファイル内のimport文
- **`vite.config.ts`** - パス設定

#### 2. 設定ファイル
- **`.gitignore`** - 除外パターン
- **`turbo.json`** - outputs設定のパス
- **`playwright.config.ts`** - テストファイルのパス

#### 3. ドキュメント
- READMEやdocs内の相対パス参照

## 環境変数変更時

**変更対象**: 環境変数の追加、削除、名前変更

### 必須確認・修正ファイル

#### 1. 環境変数定義
- **`apps/app/src/env.ts`** - Zodスキーマ定義
- **`.env.example`** (存在する場合)

#### 2. CI/CD設定
- **`.github/workflows/ci.yml`** - GitHub Actions環境変数
- デプロイ設定ファイル

#### 3. ドキュメント
- **`CLAUDE.md`** - 環境変数セクション
- **`docs/deployment/`** - デプロイ関連ドキュメント

## 新しい影響関係の追記ルール

### 追記タイミング
- ユーザーからの指摘を受けた時
- 作業中に新しい影響関係を発見した時
- 他の開発者からのフィードバックを受けた時

### 追記内容
1. **変更タイプ**: どのような変更に関する影響か
2. **影響ファイル**: 具体的なファイルパス
3. **確認観点**: 何をチェックすべきか
4. **実例**: 実際に発生した変更例

### 追記フォーマット
```markdown
## [変更タイプ名]

**変更対象**: [変更の詳細]

### 必須確認・修正ファイル
- **`ファイルパス`** - 確認・修正内容の説明

### チェック観点
- 具体的な確認ポイント
```

---
*最終更新: 2025年01月06日*
*このファイルは継続的に更新され、プロジェクトの品質と効率性の向上に寄与します。*