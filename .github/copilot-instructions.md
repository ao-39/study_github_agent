# GitHub Copilot インストラクション

## 開発者情報
- 開発者は日本人です
- コミュニケーションは日本語で行います
- コメントやドキュメントは日本語で記述してください

## プロジェクト情報
このプロジェクトはGitHub Copilot agentを学習するためのリポジトリです。

**重要**: プロジェクトの詳細なアーキテクチャと技術スタックについてはREADME.mdを必ず参照してください。

### 技術スタック
- React アプリケーション（monorepo構成でapps/app配下に構築予定）
- JavaScript/TypeScript

## コーディング規約
- 変数名や関数名は英語で記述
- コメントは日本語で記述
- READMEやドキュメントは日本語で記述
- エラーメッセージやログは日本語で記述
- コミットメッセージは日本語で記述

## GitHub Copilotへの指示
- 提案や説明は日本語で行ってください
- コードの解説やコメントは日本語で記述してください
- 日本の開発慣習や文化を考慮してください
- 開発者が元気になり、モチベーションが向上するような前向きで励ましの言葉を使ってください
- 問題解決時には達成感を感じられるような表現を心がけてください

## GitHub Copilot学習指針

### エージェントとの効果的なやり取り方法
- 具体的で明確な指示を与える
- コンテキストを十分に提供する
- 段階的に複雑な要求を行う
- フィードバックを積極的に与える
- 学習過程での試行錯誤を重視する

### プロンプトの書き方
- **明確な目的**: 何を実現したいかを明確に記述
- **制約条件**: 技術スタック、パフォーマンス要件、制限事項を明記
- **期待する出力**: 欲しい結果の形式や構造を具体的に指定
- **コンテキスト提供**: 関連するコードやファイル構造の情報を含める
- **段階的アプローチ**: 複雑な作業は小さなステップに分割して依頼

### 学習効率を高めるコツ
- 失敗例からも積極的に学ぶ
- 生成されたコードを必ず理解してから採用する
- バリエーションを試して最適解を見つける
- ドキュメント化して知識を蓄積する

## コード品質基準

### パフォーマンス
- **レンダリング最適化**: React.memo、useMemo、useCallbackを適切に使用
- **バンドルサイズ**: 不要なライブラリの削除、コード分割の実装
- **読み込み速度**: 画像最適化、遅延読み込み、キャッシュ戦略
- **メモリ管理**: イベントリスナーの適切な削除、メモリリークの防止

### セキュリティ
- **入力値検証**: 全ての外部入力に対する適切なバリデーション
- **XSS対策**: dangerouslySetInnerHTMLの使用制限、サニタイゼーション
- **認証・認可**: 適切な権限管理とトークン管理
- **依存関係**: 定期的なセキュリティ監査と脆弱性対応

### アクセシビリティ
- **セマンティックHTML**: 適切なHTMLタグの使用
- **キーボード操作**: 全ての機能がキーボードでアクセス可能
- **スクリーンリーダー**: ARIA属性の適切な使用
- **色・コントラスト**: WCAG 2.1 AA基準の遵守

### package.json管理基準
- **バージョン固定**: `^`や`~`プレフィックスは使用せず、具体的なバージョン番号を指定
- **プロパティソート**: `sort-package-json`を使用して標準的な順序でプロパティを自動整列
- **依存関係整理**: 使用していない依存関係は定期的に削除し、必要最小限に保つ
- **セマンティックバージョニング**: バージョン更新時はセマンティックバージョニングルールに従う
- **自動フォーマット**: `pnpm run format`実行時にpackage.jsonも含めて一括フォーマット

## エラーハンドリング方針

### エラー対応の基本方針
- **予防的アプローチ**: エラーが発生する前に適切な検証を行う
- **グレースフルデグラデーション**: エラー時でも最低限の機能を提供
- **ユーザーフィードバック**: 分かりやすいエラーメッセージの表示
- **ログ記録**: 開発者がデバッグできる十分な情報を記録

### 日本語エラーメッセージの統一
- **敬語の使用**: 丁寧語を基本とし、ユーザーに寄り添う表現
- **具体的な解決策**: 「何が問題で、どうすれば解決できるか」を明示
- **技術用語の翻訳**: 適切な日本語技術用語を使用（例：「認証エラー」「接続に失敗しました」）
- **メッセージの統一**: 類似のエラーには一貫した表現を使用

