import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * 获取单个文件的大小（字节）
 * @param filePath 文件路径
 * @returns 文件大小，读取失败返回 0
 */
async function getFileSize(filePath: string): Promise<number> {
  try {
    const stat = await fs.stat(filePath)
    return stat.size
  } catch {
    // 权限不足或文件不存在时忽略，当作 0
    return 0
  }
}

/**
 * 获取符号链接自身的大小（指向路径的字符串长度，不是目标文件大小）
 */
async function getSymbolicLinkSize(linkPath: string): Promise<number> {
  try {
    const stat = await fs.lstat(linkPath)
    return stat.size
  } catch {
    return 0
  }
}

/**
 * 获取目录总大小（字节），递归统计所有子文件
 * 符号链接：只计算链接文件本身的大小，不跟随指向目录
 * 权限错误：跳过该文件/目录，大小计为 0
 * @param dir 目录路径
 * @returns 总字节数
 */
export async function getDirSize(dir: string): Promise<number> {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    // 无法读取目录时忽略，计为 0
    return 0
  }

  const tasks: Promise<number>[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    // 目录：递归
    if (entry.isDirectory()) {
      tasks.push(getDirSize(fullPath))
      continue
    }

    // 符号链接：只计算链接自身大小（不跟随）
    if (entry.isSymbolicLink()) {
      tasks.push(getSymbolicLinkSize(fullPath))
      continue
    }

    // 普通文件
    tasks.push(getFileSize(fullPath))
  }

  const results = await Promise.allSettled(tasks)
  return results.reduce((total, result) => {
    return total + (result.status === 'fulfilled' ? result.value : 0)
  }, 0)
}

/**
 * 获取文件/文件夹大小
 * @param filePath 文件/文件夹路径
 */
export async function getFileSizeKB(filePath: string) {
  try {
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      return (await getDirSize(filePath)) / 1024
    } else {
      return stat.size / 1024
    }
  } catch {
    return 0
  }
}
