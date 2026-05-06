import { join } from 'node:path'
import { type ConfigEnv, loadEnv, type UserConfig } from 'vite'
import { readPackageJson, getAppHomePage, getAppTitle, getAppAuthor, getAppRepoUrl } from './utils/pkg.js'
import { initEnvDefine } from './utils/env-define.js'

/**
 * 加载环境变量配置
 */
export function loadEnvConfig(
  { mode }: ConfigEnv,
  appEnvPrefixes: string = 'APP_',
  proRoot: string = process.cwd(),
): UserConfig {
  // 环境变量前缀
  const envPrefixes = ['VITE_', appEnvPrefixes]
  // 环境变量目录
  const envDir = join(proRoot, 'env')
  // 加载当前模式的所有环境变量
  const env = loadEnv(mode, envDir, appEnvPrefixes)
  const packageJson = readPackageJson(proRoot)
  // 需要特殊初始化的变量，使用packageJson配置的属性自动初始化
  const defineData = initEnvDefine(env, {
    APP_NPM_NAME: packageJson.name,
    APP_PRODUCT_NAME: packageJson.productName || '',
    APP_PRODUCT_CN_NAME: packageJson.productCNName || '',
    APP_PRODUCT_URL: getAppHomePage(packageJson),
    APP_TITLE: getAppTitle(packageJson, mode),
    APP_DESCRIPTION: packageJson.description || '',
    APP_VERSION: packageJson.version,
    APP_AUTHOR: getAppAuthor(packageJson),
    APP_REPO_URL: getAppRepoUrl(packageJson),
  })
  console.log('========================================================')
  console.log('项目名称：', packageJson.productName)
  console.log('当前模式：', mode)
  console.log('当前环境变量：')
  Object.keys(env).forEach((key) => {
    for (const envPrefix of envPrefixes) {
      if (key.startsWith(envPrefix)) {
        console.log(`   ${key} = ${env[key]}`)
      }
    }
  })
  console.log('========================================================')
  // https://vite.dev/config/ or https://vitejs.cn/vite5-cn/guide/
  return {
    // 开发或生产环境服务的公共基础路径
    base: './',
    // 环境变量目录
    envDir: envDir,
    // 环境变量前缀
    envPrefix: envPrefixes,
    // 定义全局常量替换（适用于一些常量，在js使用）
    define: defineData,
  }
}
