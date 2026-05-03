/**
 * 格式化日期
 */
export function formatDate(date: Date, pattern: 'date' | 'time' | 'datetime'): string {
  const d = !isNaN(date.getTime()) ? date : new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  if (pattern === 'date') return `${year}-${month}-${day}`
  if (pattern === 'time') return `${hours}:${minutes}:${seconds}`
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化时间为 2020-02-02 20:20:20 的字符串
 * @param date 需要格式化的时间，为空则获取当前时间
 */
export function getFormattedDateTime(date?: Date): string {
  return formatDate(date ?? new Date(), 'datetime')
}

/**
 * 格式化时间为 2020-02-02 20:20:20 的字符串
 * @param date 需要格式化的时间，为空则获取当前时间
 */
export function getFormattedDate(date?: Date): string {
  return formatDate(date ?? new Date(), 'date')
}

/**
 * 格式化时间为 20:20:20 的字符串
 * @param date 需要格式化的时间，为空则获取当前时间
 */
export function getFormattedTime(date?: Date): string {
  return formatDate(date ?? new Date(), 'time')
}
