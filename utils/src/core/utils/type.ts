import type { ObjectWithKeys } from '../types/helpers.js'

/**
 * 判断一个值是否为纯对象
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 包括类实例、普通对象，不包括 数组、null 和原始类型
 */
export function isObject<K extends string | symbol>(value: unknown, key?: K): value is ObjectWithKeys<K> {
  if (value === null || typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  if (key !== undefined) {
    return key in value
  }
  return true
}
