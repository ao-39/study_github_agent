import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'yaml'

describe('CI ビルドサマリー機能', () => {
  const workflowPath = join(process.cwd(), '../../.github/workflows/ci.yml')

  it('CIワークフローファイルが存在する', () => {
    expect(() => readFileSync(workflowPath, 'utf-8')).not.toThrow()
  })

  it('有効なYAML形式である', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    expect(() => yaml.parse(content)).not.toThrow()
  })

  it('ビルド結果分析ステップが正しく設定されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const buildAnalysisStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'ビルド結果分析（PR時のみ）'
    )

    expect(buildAnalysisStep).toBeDefined()
    expect(buildAnalysisStep.if).toBe("github.event_name == 'pull_request'")
    expect(buildAnalysisStep.id).toBe('build-analysis')

    // ビルド分析スクリプトの基本要素が含まれていることを確認
    expect(buildAnalysisStep.run).toContain('cd apps/app/dist')
    expect(buildAnalysisStep.run).toContain('find . -type f | sort')
    expect(buildAnalysisStep.run).toContain('total_files=')
    expect(buildAnalysisStep.run).toContain('ext_counts=')
    expect(buildAnalysisStep.run).toContain('max_size=')
    expect(buildAnalysisStep.run).toContain('total_size=')
    expect(buildAnalysisStep.run).toContain('files_table=')
  })

  it('PRコメントステップにビルドサマリーが含まれている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const commentStep = workflow.jobs.ci.steps.find(
      (step: any) =>
        step.name === 'PRにArtifactsダウンロードリンクをコメント（PR時のみ）'
    )

    expect(commentStep).toBeDefined()
    expect(commentStep.if).toBe("github.event_name == 'pull_request'")
    expect(commentStep.uses).toBe('peter-evans/create-or-update-comment@v4')

    // ビルドサマリーセクションが含まれていることを確認
    expect(commentStep.with.body).toContain('## 📊 ビルド結果サマリー')
    expect(commentStep.with.body).toContain(
      '${{ steps.build-analysis.outputs.total_files }}'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.build-analysis.outputs.total_size }}'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.build-analysis.outputs.max_file }}'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.build-analysis.outputs.max_size }}'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.build-analysis.outputs.ext_counts }}'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.build-analysis.outputs.files_table }}'
    )
  })

  it('ビルド分析ステップがビルドステップの後に配置されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const stepNames = workflow.jobs.ci.steps.map((step: any) => step.name)
    const buildStepIndex = stepNames.indexOf('ビルド')
    const buildAnalysisStepIndex =
      stepNames.indexOf('ビルド結果分析（PR時のみ）')

    expect(buildStepIndex).toBeGreaterThanOrEqual(0)
    expect(buildAnalysisStepIndex).toBeGreaterThanOrEqual(0)
    expect(buildAnalysisStepIndex).toBeGreaterThan(buildStepIndex)
  })

  it('ビルド分析の出力がPRコメントで適切に参照されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const buildAnalysisStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'ビルド結果分析（PR時のみ）'
    )
    const commentStep = workflow.jobs.ci.steps.find(
      (step: any) =>
        step.name === 'PRにArtifactsダウンロードリンクをコメント（PR時のみ）'
    )

    // ビルド分析ステップのIDが正しく設定されている
    expect(buildAnalysisStep.id).toBe('build-analysis')

    // 出力変数がすべてGITHUB_OUTPUTに設定されている
    expect(buildAnalysisStep.run).toContain('total_files=')
    expect(buildAnalysisStep.run).toContain('>> $GITHUB_OUTPUT')

    // PRコメントで正しい参照形式が使用されている
    const requiredOutputs = [
      'steps.build-analysis.outputs.total_files',
      'steps.build-analysis.outputs.total_size',
      'steps.build-analysis.outputs.max_file',
      'steps.build-analysis.outputs.max_size',
      'steps.build-analysis.outputs.ext_counts',
      'steps.build-analysis.outputs.files_table',
    ]

    requiredOutputs.forEach(output => {
      expect(commentStep.with.body).toContain(`\${{ ${output} }}`)
    })
  })
})
