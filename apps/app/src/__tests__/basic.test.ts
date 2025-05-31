import { describe, it, expect } from 'vitest';

/**
 * 基本的なアプリケーションの動作をテストする
 */
describe('アプリケーション基本テスト', () => {
  it('基本的な計算が正しく動作すること', () => {
    expect(1 + 1).toBe(2);
  });

  it('文字列の結合が正しく動作すること', () => {
    const greeting = 'Hello';
    const name = 'GitHub Copilot';
    expect(`${greeting} ${name}`).toBe('Hello GitHub Copilot');
  });
});