#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

const command = process.argv[2]

if (command !== 'init') {
  console.log('请使用命令: @ybgnb/vite-env init')
  process.exit(0)
}

const cwd = process.cwd()

// 用户项目目标路径
const targetFile = resolve(cwd, 'src/vite-env.d.ts')

if (existsSync(targetFile)) {
  console.log('vite-env.d.ts 已存在')
  process.exit(0)
}

mkdirSync(dirname(targetFile), { recursive: true })

// 库内置模板文件
const sourceFile = resolve(import.meta.dirname, 'env.d.ts')

copyFileSync(sourceFile, targetFile)

console.log('vite-env.d.ts 已成功创建')