### エラー処理のパターン
```typescript
// Good: 具体的で建設的なエラーメッセージ
throw new Error('ユーザー認証に失敗しました。メールアドレスとパスワードを確認してください。');

// Bad: 曖昧なエラーメッセージ
throw new Error('エラーが発生しました');
```

## テスト作成指針

### TDD（テスト駆動開発）
- **Red-Green-Refactor**: 失敗するテスト → 実装 → リファクタリングのサイクル
- **テストファースト**: 機能実装前にテストを書く
- **小さなステップ**: 一度に一つの機能をテストする

### テストカバレッジ
- **最低カバレッジ**: 80%以上を目標とする
- **重要な機能**: ビジネスロジックは100%カバレッジを目指す
- **境界値テスト**: エッジケースや異常系のテストを重視
- **カバレッジツール**: Istanbul/nycを使用してカバレッジを可視化

### E2Eテスト（Playwright）
- **ユーザーシナリオ**: 実際のユーザー操作フローをテスト
- **ブラウザ横断**: Chrome、Firefox、Safariでの動作確認
- **視覚回帰テスト**: スクリーンショット比較による見た目の確認
- **パフォーマンステスト**: ページ読み込み速度の監視

### テスト構造
```typescript
// テストの構造例
describe('ユーザー認証機能', () => {
  describe('正常系', () => {
    test('有効な認証情報でログインできる', () => {
      // テスト実装
    });
  });
  
  describe('異常系', () => {
    test('無効なパスワードでログインが拒否される', () => {
      // テスト実装
    });
  });
});
```

## monorepo開発指針

### パッケージ間依存関係
- **依存関係の方向**: apps → packages の一方向のみ許可
- **循環依存の禁止**: パッケージ間の循環依存は絶対に作らない
- **明示的な依存**: package.jsonで依存関係を明確に記述
- **バージョン管理**: workspace:*を使用してローカルパッケージを参照

### 命名規則
- **パッケージ名**: `@study-github-agent/package-name` の形式を使用
- **ディレクトリ名**: kebab-case（例：`user-auth`, `ui-components`）
- **エクスポート**: named exportを基本とし、default exportは限定的に使用

### リリース管理
- **セマンティックバージョニング**: MAJOR.MINOR.PATCH の形式で管理
- **changesets**: リリースノートの自動生成とバージョン管理
- **同期リリース**: 関連パッケージは同時にリリース
- **後方互換性**: MINOR バージョンでは後方互換性を維持

### パッケージ構成例
```
packages/
├── ui-components/     # 共通UIコンポーネント
├── utils/            # ユーティリティ関数
├── types/            # TypeScript型定義
└── config/           # 共通設定
```

## 禁止事項・避けるべき実装

### 絶対に禁止
- **pnpm以外のパッケージマネージャー**: npm、yarnの使用は禁止
- **console.log**: 本番コードでのデバッグ用console.logの残存
- **any型の濫用**: TypeScriptでのany型の安易な使用
- **直接DOM操作**: Reactを使っている際の直接的なDOM操作

### 避けるべきパターン
- **過度な最適化**: 必要のない早期最適化
- **巨大なコンポーネント**: 500行を超えるReactコンポーネント
- **deep nesting**: 5階層を超えるネスト構造
- **magic numbers**: 意味が不明な数値のハードコーディング

### 非推奨ライブラリ
- **moment.js**: date-fnsやdayjsを使用
- **lodash全体**: 必要な関数のみを個別にインポート
- **jQuery**: React環境では使用しない
- **古いReact APIs**: componentDidMount等のクラスコンポーネントAPI

### セキュリティ上の禁止事項
- **秘密情報のハードコーディング**: APIキーやパスワードのコード内記述
- **eval()の使用**: 動的コード実行の禁止
- **dangerouslySetInnerHTML**: XSSリスクのある使用法
- **非検証の外部データ**: 外部APIからの未検証データの直接使用

## Pull Request規約

### レビュー観点

#### 機能面
- **要件充足**: 仕様書や issue の要件を満たしているか
- **エッジケース**: 異常系やエラーケースが適切に処理されているか
- **パフォーマンス**: 性能劣化を引き起こしていないか
- **ユーザビリティ**: ユーザーにとって使いやすいUIか

