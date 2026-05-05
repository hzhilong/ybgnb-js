import fs from 'node:fs/promises'
import { mkdirSync } from 'node:fs'

/**
 * 判断路径是否是文件
 */
export async function isFile(filePath: string) {
  try {
    return (await fs.stat(filePath)).isFile()
  } catch {
    return false
  }
}

/**
 * 判断文件是否存在
 */
export async function existsFile(file: string, mode?: number) {
  try {
    fs.access(file, mode)
    return true
  } catch {
    return false
  }
}

/**
 * 确保目录存在
 */
export function ensureDirSync(dirPath: string) {
  mkdirSync(dirPath, { recursive: true })
}

/**
 * 确保目录存在
 */
export async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true })
}

/**
 * 判断错误是否为文件不存在
 */
export function isFileNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT'
  )
}
