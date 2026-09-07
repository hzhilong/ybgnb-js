import { resolve } from 'node:path'
import { defineConfig, type Options } from 'tsup'

const root = resolve(import.meta.dirname, './')
// 基础排除：内置模块和特定第三方包
const baseExternal = ['iconv-lite']

// 入口
const entryList: [string, string, 'node' | 'browser' | 'neutral'][] = [
  ['core', resolve(root, './src/core/index.ts'), 'neutral'],
  ['dom', resolve(root, './src/dom/index.ts'), 'browser'],
  ['node', resolve(root, './src/node/index.ts'), 'node'],
]

const options = entryList.map(([moduleName, entryPath, platform]) => {
  // 动态排除：项目内的其他模块
  const relativeExternals = entryList.filter(([m]) => m !== moduleName).map(([m]) => new RegExp(`^\\.\\.\\/${m}`))
  return {
    platform: platform,
    entry: {
      [moduleName]: entryPath,
    },
    outDir: 'dist',
    format: ['esm', 'cjs'],
    sourcemap: true,
    // 类型生成
    dts: true,
    clean: false,
    minify: true,
    // 禁用代码分割，确保每个入口是独立文件
    splitting: false,
    external: [...baseExternal, ...relativeExternals],
    tsconfig: resolve(root, `tsconfig.${moduleName}.json`),
    // 修正产物名 (tsup 默认会带上 .mjs / .cjs)
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.js' : '.cjs',
      }
    },
  } satisfies Options
})

export default defineConfig(options)
