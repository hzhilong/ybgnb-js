import { resolve } from 'path'
import { build, type InlineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'node:module'

// 项目根目录
const projectRoot = resolve(import.meta.dirname, '../')

// 入口
const entryList = [
  ['core', resolve(projectRoot, './src/core.ts')],
  ['dom', resolve(projectRoot, './src/dom.ts')],
  ['node', resolve(projectRoot, './src/node.ts')],
]

async function buildMultipleEntry() {
  for (const [moduleName, entryPath] of entryList) {
    console.log(`构建 ${moduleName} 模块中...`)

    try {
      // 创建当前文件的构建配置，合并并覆盖基础配置
      const currentBuildConfig = {
        root: projectRoot,
        configFile: false,
        envDir: projectRoot,
        publicDir: false,
        plugins: [
          // 生成 .d.ts 类型文件
          dts({
            tsconfigPath: `tsconfig.${moduleName}.json`,
            outDir: 'dist',
            entryRoot: 'src',
            // 将所有声明合并到一个文件中
            rollupTypes: false,
            exclude: ['scripts'],
          }),
        ],
        build: {
          // 代码混淆和压缩
          minify: true,
          outDir: 'dist',
          emptyOutDir: false,
          lib: {
            entry: entryPath,
            formats: ['es', 'cjs'],
            // 输出文件名
            fileName: (format, _entryName) => {
              if (format === 'es') {
                return `${moduleName}.js`
              }
              return `${moduleName}.umd.cjs`
            },
          },
          sourcemap: true,
          rolldownOptions: {
            // 不想打包进库的依赖
            external: (id: string) => {
              if (['iconv-lite'].includes(id)) return true
              if (builtinModules.includes(id) || id.startsWith('node:')) return true
              return false
            },
            output: {
              // 不保留目录结构
              preserveModules: false,
              // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
              globals: {
                'iconv-lite': 'iconv-lite',
              },
            },
          },
        },
      } satisfies InlineConfig
      await build(currentBuildConfig)

      console.log(`成功构建 ${moduleName} 模块\n`)
    } catch (error) {
      console.log(`构建 ${moduleName} 模块失败`, error)
      process.exit(1) // 构建失败则退出
    }
  }

  console.log('\n所有模块构建成功！')
}

// 执行构建函数
buildMultipleEntry().catch((err) => {
  console.error('构建执行期间发生致命错误:', err)
  process.exit(1) // 以失败状态退出
})
