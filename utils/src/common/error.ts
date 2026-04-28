/**
 * 通用错误
 */
export class CommonError extends Error {
  // 原始异常
  rawError?: Error

  constructor(message: string, rawError?: unknown) {
    super(message)

    if (rawError !== undefined) {
      this.rawError = rawError instanceof Error ? rawError : new Error(String(rawError))
    }

    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }

  toString() {
    return `${this.name}: ${this.message}${this.rawError ? ` (caused by ${this.rawError})` : ''}`
  }
}

/**
 * 中止异常
 */
export class AbortError extends CommonError {
  constructor(message?: string) {
    super(message ?? '操作已取消')
  }
}
