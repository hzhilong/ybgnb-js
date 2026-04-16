import { CommonError } from '../common/error.js'

/**
 * 判断是否为通用异常
 */
export function isCommonError(error: unknown): error is CommonError {
  return error instanceof CommonError
}

/**
 * 设置异常信息的前置提示
 * @param error 异常
 * @param preMsg  前置信息  `${preMsg}${error.message}`
 */
export function prependErrorMessage(error: CommonError, preMsg?: string): CommonError {
  if (preMsg) {
    error.message = `${preMsg} ${error.message}`
  }
  return error
}

/**
 * 转换到通用异常
 * @param error 异常
 * @param preMsg  前置提示 `${preMsg}${error.message}`
 */
export function convertToCommonError(error: unknown, preMsg?: string): CommonError {
  if (isCommonError(error)) {
    return prependErrorMessage(error, preMsg)
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  ) {
    const newError = error as { message: string }
    return prependErrorMessage(new CommonError(newError.message), preMsg)
  } else {
    // 如果抛出的异常不是object
    return prependErrorMessage(new CommonError(String(error)), preMsg)
  }
}

/**
 * 获取异常信息
 */
export function getErrorMessage(error: unknown): string {
  return convertToCommonError(error).message
}
