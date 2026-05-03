import { execWinCmd } from './cmd.js'
import path from 'node:path'
import { ensureDir } from '../file/base.js'

/**
 * 打开注册表
 * @param path 显示的路径
 */
export async function openRegedit(path: string) {
  return execWinCmd(
    `taskkill /f /im regedit.exe & REG ADD "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Applets\\Regedit" /v "LastKey" /d "${path}" /f & regedit`,
  )
}

/**
 * 导出注册表
 * @param regPath 注册表路径
 * @param filePath 导出的文件路径
 */
export async function exportRegedit(regPath: string, filePath: string) {
  filePath = path.resolve(filePath)
  await ensureDir(regPath)
  await execWinCmd(`reg export "${regPath}" "${filePath}" /y`, undefined)
}

/**
 * 导入注册表
 * @param regPath 注册表路径
 * @param filePath 导入的文件路径
 */
export async function importRegedit(regPath: string, filePath: string) {
  await execWinCmd(`reg import "${path.resolve(filePath)}"`, undefined)
}
