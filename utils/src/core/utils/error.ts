import { CommonError } from '../error/common-error.js'

/**
 * 是否为取消操作的错误
 */
export function isCanceledError(err: unknown): err is Error {
  if (!(err instanceof Error)) return false

  return err.name === 'AbortError' || err.name === 'CanceledError' || ('code' in err && err.code === 'ERR_CANCELED')
}

/**
 * 创建取消错误
 * @param msg
 */
export function createAbortError(msg?: string): Error {
  const error = new Error(msg ?? '操作已取消')
  error.name = 'AbortError'
  return error
}

/**
 * 是否为通用错误对象
 */
export function isCommonError(error: unknown): error is CommonError {
  return error instanceof CommonError || (error instanceof Error && error.name === 'CommonError')
}

/**
 * 给错误消息添加前缀（空格隔开）
 */
function prefixError(error: Error, prefix?: string): Error {
  if (!prefix) return error

  error.message = `${prefix} ${error.message}`
  return error
}

/**
 * 转换到通用异常
 */
export function convertToCommonError(error: unknown, prefix?: string) {
  if (isCommonError(error)) {
    return prefixError(error, prefix)
  }
  return new CommonError(`${prefix} ${getErrorMessage(error)}`, error)
}

/**
 * 获取异常信息
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    return error.message
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return String(error) ?? '未知错误'
}
