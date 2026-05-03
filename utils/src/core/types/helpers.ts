/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 提取getter属性
 */
export type ExtractGetterProperties<T> = {
  [K in keyof T as K extends `get${infer Rest}` ? Uncapitalize<Rest> : never]: T[K] extends (
    ...args: any[]
  ) => Promise<infer R>
    ? R
    : never
}

/**
 * 至少包含一个字段
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

/**
 * 用元组限制长度
 */
export type MaxLengthArray<T, N extends number> = T[] & {
  length: N
  // 禁止索引访问超过 N-1
}

/**
 * 提取 T 中所有值类型为 V 的键
 */
export type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

/**
 * 任意方法
 */
export type AnyFn = (...args: any[]) => any

/**
 * 提取所有方法
 */
export type MethodKeys<T> = {
  [K in keyof T]-?: T[K] extends AnyFn ? K : never
}[keyof T]

/**
 * 方法参数类型
 */
export type MethodParams<T> = T extends (...args: infer P) => any ? P : never

/**
 * 方法返回类型
 */
export type MethodReturn<T> = T extends (...args: any[]) => infer R ? R : never

/**
 * 提取所有函数 key
 */
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends AnyFn ? K : never
}[keyof T]

/**
 * 拥有指定键集合的对象类型
 */
export type ObjectWithKeys<K extends string | symbol> = {
  [key in K]: any
}
