import path from 'path'
import dts from 'rollup-plugin-dts'
import typescript from '@rollup/plugin-typescript'
import {defineConfig} from 'rollup'

const defineSrcConfig = (name) => {
  return {
    input: {
      [name]: path.resolve(`src/${name}/index.ts`),
    },
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].js',
      preserveModules: false,
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: `tsconfig.${name}.json`,
        declaration: false,
      }),
    ],
    external: ['fs', 'path', 'vite'],
  }
}

const defineDtsConfig = (name, src) => {
  return {
    input: {
      [name]: src ? src : path.resolve(`src/${name}/index.ts`),
    },
    output: {
      dir: 'dist',
      entryFileNames: '[name].d.ts',
      format: 'es',
    },
    plugins: [dts()],
  }
}

export default defineConfig([
  defineSrcConfig('common'),
  defineDtsConfig('common'),
  defineSrcConfig('browser'),
  defineDtsConfig('browser'),
  defineSrcConfig('node'),
  defineDtsConfig('node'),
  defineDtsConfig('env', 'src/env.d.ts'),
])
