import type { BizResult, BizError } from '../types/biz-result.js'
import { serializeError } from './serialize.js'

/**
 * 是否为业务结果（序列化后）
 */
export function isBizResult<T = unknown>(result: unknown): result is BizResult<T> {
  return (
    result != null &&
    typeof result === 'object' &&
    'success' in result &&
    typeof result.success === 'boolean' &&
    'msg' in result &&
    typeof result.msg === 'string'
  )
}

/**
 * 执行异步函数，自动捕获异常并转换为 BizResult 对象
 * @param runFn 执行方法
 */
export const execBiz = async <T>(runFn: () => T | Promise<T>): Promise<BizResult<Awaited<T>>> => {
  try {
    return {
      success: true,
      msg: '操作成功',
      data: await runFn(),
    }
  } catch (e) {
    return {
      success: false,
      msg: '操作失败',
      error: serializeError(e),
    }
  }
}

/**
 * 解包 BizResult<T> 对象为 Promise<T>，非 BizResult 对象原样返回。
 */
export async function unwrapBizResult<T>(result: BizResult<T>): Promise<T>
export async function unwrapBizResult(result: unknown): Promise<unknown>
export async function unwrapBizResult<T>(result: BizResult<T> | unknown): Promise<T | unknown> {
  if (isBizResult<T>(result)) {
    if (result.success) {
      return result.data as T
    }

    if (result.error) {
      throw bizErrorToError(result.error)
    }

    throw new Error(result.msg)
  } else {
    return result
  }
}

export function bizErrorToError(bizError: BizError) {
  return Object.assign(new Error(), bizError)
}
