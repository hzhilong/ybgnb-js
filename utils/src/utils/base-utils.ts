import dayjs from 'dayjs';
import { CommonError } from '../types/error';

/**
 * 基础工具集
 */
export class BaseUtils {
  /**
   * 判断是否为通用异常
   * @param error 需要判断的异常
   */
  static isCommonError(error: unknown): error is CommonError {
    return error instanceof CommonError
  }

  /**
   * 获取错误信息
   * @param error
   */
  static getErrorMessage(error: unknown): string {
    return this.convertToCommonError(error).message
  }

  /**
   * 设置异常信息的前置提示
   * @param error 异常
   * @param preMsg  前置信息  `${preMsg}${error.message}`
   */
  static prependErrorMessage(error: CommonError, preMsg?: string): CommonError {
    if (preMsg) {
      error.message = `${preMsg}${error.message}`
    }
    return error
  }

  /**
   * 转换到通用异常
   * @param error 异常
   * @param preMsg  前置提示 `${preMsg}${error.message}`
   */
  static convertToCommonError(error: unknown, preMsg?: string): CommonError {
    if (this.isCommonError(error)) {
      return this.prependErrorMessage(error, preMsg)
    }
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    ) {
      const newError = error as { message: string }
      return this.prependErrorMessage(new CommonError(newError.message), preMsg)
    } else {
      // 如果抛出的异常不是object
      return this.prependErrorMessage(new CommonError(String(error)), preMsg)
    }
  }

  /**
   * 格式化时间为 2020-02-02 20:20:20 的字符串
   * @param date 需要格式化的时间，为空则获取当前时间
   */
  static getFormatedDateTime(date?: Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * 格式化时间为 2020-02-02 的字符串
   * @param date 需要格式化的时间，为空则获取当前时间
   */
  static getFormatedDate(date?: Date): string {
    return dayjs(date).format('YYYY-MM-DD')
  }

  /**
   * 格式化时间为 20:20:20 的字符串
   * @param date 需要格式化的时间，为空则获取当前时间
   */
  static getFormatedTime(date?: Date): string {
    return dayjs(date).format('HH:mm:ss')
  }
}
