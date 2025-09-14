// 扩展的类型

/**
 * 提取getter属性
 */
export type ExtractGetterProperties<T> = {
  [K in keyof T as K extends `get${infer Rest}` ? Uncapitalize<Rest> : never]: T[K] extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<infer R>
    ? R
    : never
}