#### コード品質
- **可読性**: コードが理解しやすく、メンテナンスしやすいか
- **再利用性**: 適切に抽象化され、再利用可能か
- **テスト**: 十分なテストカバレッジがあるか
- **ドキュメント**: 必要な場合にコメントやドキュメントが更新されているか

#### アーキテクチャ
- **設計一貫性**: 既存のアーキテクチャパターンに従っているか
- **依存関係**: 適切な依存関係の管理がされているか
- **スケーラビリティ**: 将来の拡張に対応可能な設計か

### マージ基準
- **必須条件**:
  - CI/CDパイプラインがすべて成功
  - 最低2名のレビュアーによる承認
  - テストカバレッジ80%以上の維持
  - コンフリクトの解決

- **推奨条件**:
  - 関連するドキュメントの更新
  - Performance budgetの維持
  - アクセシビリティテストの通過

### PRの作成ガイドライン
- **タイトル**: 変更内容を端的に日本語で表現
- **説明**: 変更の背景、目的、影響範囲を明記
- **チェックリスト**: 自己レビューのためのチェックリストを活用
- **関連Issue**: 該当するissueへのリンクを含める

## 学習記録の取り方

### GitHub Copilotとのやり取りの記録

#### 成功パターンの記録
- **プロンプト**: 効果的だったプロンプトの内容
- **結果**: 生成されたコードや解決策
- **改善点**: より良い結果を得るための改善案
- **適用場面**: 類似の問題で再利用できる場面

#### 失敗パターンからの学習
- **問題のあるプロンプト**: 期待した結果が得られなかった例
- **原因分析**: なぜ期待した結果が得られなかったか
- **改善されたプロンプト**: 修正後のプロンプトとその結果
- **教訓**: 今後避けるべきパターン

### 記録方法
- **GitHub Issues**: 学習過程で発見した知見をissueとして記録
- **コードコメント**: 複雑な実装や学習した内容をコメントで残す
- **README更新**: プロジェクト全体に関わる学習内容をREADMEに反映
- **Wiki活用**: 詳細な学習ログやチュートリアルをWikiに蓄積

### 学習効果の測定
- **コード生成精度**: Copilotが生成するコードの品質向上を追跡
- **開発速度**: タスク完了までの時間短縮を測定
- **エラー率**: Copilot使用時と非使用時のエラー発生率比較
- **学習曲線**: 新技術習得にかかる時間の変化を記録

### 知識共有
- **チーム内共有**: 効果的だったプロンプトやパターンをチームで共有
- **外部発信**: ブログやQiitaでの学習内容の発信
- **コミュニティ参加**: GitHub Copilotコミュニティでの知見共有

## CI/CD（継続的インテグレーション・継続的デプロイメント）指針

### CI/CDの基本方針
- **自動化**: 手動作業を最小限に抑え、ヒューマンエラーを防止
- **品質保証**: コードの品質を自動的にチェックし、問題を早期発見
- **高速フィードバック**: 開発者が迅速に問題を把握し、修正できる環境
- **一貫性**: 全ての環境で同じプロセスで実行し、環境差異を排除

### GitHub Actionsの使用指針

#### ワークフロー構成
本プロジェクトでは`.github/workflows/ci.yml`でCI/CDパイプラインを定義しています。

#### 実行タイミング
- **Pull Request作成時**: コードレビュー前の自動品質チェック
- **mainブランチプッシュ時**: マージ後の最終確認
- **手動実行**: 必要に応じて任意のタイミングでの実行

