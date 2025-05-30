import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('アプリケーションタイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('🚀 Study GitHub Agent')).toBeDefined()
  })

  it('学習開始ボタンが表示される', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: '学習を開始' })).toBeDefined()
  })

  it('主要な機能カードが表示される', () => {
    render(<App />)
    expect(screen.getByText('⚡ Vite')).toBeDefined()
    expect(screen.getByText('⚛️ React')).toBeDefined()
    expect(screen.getByText('📦 Monorepo')).toBeDefined()
    expect(screen.getByText('🤖 GitHub Copilot')).toBeDefined()
  })
})
