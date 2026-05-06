/**
 * 应用环境变量
 */
export interface AppEnv {
  APP_NPM_NAME: string
  APP_PRODUCT_NAME: string
  APP_PRODUCT_CN_NAME: string
  APP_PRODUCT_URL: string
  APP_TITLE: string
  APP_DESCRIPTION: string
  APP_VERSION: string
  APP_AUTHOR: string
  APP_REPO_URL: string
  APP_LOG_LEVEL: string
  BASE_URL: string
  MODE: string
  PROD: boolean
  DEV: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
