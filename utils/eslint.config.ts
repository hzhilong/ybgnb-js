import tsESLint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import type { Linter } from 'eslint'
import { globalIgnores } from 'eslint/config'

export default [
  // TypeScript 推荐规则
  ...tsESLint.configs.recommended,
  globalIgnores(['**/dist/**', '**/node_modules/**','**/.yalc/**','yalc.lock','**/dist-ssr/**', '**/coverage/**']),

  // 关闭和 Prettier 冲突的规则
  prettier,
  {
    rules: {
      // 在这里写自定义规则
      // "@typescript-eslint/no-explicit-any": "warn",
    }
  }
] satisfies Linter.Config[]
