import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * 查找目录下符合条件的文件路径（不遍历子目录）
 * @param dir 目标目录路径
 * @param prefix 文件名前缀（需全字匹配）
 * @param suffix 文件名后缀（需全字匹配，如 ".txt"）
 * @return 符合条件的文件完整路径的数组
 */
export async function findFilesByPrefixAndSuffix(dir: string, prefix?: string, suffix?: string): Promise<string[]> {
  return (await fs.readdir(dir, { withFileTypes: true }))
    .filter(
      (dirent) =>
        // 仅保留文件（排除子目录）
        dirent.isFile() &&
        // 文件名匹配前缀
        dirent.name.startsWith(prefix || '') &&
        // 文件名匹配后缀
        dirent.name.endsWith(suffix || ''),
    )
    .map((dirent) => path.join(dir, dirent.name))
}

/**
 * 查找文件（包含子目录）
 * @param dir     目录
 * @param target  查找目标名称或者过滤函数
 */
export async function findFiles(
  dir: string,
  target: string | ((fileName: string, fullPath?: string) => boolean),
): Promise<string[]> {
  const results: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await findFiles(fullPath, target)))
    } else if (typeof target === 'string' && entry.name === target) {
      results.push(fullPath)
    } else if (typeof target === 'function' && target(entry.name, fullPath)) {
      results.push(fullPath)
    }
  }
  return results
}
