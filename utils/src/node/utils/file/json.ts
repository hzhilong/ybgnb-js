import fs from 'node:fs/promises'
import path from 'node:path'
import { isFileNotFoundError, ensureDir, isFile } from './base.js'

/**
 * 读取 JSON 文件
 */
export async function readJSONFile<T>(filePath: string): Promise<T> {
  if (!(await isFile(filePath))) {
    throw new Error('文件不存在')
  }
  const jsonRaw = await fs.readFile(path.resolve(filePath), 'utf-8')
  return JSON.parse(jsonRaw) as T
}

/**
 * 将数据原子写入 JSON 文件（先写临时文件再替换）
 */
export async function writeJSONFile<T>(file: string, data: T): Promise<void> {
  const tempFile = `${file}.tmp.${Date.now()}`
  const jsonContent = JSON.stringify(data, null, 2)
  await fs.writeFile(tempFile, jsonContent, 'utf-8')
  // 直接替换（会覆原文件）
  await fs.rename(tempFile, file)
}

/**
 * 读取 JSON 文件，修改后写回（原子操作）
 */
export async function updateJSON<T>(file: string, updater: (oldData: T) => T): Promise<T> {
  const oldData = await readJSONFile<T>(file)
  const newData = updater(oldData)
  await writeJSONFile(file, newData)
  return newData
}

/**
 * 从文件读取 JSON，若文件不存在则调用 initData 初始化并写入
 *
 * @param file 文件绝对路径或相对路径
 * @param initData 返回要写入的数据的异步函数
 * @returns 解析后的数据
 */
export async function readOrInitJSON<T>(file: string, initData: () => Promise<T>): Promise<T> {
  try {
    const content = await fs.readFile(file, 'utf-8')
    // 解析 JSON，若失败则抛出错误（不会误判为“不存在”）
    return JSON.parse(content) as T
  } catch (error) {
    // 文件不存在等其他错误要透传
    if (!isFileNotFoundError(error)) {
      throw error
    }
    // 文件不存在，生成初始数据
    const data = await initData()
    // 确保目录存在
    await ensureDir(path.dirname(file))
    // 写入文件，格式化 JSON
    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
    return data
  }
}
