import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('GitHub Pages デプロイメント設定', () => {
  const distPath = join(process.cwd(), 'dist')
  const originalEnv = process.env.GITHUB_PAGES

  afterAll(() => {
    // 環境変数を元に戻す
    if (originalEnv) {
      process.env.GITHUB_PAGES = originalEnv
    } else {
      delete process.env.GITHUB_PAGES
    }
  })

  it('通常のビルドでは相対パスを使用する', () => {
    // 通常のビルドを実行
    delete process.env.GITHUB_PAGES
    execSync('pnpm vite build', { cwd: process.cwd() })

    // index.htmlを確認
    const indexHtml = readFileSync(join(distPath, 'index.html'), 'utf-8')
    
    // 通常のビルドでは / ベースパス
    expect(indexHtml).toContain('href="/vite.svg"')
    expect(indexHtml).toContain('src="/assets/')
    expect(indexHtml).toContain('href="/assets/')
  })

  it('GitHub Pages用ビルドでは正しいベースパスを使用する', () => {
    // GitHub Pages用ビルドを実行
    process.env.GITHUB_PAGES = 'true'
    execSync('pnpm vite build', { cwd: process.cwd() })

    // index.htmlを確認
    const indexHtml = readFileSync(join(distPath, 'index.html'), 'utf-8')
    
    // GitHub Pages用ビルドでは /study_github_agent/ ベースパス
    expect(indexHtml).toContain('href="/study_github_agent/vite.svg"')
    expect(indexHtml).toContain('src="/study_github_agent/assets/')
    expect(indexHtml).toContain('href="/study_github_agent/assets/')
  })

  it('ビルド成果物に必要なファイルが含まれる', () => {
    // GitHub Pages用ビルドを実行
    process.env.GITHUB_PAGES = 'true'
    execSync('pnpm vite build', { cwd: process.cwd() })

    // 必要なファイルの存在確認
    const indexHtml = readFileSync(join(distPath, 'index.html'), 'utf-8')
    
    expect(indexHtml).toContain('<!doctype html>')
    expect(indexHtml).toContain('<title>Study GitHub Agent</title>')
    expect(indexHtml).toContain('GitHub Copilot agentを学習するためのReactアプリケーション')
    expect(indexHtml).toContain('<div id="root"></div>')
  })
})