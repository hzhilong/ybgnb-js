import path from 'node:path'
import { execWinCmd } from './cmd.js'
import { isFile } from '../file/base.js'

/**
 * 文件拷贝工具，支持文件或文件夹
 */
export async function copyFile(source: string, destination: string, signal?: AbortSignal) {
  const src = path.resolve(source)
  const dest = path.resolve(destination)

  let command: string

  if (await isFile(source)) {
    // 文件用 copy 命令
    command = `copy "${src}" "${dest}"`
    await execWinCmd(command, { signal: signal })
  } else {
    // 文件夹用 robocopy
    command = `robocopy "${src}" "${dest}" /E /NFL /NDL /NJH /NJS /NC /NS /NP`
    await execWinCmd(command, {
      codeIsSuccess: (number) => number < 8,
      signal: signal,
    })
  }
}
