import { CommonError, AbortError } from '../common/error.js'

export function isCommonError(error: unknown): error is CommonError {
  return error instanceof CommonError || (error instanceof Error && error.name === 'CommonError')
}

export function isAbortError(error: unknown): error is AbortError {
  return error instanceof AbortError || (error instanceof Error && error.name === 'AbortError')
}

/**
 * 设置异常信息的前置提示
 */
function withPrefixedMessage(error: CommonError, prefix?: string): CommonError {
  if (!prefix) return error

  error.message = `${prefix} ${error.message}`
  return error
}

/**
 * 转换到通用异常
 */
export function convertToCommonError(error: unknown, prefix?: string) {
  if (isCommonError(error)) {
    return withPrefixedMessage(error, prefix)
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
