/**
 * @fileoverview 環境変数のバリデーションとタイプセーフな取得
 *
 * @description このファイルはビルド時の環境変数をZodでバリデーションし、
 * タイプセーフに取得するための機能を提供します。
 * バリデーションに失敗した場合は、わかりやすいエラーメッセージと
 * 解決方法を表示します。
 */

import { z } from 'zod'

/**
 * 環境変数のスキーマ定義
 */
const envSchema = z.object({
  /**
   * PWA機能を有効にするかどうか
   * 'true' の場合にPWA機能が有効になります
   */
  VITE_ENABLE_PWA: z
    .string()
    .optional()
    .default('true')
    .refine(val => val === 'true' || val === 'false', {
      message: "VITE_ENABLE_PWA は 'true' または 'false' である必要があります",
    })
    .transform(val => val === 'true'),

  /**
   * GitHub Pages用ビルドかどうか
   * 既存の環境変数も含めて管理
   */
  GITHUB_PAGES: z
    .string()
    .optional()
    .default('false')
    .refine(val => val === 'true' || val === 'false', {
      message: "GITHUB_PAGES は 'true' または 'false' である必要があります",
    })
    .transform(val => val === 'true'),

  /**
   * バンドル分析を有効にするかどうか
   * 既存の環境変数も含めて管理
   */
  ANALYZE: z
    .string()
    .optional()
    .default('false')
    .refine(val => val === 'true' || val === 'false', {
      message: "ANALYZE は 'true' または 'false' である必要があります",
    })
    .transform(val => val === 'true'),
})

/**
 * 環境変数の型定義
 */
export type EnvVars = z.infer<typeof envSchema>

/**
 * 環境変数をバリデーションして取得
 *
 * @returns バリデーション済みの環境変数オブジェクト
 * @throws バリデーションに失敗した場合はエラーを投げます
 */
export function validateEnv(): EnvVars {
  const currentFile = import.meta.url
  const filePath = new URL(currentFile).pathname

  try {
    const result = envSchema.parse(process.env)
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        const field = err.path.join('.')
        return `  - ${field}: ${err.message}`
      })

      // eslint-disable-next-line no-console
      console.error('\n❌ 環境変数のバリデーションに失敗しました\n')
      // eslint-disable-next-line no-console
      console.error('🔍 エラー内容:')
      // eslint-disable-next-line no-console
      console.error(errorMessages.join('\n'))
      // eslint-disable-next-line no-console
      console.error('\n📋 必要な環境変数:')
      // eslint-disable-next-line no-console
      console.error('  - VITE_ENABLE_PWA: PWA機能の有効化 (true/false)')
      // eslint-disable-next-line no-console
      console.error(
        '  - GITHUB_PAGES: GitHub Pages用ビルド (true/false) [オプション]'
      )
      // eslint-disable-next-line no-console
      console.error(
        '  - ANALYZE: バンドル分析の有効化 (true/false) [オプション]'
      )
      // eslint-disable-next-line no-console
      console.error('\n💡 設定方法:')
      // eslint-disable-next-line no-console
      console.error('  export VITE_ENABLE_PWA=true')
      // eslint-disable-next-line no-console
      console.error('  export GITHUB_PAGES=false')
      // eslint-disable-next-line no-console
      console.error('  export ANALYZE=false')
      // eslint-disable-next-line no-console
      console.error('\n📁 バリデーション設定ファイル:')
      // eslint-disable-next-line no-console
      console.error(`  ${filePath}`)
      // eslint-disable-next-line no-console
      console.error('')

      // プロセスを終了してビルドを停止
      process.exit(1)
    }
    throw error
  }
}

/**
 * フロントエンド用の環境変数オブジェクト
 * VITE_プレフィックスが付いた変数のみがクライアントサイドで利用可能
 */
export const env = validateEnv()
