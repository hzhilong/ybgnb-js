import type {PackageJSON} from "@npm/types";

export interface AppPackageJSON extends PackageJSON {
  productName: string
  productCNName: string
}

export interface AppEnv {
  APP_NPM_NAME: string,
  APP_PRODUCT_NAME: string,
  APP_PRODUCT_CN_NAME: string,
  APP_PRODUCT_URL: string,
  APP_TITLE: string,
  APP_DESCRIPTION: string,
  APP_VERSION: string,
  APP_AUTHOR: string,
  APP_REPO_URL: string,
  APP_LOG_LEVEL: string,
  BASE_URL: string,
  MODE: string,
  PROD: boolean,
  DEV: boolean,
}
