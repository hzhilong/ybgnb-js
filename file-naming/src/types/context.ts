import type { ExtendedFormats } from './extended-format.js'

/**
 * 文件命名上下文
 */
export interface FileNamingContext<TData = unknown> {
  /**
   * 序号，单个文件解析时为1
   */
  serialNumber: number
  /**
   * 总数，单个文件解析时为1
   */
  total: number

  /**
   * 解析日期
   */
  resolveDate: Date

  /**
   * 扩展的格式
   */
  extendedFormats: ExtendedFormats

  /**
   * 解析的数据
   */
  data: TData
}
