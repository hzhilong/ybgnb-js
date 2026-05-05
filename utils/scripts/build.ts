import { resolve } from 'path'
import { build } from 'tsup'

// 项目根目录
const projectRoot = resolve(import.meta.dirname, '../')

// 入口
const entryList: [string, string, 'node' | 'browser' | 'neutral'][] = [
  ['core', resolve(projectRoot, './src/core/index.ts'), 'neutral'],
  ['dom', resolve(projectRoot, './src/dom/index.ts'), 'browser'],
  ['node', resolve(projectRoot, './src/node/index.ts'), 'node'],
]

// 基础排除：内置模块和特定第三方包
const baseExternal = ['iconv-lite']

async function buildMultipleEntry() {
  for (const [moduleName, entryPath, platform] of entryList) {
    console.log(`构建 ${moduleName} 模块中...`)

    // 动态排除：项目内的其他模块
    const relativeExternals = entryList.filter(([m]) => m !== moduleName).map(([m]) => new RegExp(`^\\.\\.\\/${m}`))

    await build({
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
      tsconfig: resolve(projectRoot, `tsconfig.${moduleName}.json`),
      // 修正产物名 (tsup 默认会带上 .mjs / .cjs)
      outExtension({ format }) {
        return {
          js: format === 'esm' ? '.js' : '.cjs',
        }
      },
    })
  }
  console.log('\n所有模块构建成功！')
}

// 执行构建函数
buildMultipleEntry().catch((err) => {
  console.error('构建执行期间发生致命错误:', err)
  // 以失败状态退出
  process.exit(1)
})
