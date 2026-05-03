import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * 删除指定目录下的所有文件和子目录（保留指定目录）
 * @param dir 目标目录路径
 * @return 成功删除的文件或目录路径数组
 */
export async function emptyDirectory(dir: string) {
  const deletedPaths: string[] = []
  // 读取目录中的所有文件和子目录
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // 如果是目录，递归删除其内容
      deletedPaths.push(...(await emptyDirectory(fullPath)))
      // 删除空目录
      await fs.rmdir(fullPath)
    } else {
      // 如果是文件，删除文件
      await fs.unlink(fullPath)
    }
    deletedPaths.push(fullPath)
  }
  return deletedPaths
}

/**
 * 删除文件（不删除目录）
 * @param paths 文件路径列表
 * @returns 成功删除的文件路径数组
 */
export async function deleteFiles(paths: string[]): Promise<string[]> {
  const results = await Promise.allSettled(
    paths.map(async (file) => {
      await fs.unlink(file)
      return file
    }),
  )

  return results.filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled').map((r) => r.value)
}
