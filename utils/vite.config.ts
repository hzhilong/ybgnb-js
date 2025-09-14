import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    // 设置为 false 可以禁用代码混淆和压缩
    // 这对于库的开发和调试非常有用
    minify: false,

    lib: {
      // 库的入口文件
      entry: 'src/index.ts',

      // UMD 构建模式下，暴露的全局变量名
      name: 'ybgnb-js-utils',

      // 你可以自定义构建后的文件名
      // [name] 会被替换为 package.json 中的 name 字段
      fileName: (format) => `index.${format === 'umd' ? 'umd.js' : 'mjs'}`,

      // 需要输出的模块格式
      formats: ['es', 'umd'],
    },
    // 建议为库开启 sourcemap
    sourcemap: true,
  },
  plugins: [
    // 这个插件会自动生成 .d.ts 文件
    dts({
      // 指定 tsconfig.json 的路径
      tsconfigPath: 'tsconfig.json',
      // 输出目录
      outDir: 'dist',
    }),
  ],
});
