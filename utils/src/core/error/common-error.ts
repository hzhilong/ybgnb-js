import { getErrorMessage } from '../utils/error.js'

/**
 * 通用错误
 */
export class CommonError extends Error {
  // 原始错误
  cause?: Error

  constructor(message: string, cause?: unknown) {
    super(message)

    if (cause !== undefined) {
      this.cause = cause instanceof Error ? cause : new Error(getErrorMessage(cause))
    }

    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }

  toString() {
    return `${this.name}: ${this.message}${this.cause ? ` (caused by ${this.cause})` : ''}`
  }
}
