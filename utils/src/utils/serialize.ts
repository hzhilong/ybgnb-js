/**
 * 判断一个值是否为纯对象
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 递归移除对象（或数组）中的所有函数属性，返回一个可安全序列化的副本。
 *
 * @typeParam T - 输入值的类型。
 * @param value - 待处理的值（基本类型、对象、数组等）。
 * @param seen - 内部使用的 WeakMap，用于记录已访问过的对象，防止循环引用。
 *               调用方通常无需传递此参数。
 * @returns 处理后的新副本，其中所有函数属性都被移除。
 *          基本类型（string, number, boolean, null, undefined）将原样返回。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripFunctions<T>(value: T, seen = new WeakMap<object, any>()): T {
  if (typeof value === 'function') return undefined as T
  if (value === null || typeof value !== 'object') return value

  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Map ||
    value instanceof Set ||
    ArrayBuffer.isView(value) ||
    value instanceof ArrayBuffer
  ) {
    return value
  }

  if (seen.has(value as object)) {
    return seen.get(value as object)
  }

  if (Array.isArray(value)) {
    const out: unknown[] = []
    seen.set(value as object, out)
    for (const item of value) {
      out.push(stripFunctions(item, seen))
    }
    return out as T
  }

  if (!isPlainObject(value)) {
    return value
  }

  const out: Record<string, unknown> = {}
  seen.set(value as object, out)

  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'function') continue
    const next = stripFunctions(item, seen)
    if (next !== undefined) out[key] = next
  }

  return out as T
}

/**
 * 将错误转换为可 JSON 序列化的普通对象。
 */
export function serializeError(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    }
  }

  return {
    name: 'Error',
    message: String(err),
  }
}
