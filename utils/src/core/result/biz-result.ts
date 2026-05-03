import { getErrorMessage } from '../utils/error.js'
import { CommonError } from '../error/common-error.js'

/**
 * 业务执行结果
 */
export class BizResult<T> {
  success: boolean
  msg: string
  data?: T

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
    return new BizResult<T>(false, getErrorMessage(e))
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
      throw new CommonError(this.msg)
    }
  }
}
