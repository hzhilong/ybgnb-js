/**
 * 为 Promise 添加超时控制
 * @param promise - 原始异步任务
 * @param timeout - 超时时间（毫秒）
 * @returns 若原 Promise 在超时前完成，则返回其结果；否则抛出超时错误
 * @throws {Error} 超时后抛出 'Timeout' 错误
 */
export async function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout'))
      }, timeout)
    }),
  ])
}

/**
 * 带重试机制的异步函数执行器
 * @param fn - 返回 Promise 的异步函数
 * @param retries - 最大重试次数（默认 3）
 * @param delay - 重试间隔毫秒（默认 1000）
 * @returns Promise<T>
 */
export async function withRetry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error('Unreachable')
}
