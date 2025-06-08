import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'yaml'

describe('Cloudflare Pages デプロイワークフロー設定', () => {
  const workflowPath = join(
    process.cwd(),
    '../../.github/workflows/pages-preview.yml'
  )

  it('ワークフローファイルが存在する', () => {
    expect(() => readFileSync(workflowPath, 'utf-8')).not.toThrow()
  })

  it('有効なYAML形式である', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    expect(() => yaml.parse(content)).not.toThrow()
  })

  it('必要な設定項目が含まれている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    // 基本設定の確認
    expect(workflow.name).toBe('Cloudflare Pages Preview')
    expect(workflow.on).toHaveProperty('pull_request')
    expect(workflow.on).toHaveProperty('push')

    // ジョブ設定の確認
    expect(workflow.jobs).toHaveProperty('preview')
    const job = workflow.jobs.preview

    // 権限設定の確認
    expect(job.permissions).toHaveProperty('contents', 'read')
    expect(job.permissions).toHaveProperty('deployments', 'write')
    expect(job.permissions).toHaveProperty('pull-requests', 'write')

    // ステップの確認
    const stepNames = job.steps.map((step: any) => step.name)
    expect(stepNames).toContain('リポジトリのチェックアウト')
    expect(stepNames).toContain('Node.jsのセットアップ')
    expect(stepNames).toContain('pnpmのセットアップ')
    expect(stepNames).toContain('依存関係のインストール')
    expect(stepNames.some((name: string) => name.startsWith('アプリケーションのビルド'))).toBe(true)
    expect(stepNames.some((name: string) => name.startsWith('Cloudflare Pagesへのデプロイ'))).toBe(true)
    
    // commentジョブの存在確認
    const commentJob = workflow.jobs.comment
    expect(commentJob).toBeDefined()
    expect(commentJob.steps.some((step: any) => step.name === 'PRにデプロイ結果をコメント')).toBe(true)
  })

  it('Cloudflare Pagesデプロイステップが正しく設定されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const deployStep = workflow.jobs.preview.steps.find(
      (step: any) => step.name && step.name.startsWith('Cloudflare Pagesへのデプロイ')
    )

    expect(deployStep).toBeDefined()
    expect(deployStep.uses).toBe('cloudflare/wrangler-action@v3')
    expect(deployStep.id).toBe('deploy')

    // 必要なwithパラメータの確認
    expect(deployStep.with.apiToken).toBe('${{ secrets.CLOUDFLARE_API_TOKEN }}')
    expect(deployStep.with.accountId).toBe(
      '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}'
    )
    expect(deployStep.with.gitHubToken).toBe('${{ secrets.GITHUB_TOKEN }}')

    // コマンドにプロジェクト名とブランチが含まれていることを確認
    expect(deployStep.with.command).toContain(
      '--project-name=study-github-agent'
    )
    expect(deployStep.with.command).toContain('apps/app/dist')
  })

  it('PRコメントステップが正しく条件付きである', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const commentStep = workflow.jobs.comment.steps.find(
      (step: any) => step.name === 'PRにデプロイ結果をコメント'
    )

    expect(commentStep).toBeDefined()
    expect(workflow.jobs.comment.if).toBe("github.event_name == 'pull_request'")
    expect(commentStep.uses).toBe('peter-evans/create-or-update-comment@v4')

    // コメント内容にデプロイURLが含まれていることを確認
    expect(commentStep.with.body).toContain(
      'Cloudflare Pages デプロイ完了'
    )
  })
})
