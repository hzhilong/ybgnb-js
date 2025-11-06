import {readFileSync} from 'fs';
import {join} from 'path';
import {type ConfigEnv, loadEnv, type UserConfig} from "vite";
import type {AppPackageJSON} from "../common";
import {APP_ENV_PREFIXES} from "../common";

/**
 * 读取 packageJson
 */
function readPackageJson(): AppPackageJSON {
  const path = join(process.cwd(), 'package.json');
  const content = readFileSync(path, 'utf8');
  return JSON.parse(content);
}

/**
 * 获取应用作者
 */
function getAppAuthor(packageJson: AppPackageJSON) {
  if (!packageJson.author) return '';
  const author = packageJson.author;
  if (typeof author === 'string') return author;
  return author.name;
}

/**
 * 获取应用标题
 */
function getAppTitle(packageJson: AppPackageJSON, mode: string): string {
  if (mode === 'production') {
    return `${packageJson.productName} ${packageJson.version}`
  } else {
    return `${packageJson.productName} ${packageJson.version} ${mode}`
  }
}

/**
 * 初始化全局定义的常量替换
 * @param env 环境变量
 * @param newEnv 自定义的环境变量
 * @returns 全局定义的常量替换
 */
function initEnvDefine(env: Record<string, string>, newEnv: Record<string, string>) {
  const defineData: Record<string, string> = {}
  Object.keys(newEnv).forEach((key) => {
    env[key] = newEnv[key]
    defineData[`import.meta.env.${key}`] = JSON.stringify(newEnv[key])
  })
  return defineData
}

/**
 * 获取应用主页URL（为空则获取仓库URL）
 */
function getAppHomePage(packageJson: AppPackageJSON): string {
  if (packageJson.homepage) return packageJson.homepage;
  return getAppRepoUrl(packageJson)
}

/**
 * 获取应用仓库URL
 */
function getAppRepoUrl(packageJson: AppPackageJSON): string {
  const repository = packageJson.repository;
  if (!repository) return ''
  if (typeof repository === 'string') return repository
  if (repository.directory) return `${repository.url}/${repository.directory}`
  return repository.url
}

/**
 * 加载环境变量
 */
export function loadEnvConfig({mode}: ConfigEnv, appEnvPrefixes: string = APP_ENV_PREFIXES): UserConfig {
  // 环境变量前缀
  const envPrefixes = ['VITE_', appEnvPrefixes]
  // 环境变量目录
  const envDir = join(process.cwd(), 'env');
  // 加载当前模式的所有环境变量
  const env = loadEnv(mode, envDir, appEnvPrefixes)
  const packageJson = readPackageJson()
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