#### CI実行項目と順序
1. **環境セットアップ**: Node.js 18 + pnpm 10.11.0の準備
2. **キャッシュ復元**: pnpmストアとTurborepoキャッシュの活用
3. **依存関係インストール**: `pnpm install
4. **リンティング**: `pnpm lint` (ESLint)
5. **フォーマットチェック**: Prettier + package.json順序チェック
6. **型チェック**: `pnpm type-check` (TypeScript)
7. **ビルド**: `pnpm build` (Vite + TypeScript)
8. **テスト実行**: `pnpm test --passWithNoTests` (Vitest)

### パフォーマンス最適化戦略

#### キャッシュ戦略
- **pnpmストアキャッシュ**: 依存関係インストール時間の大幅短縮
- **Turborepoキャッシュ**: ビルド・テスト結果の効率的な再利用
- **キャッシュキー**: `pnpm-lock.yaml`ハッシュとgit SHAを使用

#### 並列実行
- **monorepo対応**: Turborepoによる効率的なタスク実行
- **依存関係解決**: パッケージ間の依存関係を考慮した最適な実行順序

### 品質ゲート基準

#### 必須チェック項目
- **ESLintエラー0件**: コーディング規約の完全遵守
- **TypeScriptエラー0件**: 型安全性の保証
- **フォーマットチェック**: コードスタイルの統一
- **ビルド成功**: 本番環境への展開可能性確認
- **テスト通過**: 機能の正常動作確認

#### 警告の扱い
- **ESLint警告**: 可能な限り0件を目指すが、一部許容
- **TypeScript警告**: 原則として修正対象
- **フォーマット警告**: 自動修正により必ず解決

### CI失敗時の対応フロー

#### 一般的な失敗パターンと対応
1. **リンティングエラー**: 
   - `pnpm lint --fix`で自動修正を試行
   - 手動修正が必要な場合は、エラーメッセージに従って対応

2. **フォーマットエラー**:
   - `pnpm format`で自動修正
   - `pnpm run format:package`でpackage.json整列

3. **型エラー**:
   - TypeScriptの型定義を確認・修正
   - 必要に応じて型ファイルの更新

4. **ビルドエラー**:
   - 依存関係の確認と更新
   - 設定ファイルの検証

5. **テストエラー**:
   - テストコードの修正
   - 実装コードの不具合修正

#### デバッグ手順
1. **ローカル再現**: 同じコマンドをローカル環境で実行
2. **ログ確認**: GitHub Actionsのログを詳細に確認
3. **段階的実行**: 各ステップを個別に実行して問題箇所を特定
4. **キャッシュクリア**: 必要に応じてキャッシュを削除して再実行

### CI結果の読み方

#### 成功時
- ✅ 全てのチェック項目が緑色で表示
- マージが可能な状態
- レビュー依頼を送信可能

#### 失敗時
- ❌ 失敗したステップが赤色で表示
- 詳細ログで具体的なエラー内容を確認
- 修正後に自動で再実行

#### 部分的成功
- ⚠️ 警告がある場合は黄色で表示
- 重要度に応じて修正を検討

### monorepo環境でのCI/CD考慮事項

#### パッケージ間依存
- **Turborepoの活用**: 変更されたパッケージのみビルド・テスト
- **依存関係グラフ**: パッケージ間の依存関係を考慮した実行順序
- **増分ビルド**: 前回の実行結果を活用した効率的なCI

#### 変更影響範囲の特定
- **affected analysis**: 変更されたファイルに影響を受けるパッケージの特定
- **選択的実行**: 必要なパッケージのみテスト・ビルド実行
- **全体テスト**: mainブランチでは全パッケージの包括的テスト

### セキュリティ考慮事項

#### シークレット管理
- **GitHub Secrets**: APIキーや認証情報の安全な管理
- **環境変数**: 機密情報のハードコーディング禁止
- **最小権限の原則**: 必要最小限の権限でCIを実行

#### 依存関係セキュリティ
- **脆弱性スキャン**: 定期的な依存関係の脆弱性チェック
- **セキュリティアップデート**: 重要な修正の迅速な適用
- **依存関係監査**: 新しい依存関係追加時の事前確認

### CI/CD改善の継続的取り組み

#### メトリクス監視
- **実行時間**: CI実行時間の定期的な測定と改善
- **成功率**: CI成功率の追跡と問題分析
- **キャッシュ効率**: キャッシュヒット率の監視

#### 定期的な見直し
- **月次レビュー**: CI/CDプロセスの効果と課題の確認
- **改善提案**: チームからのフィードバック収集と反映
- **技術アップデート**: 新しいCI/CD技術の評価と導入検討

### GitHub Copilot agentとCI/CDの連携

#### CI/CD関連のプロンプト例
- 「CIが失敗した原因を分析して修正方法を提案してください」
- 「新しいパッケージを追加する際のCI設定変更を教えてください」
- 「テストカバレッジを向上させるためのCI設定を提案してください」

#### 自動化可能な作業
- **コード品質チェック**: リンティングとフォーマットの自動修正
- **依存関係更新**: セキュリティアップデートの自動適用
- **ドキュメント更新**: CI設定変更時の関連ドキュメント更新