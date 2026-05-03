import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import path from 'node:path'

/**
 * 下载文件
 */
export async function downloadFile(url: string, filePath: string) {
  const file = path.resolve(filePath)
  const res = await fetch(url)

  if (!res.ok || !res.body) {
    throw new Error(`下载失败: ${res.status}`)
  }

  await pipeline(res.body, createWriteStream(file))
}
