/**
 * @fileoverview Vite環境の型定義ファイル
 *
 * @description Viteのクライアント側環境における型定義を提供します。
 * このファイルにより、import.meta.env などの Vite 固有の API が TypeScript で使用可能になります。
 *
 * @see {@link https://vitejs.dev/guide/env-and-mode.html} Vite環境変数とモード
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * PWA機能を有効にするかどうか
   * @default 'true'
   */
  readonly VITE_ENABLE_PWA?: string

  /**
   * GitHub Pages用ビルドかどうか
   * @default 'false'
   */
  readonly GITHUB_PAGES?: string

  /**
   * バンドル分析を有効にするかどうか
   * @default 'false'
   */
  readonly ANALYZE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * ビルド時に埋め込まれるグローバル変数の型定義
 */
declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string
