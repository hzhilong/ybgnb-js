import tsESLint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import type { Linter } from 'eslint'
import { globalIgnores } from 'eslint/config'

const config: Linter.Config[] = [
  ...tsESLint.configs.recommended,
  globalIgnores(['**/dist/**', '**/node_modules/**', '**/.yalc/**', 'yalc.lock', '**/dist-ssr/**', '**/coverage/**']),
  prettier
]
export default config
