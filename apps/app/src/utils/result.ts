/**
 * Result型
 *
 * @description 成功時と失敗時の値を型安全に扱うための共通型です。
 * try/catch に頼らず、戻り値で成功・失敗を表現します。
 *
 * @typeParam T - 成功時の値の型
 * @typeParam E - 失敗時のエラー型
 */
export type Result<T, E> = Success<T> | Failure<E>

/**
 * 成功を表す型
 *
 * @typeParam T - 成功値の型
 */
export interface Success<T> {
  /** 成功フラグ */
  ok: true
  /** 成功時の値 */
  value: T
}

/**
 * 失敗を表す型
 *
 * @typeParam E - エラー値の型
 */
export interface Failure<E> {
  /** 失敗フラグ */
  ok: false
  /** エラー情報 */
  error: E
}
