import { ConfigEnv, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default defineConfig((_configEnv: ConfigEnv) => {
  return {
    base: './',
    plugins: [
      // 生成 .d.ts 类型文件
      dts({
        // 指定 tsconfig.json 的路径
        tsconfigPath: 'tsconfig.app.json',
        // 输出目录
        outDir: 'dist',
        // 入口文件的根路径
        entryRoot: 'src',
      }),
    ],
    build: {
      // 代码混淆和压缩
      minify: true,
      lib: {
        // 库的入口文件
        entry: {
          index: path.resolve(__dirname, 'src/index.ts'),
        },
        // 库的名称，会作为全局变量名使用
        name: '@ybgnb/utils',
        formats: ['es', 'cjs'],
        // 输出文件名
        fileName: (format, entryName) => {
          if (format === 'es') {
            return `${entryName}.js`
          }
          return `${entryName}.umd.cjs`
        },
      },
      sourcemap: true,
      rollupOptions: {
        // 不想打包进库的依赖
        external: ['nanoid', 'dayjs'],
        output: {
          // 保持目录结构
          preserveModules: false,
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            nanoid: 'nanoid',
            dayjs: 'dayjs',
          },
        },
      },
    },
  }
})
