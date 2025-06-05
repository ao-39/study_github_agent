/**
 * @fileoverview Vitestテスト環境のセットアップファイル
 *
 * @description Vitestでのコンポーネントテストに必要な設定とマッチャーを提供します。
 * jest-dom のカスタムマッチャーをVitestで使用できるように設定しています。
 *
 * @see {@link https://vitest.dev/guide/} Vitest公式ガイド
 * @see {@link https://testing-library.com/docs/ecosystem-jest-dom/} jest-dom マッチャー
 */

// Vitestコンポーネントテスト用のセットアップファイル
import '@testing-library/jest-dom/vitest'
