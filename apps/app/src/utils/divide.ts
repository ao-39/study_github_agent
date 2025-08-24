import { Result } from './result'

/**
 * 除算を安全に行う関数
 *
 * @description 0で割る場合はエラーを返します。
 *
 * @param dividend - 被除数
 * @param divisor - 除数
 * @returns 成功時は商、失敗時はエラーメッセージを含むResult
 *
 * @example
 * ```typescript
 * const result = divide(6, 3)
 * if (result.ok) {
 *   console.log(result.value) // 2
 * } else {
 *   console.error(result.error)
 * }
 * ```
 */
export const divide = (
  dividend: number,
  divisor: number
): Result<number, string> => {
  if (divisor === 0) {
    return { ok: false, error: '0では割り算できません' }
  }
  return { ok: true, value: dividend / divisor }
}
