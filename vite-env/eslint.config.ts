import tsESLint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import type { Linter } from 'eslint'
import { globalIgnores } from 'eslint/config'
import n from 'eslint-plugin-n'

const config: Linter.Config[] = [
  ...tsESLint.configs.recommended,
  // 强制 Node.js 内置模块使用 node: 前缀导入
  {
    plugins: {
      n,
    },
    rules: {
      'n/prefer-node-protocol': 'error',
    },
  },
  globalIgnores(['**/dist/**', '**/node_modules/**', '**/.yalc/**', 'yalc.lock', '**/dist-ssr/**', '**/coverage/**']),
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
]
export default config
