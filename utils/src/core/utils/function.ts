/**
 * 随机运行参数
 * @param fns
 * @param maxCount 最多执行次数（1 ~ fns.length）
 */
export function runRandomFunctions(fns: Array<() => void>, maxCount?: number): void {
  maxCount = maxCount ?? fns.length
  const count = Math.floor(Math.random() * maxCount) + 1

  const shuffled = [...fns]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const selected = shuffled.slice(0, count)

  for (const fn of selected) {
    fn()
  }
}

/**
 * 将数字范围按批次处理，每个批次调用一次异步函数
 *
 * @param start - 起始值（包含）
 * @param end   - 结束值（包含）
 * @param batchSize - 每批最大元素个数
 * @param processor - 处理单批数字数组的异步函数
 *
 * @example
 * // 分批处理 1..10，每批最多 3 个数字
 * await processRangeInBatches(1, 10, 3, async (batch) => {
 *   console.log(batch) // 输出: [1,2,3], [4,5,6], [7,8,9], [10]
 * })
 */
export async function processRangeInBatches(
  start: number,
  end: number,
  batchSize: number,
  processor: (batch: number[]) => Promise<void>,
): Promise<void> {
  for (let current = start; current <= end; current += batchSize) {
    const remaining = end - current + 1
    const actualSize = Math.min(batchSize, remaining)
    const batch = Array.from({ length: actualSize }, (_, idx) => current + idx)

    await processor(batch)
  }
}

/**
 * 动态调用
 * @param root  对象
 * @param path  调用路径
 * @param args  参数
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function dynamicCall<T = any>(root: any, path: string, ...args: any[]): T {
  const segments = path.split('.')
  let context = root
  let i = 0
  for (; i < segments.length - 1; i++) {
    context = context[segments[i]]
    if (context == null) {
      throw new Error(`Path '${segments.slice(0, i + 1).join('.')}' is null/undefined`)
    }
  }
  const fn = context[segments[i]]
  if (typeof fn !== 'function') {
    throw new Error(`'${path}' is not a function`)
  }
  return fn.apply(context, args)
}

/**
 * 为任务添加执行生命周期钩子。
 *
 * 支持在任务执行前、成功后以及结束后插入额外逻辑，
 * 可用于日志记录、状态切换、加载提示等场景。
 *
 * 执行顺序：
 * before -> task -> success -> finally
 *
 * 注意：
 * - success 仅在任务执行成功时触发
 * - finally 无论成功或失败都会触发
 *
 * @param task 要执行的任务（函数或 Promise）
 * @param hooks 生命周期钩子
 * @returns 包装后的异步任务函数
 */
export function withHooks<TArgs extends any[] = [], TReturn = void>(
  task: ((...args: TArgs) => TReturn | Promise<TReturn>) | Promise<TReturn>,
  hooks?: {
    before?: () => void | Promise<void>
    success?: () => void | Promise<void>
    finally?: () => void | Promise<void>
  },
) {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      await hooks?.before?.()

      const result = typeof task === 'function' ? await task(...args) : await task

      await hooks?.success?.()

      return result
    } finally {
      await hooks?.finally?.()
    }
  }
}
