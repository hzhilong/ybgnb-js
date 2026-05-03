import { BizResult } from './biz-result.js'

/**
 * 执行业务（自动包裹BuResult）
 * @param run 执行方法
 */
export const execBiz = async <T>(run: () => Promise<T>): Promise<BizResult<T>> => {
  try {
    return BizResult.createSuccess<T>(await run())
  } catch (e) {
    return BizResult.createError(e)
  }
}
