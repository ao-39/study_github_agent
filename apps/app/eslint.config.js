import config from '@study-github-agent/eslint-config'

export default [
  ...config,
  {
    ignores: [
      'test-results/**',
      'e2e-reports/**',
      'docs-api/**',
      'src/routeTree.gen.ts', // TanStackRouter 自動生成ファイル
    ],
  },
]
