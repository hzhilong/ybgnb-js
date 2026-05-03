/**
 * 是否为空数组
 * @param data
 */
export function isEmptyArr(data: unknown) {
  return Array.isArray(data) && data.length === 0
}

/**
 * 将数组分块为指定大小的多个子数组
 * @param arr 原数组
 * @param size 每个块的长度
 * @example chunk([1,2,3,4,5], 2) => [[1,2],[3,4],[5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) throw new Error('size 必须是正整数')
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
