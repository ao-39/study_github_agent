# バンドルサイズを可視化するrollup-plugin-visualizerの活用

## 内容
プロダクションビルドの最適化では、どのモジュールが大きな容量を占めているかを把握することが重要です。そこで役立つのが `rollup-plugin-visualizer` です。このプラグインを Vite の設定に組み込むと、バンドル内容を視覚的に分析するレポートを生成できます。設定はとても簡単で、次のように `vite.config.ts` に追記するだけで利用できます。

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
})
```

生成された `bundle-report.html` をブラウザで開くと、依存モジュールごとのサイズやツリーマップが確認できます。これを参考に不要な依存を減らしたり、コード分割のポイントを見極めたりといった改善に役立てられます。

## まとめ
`rollup-plugin-visualizer` を使うとバンドルの内訳を直感的に理解でき、無駄なコードを減らすヒントが得られます。リリース前のチェックとして取り入れておくと、アプリのパフォーマンスを継続的に向上させられるでしょう。
