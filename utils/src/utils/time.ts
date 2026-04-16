import dayjs from 'dayjs'

/**
 * 格式化时间为 2020-02-02 20:20:20 的字符串
 * @param date 需要格式化的时间，为空则获取当前时间
 */
export function getFormattedDateTime(date?: Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化时间为 2020-02-02 20:20:20 的字符串
 * @param date 需要格式化的时间，为空则获取当前时间
 */
export function getFormattedDate(date?: Date): string {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 格式化时间为 20:20:20 的字符串
 * @param date 需要格式化的时间，为空则获取当前时间
 */
export function getFormattedTime(date?: Date): string {
  return dayjs(date).format('HH:mm:ss')
}
