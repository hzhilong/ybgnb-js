import type { Resolver, MaybePromise } from '../types/helpers.js'

/**
 * 解析值
 *
 * 如果传入的是函数，则执行函数并返回执行结果；
 * 如果传入的是普通值，则直接返回该值。
 *
 * 支持同步值、同步函数、异步函数。
 */
export async function resolveValue<T>(options: Resolver<T>): Promise<T> {
  if (typeof options === 'function') {
    const result = (options as () => MaybePromise<T>)()

    return result instanceof Promise ? await result : result
  }

  return options
}

/**
 * 解析正整数
 */
export function parsePositiveInteger(str: string) {
  const trimmed = str.trim()
  if (!/^\d+$/.test(trimmed)) return null
  try {
    return Number(trimmed)
  } catch {
    return null
  }
}
