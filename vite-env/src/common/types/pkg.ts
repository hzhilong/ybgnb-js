import type { PackageJSON } from '@npm/types'

/**
 * 应用 package.json 数据
 */
export interface AppPackageJSON extends PackageJSON {
  // 扩展的字段：项目英文名称
  productName: string
  // 扩展的字段：项目中文名称
  productCNName: string
}
