/**
 * 解析文件路径的结果
 */
export interface ResolveFilePathResult {
  /**
   * 相对路径
   */
  relativePath: string

  /**
   * 路径片段（按路径分隔符拆分后的各级目录/文件名，不对应命名字段）
   */
  segments: string[]
}
