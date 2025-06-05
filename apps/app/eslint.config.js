import config from '@study-github-agent/eslint-config'

export default [
  ...config,
  {
    ignores: ['test-results/**', 'docs-api/**'],
  },
]
