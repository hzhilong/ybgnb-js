/**
 * 通用错误
 */
export class CommonError extends Error {
  // 原始错误
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
