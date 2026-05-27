import { getErrorMessage } from '../utils/error.js'

/**
 * 业务执行结果
 */
export class BizResult<T> {
  success: boolean
  msg: string
  data?: T
  errorName?: string

  constructor(success: boolean, msg: string, data?: T) {
    this.success = success
    this.msg = msg
    this.data = data
  }

  static createSuccess<T>(data: T) {
    return new BizResult(true, '操作成功', data)
  }

  static createFail<T>(msg: string = '操作失败', data?: T) {
    return new BizResult(false, msg, data)
  }

  static createError<T>(e: unknown) {
    const bizResult = new BizResult<T>(false, getErrorMessage(e))
    if (e && typeof e === 'object' && 'name' in e && typeof e.name === 'string') {
      bizResult.errorName = e.name
    }
    return bizResult
  }

  /**
   * 展开成Promise
   */
  async toPromise(): Promise<void>
  async toPromise<T>(): Promise<T>
  async toPromise<T = void>(): Promise<T> {
    if (this.success) {
      return this.data as T
    } else {
      const error = new Error(this.msg)
      if (this.errorName) error.name = this.errorName
      throw error
    }
  }
}
