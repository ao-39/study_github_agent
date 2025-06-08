# TanStack Routerの開発者ツールを環境変数で制御する

## 内容

TanStack Routerを採用したReactアプリケーションで開発者ツールを適切に管理したい場面があります。常に表示させたい開発者もいれば、集中したい時には非表示にしたい開発者もいるでしょう。この記事では、環境変数を使って開発者ツールの表示を柔軟に制御する方法をご紹介します。

この実装により、開発チーム内で異なる好みに対応できるだけでなく、テスト実行時やCI/CD環境では自動的に開発者ツールを無効化することで、一貫した動作を保証できます。

まず重要なのは、TanStack Routerの開発者ツールは現在パッケージ名が変更されていることです。以前の`@tanstack/router-devtools`から`@tanstack/react-router-devtools`に移行する必要があります。古いパッケージを使用していると、実行時に非推奨の警告が表示されてしまいます。

新しいパッケージをインストールして、古いパッケージを削除しましょう。

```bash
# 新しいパッケージを追加
pnpm add -D @tanstack/react-router-devtools

# 古いパッケージを削除
pnpm remove @tanstack/router-devtools
```

次に、環境変数で開発者ツールを制御するための仕組みを整えます。Zodを使用した環境変数スキーマに、新しい設定項目を追加します。

```typescript
// src/env.ts
const envSchema = z.object({
  // 既存の環境変数...
  
  /**
   * TanStack Router開発者ツールを有効にするかどうか
   * 開発時のルーティングデバッグに使用
   */
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .optional()
    .default('true')
    .refine(val => val === 'true' || val === 'false', {
      message: "VITE_ENABLE_DEVTOOLS は 'true' または 'false' である必要があります",
    })
    .transform(val => val === 'true'),
})
```

環境変数は`VITE_`プレフィックスを付けることで、フロントエンドコードからアクセス可能になります。デフォルト値は`true`とし、明示的に無効化したい場合のみ`false`を設定する形にしました。

TypeScriptの型定義も追加しておきます。

```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  /**
   * TanStack Router開発者ツールを有効にするかどうか
   * @default 'true'
   */
  readonly VITE_ENABLE_DEVTOOLS?: string
}
```

実際の制御ロジックは、ルートレイアウトコンポーネントで実装します。テスト環境では自動的に無効化され、通常の開発では環境変数に従って制御されるようにします。

```typescript
// src/routes/__root.tsx
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { env } from '../env'

const RootComponent: React.FC = () => {
  // テスト環境では開発ツールを無効にする
  const isTestEnvironment = 
    typeof process !== 'undefined' && process.env.NODE_ENV === 'test'

  // 環境変数による開発ツールの制御
  const shouldShowDevtools = env.VITE_ENABLE_DEVTOOLS && !isTestEnvironment

  return (
    <div>
      <Navigation />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      {shouldShowDevtools && <TanStackRouterDevtools />}
    </div>
  )
}
```

この実装では、以下の条件で開発者ツールが制御されます。まずテスト環境では常に無効化され、テストの実行に影響を与えません。通常の開発環境では環境変数`VITE_ENABLE_DEVTOOLS`の値に従って表示が切り替わります。そして本番ビルドでは、TanStack Routerの仕組みにより自動的に無効化されます。

使用方法は非常にシンプルです。開発者ツールを無効化したい場合は、プロジェクトルートで以下のコマンドを実行してから開発サーバーを起動します。

```bash
export VITE_ENABLE_DEVTOOLS=false
pnpm dev
```

再度有効化したい場合は、環境変数を`true`に設定するか、変数自体を削除してデフォルト値を使用します。

```bash
export VITE_ENABLE_DEVTOOLS=true
# または
unset VITE_ENABLE_DEVTOOLS
```

チーム開発では、個人の`.env.local`ファイルに設定を記述することで、メンバーそれぞれが好みに応じて開発者ツールの表示を制御できます。

```bash
# .env.local（個人設定用、gitignoreに含める）
VITE_ENABLE_DEVTOOLS=false
```

この機能により、開発者ツールが画面に表示されることで集中力が妨げられる場面でも、簡単に非表示にして作業に集中できます。一方で、ルーティングに関する問題をデバッグする際には、環境変数を変更するだけで開発者ツールを有効化し、詳細な情報を確認できます。

## まとめ

TanStack Routerの開発者ツールを環境変数で制御することで、開発者それぞれの作業スタイルに合わせた柔軟な開発環境を提供できました。パッケージの移行によって非推奨警告も解消され、より安定した開発体験を実現できています。

この仕組みは他の開発ツールにも応用できるパターンです。Redux DevTools ExtensionやReact Developer Toolsなど、開発時のみ使用するツールに対して、同様の環境変数制御を導入することで、より快適で効率的な開発環境を構築できるでしょう。