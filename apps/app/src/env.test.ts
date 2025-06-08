/**
 * @fileoverview 環境変数設定のテスト
 *
 * @description ビルド時環境変数のバリデーションと
 * フロントエンドでの利用可能性をテストします。
 */

import { describe, test, expect } from 'vitest'
import { env } from './env'

describe('環境変数設定', () => {
  test('デフォルト値が正しく設定される', () => {
    expect(typeof env.VITE_ENABLE_PWA).toBe('boolean')
    expect(typeof env.GITHUB_PAGES).toBe('boolean')
    expect(typeof env.ANALYZE).toBe('boolean')
    expect(typeof env.VITE_ENABLE_DEVTOOLS).toBe('boolean')
  })

  test('VITE_ENABLE_PWAのデフォルト値はtrue', () => {
    // デフォルト値はtrueに設定されている
    expect(env.VITE_ENABLE_PWA).toBe(true)
  })

  test('GITHUB_PAGESのデフォルト値はfalse', () => {
    expect(env.GITHUB_PAGES).toBe(false)
  })

  test('ANALYZEのデフォルト値はfalse', () => {
    expect(env.ANALYZE).toBe(false)
  })

  test('VITE_ENABLE_DEVTOOLSのデフォルト値はfalse', () => {
    expect(env.VITE_ENABLE_DEVTOOLS).toBe(false)
  })

  test('フロントエンドで環境変数にアクセス可能', () => {
    // VITE_プレフィックスが付いた変数はimport.meta.envでアクセス可能
    expect(import.meta.env).toBeDefined()

    // VITE_ENABLE_PWAはフロントエンドでアクセス可能な形式で提供
    const enablePwa = env.VITE_ENABLE_PWA
    expect(typeof enablePwa).toBe('boolean')

    // VITE_ENABLE_DEVTOOLSもフロントエンドでアクセス可能
    const enableDevtools = env.VITE_ENABLE_DEVTOOLS
    expect(typeof enableDevtools).toBe('boolean')
  })
})
