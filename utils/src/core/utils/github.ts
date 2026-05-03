import { fetchWithFormat } from './fetch.js'

/** github 仓库信息 */
export interface GitHubRepo {
  /** 仓库所有者（用户或组织名） */
  owner: string
  /** 仓库名称 */
  repo: string
}

/** github 仓库分支信息 */
export type GitHubRepoBranch = GitHubRepo & {
  /** 分支名称 */
  branch: string
}

/** github 仓库文件信息 */
export type GitHubRepoFile = GitHubRepoBranch & {
  /** 文件路径 */
  filePath: string
}

/**
 * 从 url 解析 github 仓库信息
 * @param repositoryUrl 仓库 URL（支持带有git+前缀、具体文件路径）
 */
export function parseGithubRepoUrl(repositoryUrl: string): GitHubRepoBranch {
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

  throw new Error('解析插件仓库URL失败')
}

/**
 * 解析 github 仓库文件的原始内容的 url
 */
export function parseGithubRawUrl(gitHubRepoFile: GitHubRepoFile) {
  const { owner, repo, branch, filePath } = gitHubRepoFile
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
}

/**
 * 获取 github 仓库文件的 json 内容并解析为对象 T
 * @param gitHubRepoFile
 */
export async function getGithubRawJson<O>(gitHubRepoFile: GitHubRepoFile): Promise<O> {
  return JSON.parse(await fetchWithFormat(parseGithubRawUrl(gitHubRepoFile), 'json')) as O
}
