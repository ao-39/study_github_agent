import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'yaml'

/**
 * CIのVitestテスト結果サマリー表示機能のテスト
 *
 * 問題: PRコメントでの単体テスト件数が常に0件になってしまう
 */
describe('CI Vitestテスト結果サマリー機能', () => {
  const workflowPath = join(process.cwd(), '../../.github/workflows/ci.yml')

  it('CIワークフローファイルが存在する', () => {
    expect(() => readFileSync(workflowPath, 'utf-8')).not.toThrow()
  })

  it('Vitestテスト結果解析ステップが正しく設定されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const parseVitestStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'Vitestテスト結果を解析・準備（PR時のみ）'
    )

    expect(parseVitestStep).toBeDefined()
    expect(parseVitestStep.if).toBe("github.event_name == 'pull_request'")
    expect(parseVitestStep.id).toBe('parse-vitest')
    expect(parseVitestStep.run).toBe('bash .github/scripts/parse-vitest.sh')
  })

  it('Vitestテスト結果PRコメントステップが正しく設定されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const commentStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'Vitestテスト結果をPRにコメント（PR時のみ）'
    )

    expect(commentStep).toBeDefined()
    expect(commentStep.if).toBe(
      "github.event_name == 'pull_request' && steps.parse-vitest.outputs.json_exists == 'true'"
    )
    expect(commentStep.uses).toBe('peter-evans/create-or-update-comment@v4')
  })

  it('Vitestテスト結果コメントに統計情報が含まれている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const commentStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'Vitestテスト結果をPRにコメント（PR時のみ）'
    )

    expect(commentStep).toBeDefined()

    // テストサマリーセクションが含まれていることを確認
    expect(commentStep.with.body).toContain('## 🧪 Vitestテスト結果サマリー')

    // テスト統計情報の参照が含まれていることを確認
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.total_tests }}件'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.passed_tests }}件'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.failed_tests }}件'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.pending_tests }}件'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.todo_tests }}件'
    )

    // テストスイート情報の参照が含まれていることを確認
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.total_suites }}件'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.passed_suites }}件'
    )
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.failed_suites }}件'
    )

    // 実行時間の参照が含まれていることを確認
    expect(commentStep.with.body).toContain(
      '${{ steps.parse-vitest.outputs.duration_sec }}秒'
    )
  })

  it('Vitestテスト実行ステップがテスト結果解析ステップの前に配置されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const stepNames = workflow.jobs.ci.steps.map((step: any) => step.name)
    const testStepIndex = stepNames.indexOf('Vitestユニットテスト実行')
    const parseStepIndex = stepNames.indexOf(
      'Vitestテスト結果を解析・準備（PR時のみ）'
    )

    expect(testStepIndex).toBeGreaterThanOrEqual(0)
    expect(parseStepIndex).toBeGreaterThanOrEqual(0)
    expect(parseStepIndex).toBeGreaterThan(testStepIndex)
  })

  it('parse-vitestステップの出力がPRコメントで適切に参照されている', () => {
    const content = readFileSync(workflowPath, 'utf-8')
    const workflow = yaml.parse(content)

    const parseVitestStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'Vitestテスト結果を解析・準備（PR時のみ）'
    )
    const commentStep = workflow.jobs.ci.steps.find(
      (step: any) => step.name === 'Vitestテスト結果をPRにコメント（PR時のみ）'
    )

    // parse-vitestステップのIDが正しく設定されている
    expect(parseVitestStep.id).toBe('parse-vitest')

    // PRコメントで正しい参照形式が使用されている
    const requiredOutputs = [
      'steps.parse-vitest.outputs.total_tests',
      'steps.parse-vitest.outputs.passed_tests',
      'steps.parse-vitest.outputs.failed_tests',
      'steps.parse-vitest.outputs.pending_tests',
      'steps.parse-vitest.outputs.todo_tests',
      'steps.parse-vitest.outputs.duration_sec',
      'steps.parse-vitest.outputs.total_suites',
      'steps.parse-vitest.outputs.passed_suites',
      'steps.parse-vitest.outputs.failed_suites',
    ]

    requiredOutputs.forEach(output => {
      expect(commentStep.with.body).toContain(`\${{ ${output} }}`)
    })

    // success は条件分岐で使われているので別途確認
    expect(commentStep.with.body).toContain(
      "steps.parse-vitest.outputs.success == 'true'"
    )
  })
})
