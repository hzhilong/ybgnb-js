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
  processor: (batch: number[]) => Promise<void>
): Promise<void> {
  for (let current = start; current <= end; current += batchSize) {
    const remaining = end - current + 1
    const actualSize = Math.min(batchSize, remaining)
    const batch = Array.from({ length: actualSize }, (_, idx) => current + idx)

    await processor(batch)
  }
}

