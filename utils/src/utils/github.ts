import { CommonError } from '../common/error.js'
import type { GithubRepository } from '../types/github.js'

/**
 * 从 url 解析 github 仓库信息
 * @param repositoryUrl 仓库 URL（支持带有git+前缀、具体文件路径）
 */
export function parseGithubRepo(repositoryUrl: string): GithubRepository {
  // 去掉 git+ 前缀
  repositoryUrl = repositoryUrl.replace(/^git\+/, '')

  const regexBase = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/)?$/
  const regexFile = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)$/

  // 情况 1：git clone 地址 或 repo 根路径
  const m1 = repositoryUrl.match(regexBase)
  if (m1) {
    return {
      owner: m1[1],
      repo: m1[2],
      branch: 'main', // 默认分支 main
    }
  }

  // 情况 2：具体文件路径
  const m2 = repositoryUrl.match(regexFile)
  if (m2) {
    return {
      owner: m2[1],
      repo: m2[2],
      branch: m2[3],
    }
  }

  throw new CommonError('解析插件仓库URL失败')
}
