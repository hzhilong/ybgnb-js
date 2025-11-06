// 扩展 ImportMetaEnv 接口
// 外部项目可以通过声明合并来扩展这个接口
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly APP_NPM_NAME: string
    readonly APP_PRODUCT_NAME: string
    readonly APP_PRODUCT_CN_NAME: string
    readonly APP_PRODUCT_URL: string
    readonly APP_TITLE: string
    readonly APP_DESCRIPTION: string
    readonly APP_VERSION: string
    readonly APP_AUTHOR: string
    readonly APP_REPO_URL: string
    readonly APP_LOG_LEVEL: string
    readonly BASE_URL: string
    readonly MODE: string
    readonly PROD: boolean
    readonly DEV: boolean
  }
}
