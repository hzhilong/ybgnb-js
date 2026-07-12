import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, './')

export default defineConfig({
  platform: 'neutral',
  entry: {
    index: resolve(root, './src/index.ts'),
  },
  outDir: 'dist',
  format: ['esm'],
  sourcemap: false,
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  tsconfig: resolve(root, `tsconfig.dev.json`),
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.js' : '.cjs',
    }
  },
})
