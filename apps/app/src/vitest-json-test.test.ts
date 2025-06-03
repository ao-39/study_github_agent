import { describe, it, expect } from 'vitest'

describe('Vitest JSON レポートテスト', () => {
  it('成功するテスト', () => {
    expect(2 + 2).toBe(4)
  })

  it('時間のかかるテスト', async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(true).toBe(true)
  })

  it('レポート機能のテスト', () => {
    // JSON レポート機能が正常に動作することを確認
    expect(true).toBe(true)
  })
})