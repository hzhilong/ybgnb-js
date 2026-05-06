import { resolve } from 'node:path'
import { defineConfig, type Options } from 'tsup'
import { cp } from 'node:fs/promises'

const root = resolve(import.meta.dirname, './')
const baseConfig: Options = {
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  minify: true,
  splitting: false,
  external: ['vite'],
  outExtension: () => {
    return {
      js: '.js',
    }
  },
}

export default defineConfig([
  {
    ...baseConfig,
    platform: 'neutral',
    entry: {
      types: resolve(root, 'src/common/index.ts'),
    },
    tsconfig: resolve(root, `tsconfig.common.json`),
    external: ['vite'],
  },
  {
    ...baseConfig,
    platform: 'node',
    entry: {
      init: resolve(root, 'src/cli/init.ts'),
    },
    dts: false,
    tsconfig: resolve(root, `tsconfig.scripts.json`),
  },
  {
    ...baseConfig,
    platform: 'node',
    entry: {
      index: resolve(root, 'src/node/index.ts'),
    },
    tsconfig: resolve(root, `tsconfig.node.json`),
    external: ['vite'],
    onSuccess: async () => {
      await cp(resolve(root, 'src/common/env.d.ts'), resolve(root, 'dist/env.d.ts'))
    },
  },
])
