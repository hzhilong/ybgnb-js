import path from 'node:path'
import * as fs from 'node:fs/promises'
import { execWinCmd } from './cmd.js'

/**
 * 打开资源管理器并定位到目录或者文件
 * @param fileOrDir 定位的目录或文件
 */
export async function showInExplorer(fileOrDir: string) {
  fileOrDir = path.resolve(fileOrDir)
  if ((await fs.stat(fileOrDir)).isDirectory()) {
    await execWinCmd(`start "" "${fileOrDir}"`)
  } else {
    await execWinCmd(`start "" explorer /select,"${fileOrDir}"`)
  }
}
