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
    expect(workflow.on).not.toHaveProperty('pull_request')
    expect(workflow.on).toHaveProperty('workflow_run')

    // workflow_runの設定確認
    expect(workflow.on.workflow_run.workflows).toContain('CI')
    expect(workflow.on.workflow_run.types).toContain('completed')
    expect(workflow.on.workflow_run.branches).toContain('main')

    // ジョブ設定の確認
    expect(workflow.jobs).toHaveProperty('preview')
    const job = workflow.jobs.preview

    // CI成功時のみ実行する条件の確認
    expect(job.if).not.toContain("github.event_name == 'pull_request'")
    expect(job.if).toContain(
      "github.event.workflow_run.conclusion == 'success'"
    )

    // 権限設定の確認
    expect(job.permissions).toHaveProperty('contents', 'read')
    expect(job.permissions).toHaveProperty('deployments', 'write')
    expect(job.permissions).toHaveProperty('pull-requests', 'write')

    // ステップの確認
    const stepNames = job.steps.map((step: any) => step.name)
    expect(stepNames).toContain('プルリクエスト情報を取得')
    expect(stepNames).toContain('リポジトリのチェックアウト')
    expect(stepNames).toContain('Node.jsのセットアップ')
    expect(stepNames).toContain('pnpmのセットアップ')
    expect(stepNames).toContain('依存関係のインストール')
    expect(stepNames).toContain('アプリケーションのビルド')
    expect(stepNames).toContain('Cloudflare Pagesへのデプロイ')
    expect(stepNames).toContain('PRにデプロイ結果をコメント（PR時のみ）')
  })

  it('Cloudflare Pagesデプロイステップが正しく設定されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const deployStep = workflow.jobs.preview.steps.find(
      (step: any) => step.name === 'Cloudflare Pagesへのデプロイ'
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
    expect(deployStep.with.command).toContain(
      '${{ steps.pr-info.outputs.pr_head_ref }}'
    )
  })

  it('PRコメントステップが正しく条件付きである', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const commentStep = workflow.jobs.preview.steps.find(
      (step: any) => step.name === 'PRにデプロイ結果をコメント（PR時のみ）'
    )

    expect(commentStep).toBeDefined()
    expect(commentStep.if).toBe("steps.pr-info.outputs.is_pr == 'true'")
    expect(commentStep.uses).toBe('peter-evans/create-or-update-comment@v4')

    // コメント内容にデプロイURLが含まれていることを確認
    expect(commentStep.with.body).toContain(
      '${{ steps.deploy.outputs.deployment-url }}'
    )

    // issue-numberが動的に設定されていることを確認
    expect(commentStep.with['issue-number']).toBe(
      '${{ steps.pr-info.outputs.pr_number }}'
    )
  })

  it('プルリクエスト情報取得ステップが正しく設定されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const prInfoStep = workflow.jobs.preview.steps.find(
      (step: any) => step.name === 'プルリクエスト情報を取得'
    )

    expect(prInfoStep).toBeDefined()
    expect(prInfoStep.uses).toBe('actions/github-script@v7')
    expect(prInfoStep.id).toBe('pr-info')

    // スクリプトがworkflow_runイベントのみに対応していることを確認
    expect(prInfoStep.with.script).not.toContain('pull_request')
    expect(prInfoStep.with.script).toContain('workflow_run')
  })
})
