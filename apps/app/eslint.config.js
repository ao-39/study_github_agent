import config from '@study-github-agent/eslint-config'

export default [
  ...config,
  {
    ignores: [
      'test-results/**',
      'docs-api/**',
      'src/routeTree.gen.ts', // TanStackRouter 自動生成ファイル
    ],
  },
]
