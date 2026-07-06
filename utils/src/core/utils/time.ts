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
 * 格式化时间为 2020-02-02 的字符串
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

/**
 * 格式化时间戳。可自动判断 10/13 位时间戳
 * @param timestamp
 */
export function formatTime(timestamp: number | string | Date | undefined): string {
  if (typeof timestamp === 'undefined') return ''
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString()
  } else {
    const num = typeof timestamp === 'string' ? Number(timestamp) : timestamp
    if (isNaN(num)) return ''

    return new Date(num < 1e12 ? num * 1000 : num).toLocaleString()
  }
}

/**
 * 获取文件名时间戳，例如 2026-06-19_14-30-25
 * @param date
 */
export function formatFileTimestamp(date?: Date): string {
  if (!date) {
    date = new Date()
  }
  const d = !isNaN(date.getTime()) ? date : new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}_${minutes}_${seconds}`
}

/**
 * 获取文件名时间戳，例如 2026-06-19
 * @param date
 */
export function formatFileDate(date?: Date): string {
  if (!date) {
    date = new Date()
  }
  const d = !isNaN(date.getTime()) ? date : new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 将秒数格式化为 MM:SS 或 HH:MM:SS
 * @example formatDuration(125) // "02:05"
 * @example formatDuration(3665) // "01:01:05"
 */
export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  const parts = [hours, minutes, seconds]
  const startIndex = hours > 0 ? 0 : 1

  return parts
    .slice(startIndex)
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
}
