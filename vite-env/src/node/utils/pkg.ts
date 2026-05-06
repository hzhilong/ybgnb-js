import { findPackageJSON } from 'node:module'
import * as fs from 'node:fs'
import type { AppPackageJSON } from '../../common/index.js'

/**
 * 读取 packageJson
 */
export function readPackageJson(proRoot: string): AppPackageJSON {
  const pkgPath = findPackageJSON(proRoot)
  if (!pkgPath) throw new Error('暂未找到 package.json')
  const content = fs.readFileSync(pkgPath, 'utf8')
  return JSON.parse(content)
}

/**
 * 获取应用作者
 */
export function getAppAuthor(packageJson: AppPackageJSON) {
  if (!packageJson.author) return ''
  const author = packageJson.author
  if (typeof author === 'string') return author
  return author.name
}

/**
 * 获取应用标题
 */
export function getAppTitle(packageJson: AppPackageJSON, mode: string): string {
  if (mode === 'production') {
    return `${packageJson.productName} ${packageJson.version}`
  } else {
    return `${packageJson.productName} ${packageJson.version} ${mode}`
  }
}

/**
 * 获取应用主页URL（为空则获取仓库URL）
 */
export function getAppHomePage(packageJson: AppPackageJSON): string {
  if (packageJson.homepage) return packageJson.homepage
  return getAppRepoUrl(packageJson)
}

/**
 * 获取应用仓库URL
 */
export function getAppRepoUrl(packageJson: AppPackageJSON): string {
  const repository = packageJson.repository
  if (!repository) return ''
  if (typeof repository === 'string') return repository
  if (repository.directory) return `${repository.url}/${repository.directory}`
  return repository.url
}
