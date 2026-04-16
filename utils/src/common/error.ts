import { getErrorMessage } from '../utils/error.js'

/**
 * 通用异常
 */
export class CommonError extends Error {
  // 异常信息
  message: string
  // 原始异常
  rawError?: Error

  constructor(message: string, rawError?: Error) {
    super(message)
    this.message = rawError ? `${message} ${getErrorMessage(rawError)}` : message
    this.rawError = rawError
  }
}

/**
 * 中止异常
 */
export class AbortError extends CommonError {
  constructor() {
    super('操作已取消')
  }
}
