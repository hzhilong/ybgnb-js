/**
 * 日期格式映射（键：dayjs格式，值：示例）
 */
export const dateFormatMap = {
  'YYYY-MM-DD': '2026-07-02',
  YYYY_MM_DD: '2026_07_02',
  YYYYMMDD: '20260702',

  'YY-MM-DD': '26-07-02',
  YY_MM_DD: '26_07_02',
  YYMMDD: '260702',
} as const

/**
 * 日期格式
 */
export type DateFormat = keyof typeof dateFormatMap

/**
 * 时间格式映射（键：dayjs格式，值：示例）
 */
export const timeFormatMap = {
  HHmmss: '143045',
  'HH-mm-ss': '14-30-45',
  HH_mm_ss: '14_30_45',

  HHmm: '1430',
  'HH-mm': '14-30',
  HH_mm: '14_30',
} as const

/**
 * 时间格式
 */
export type TimeFormat = keyof typeof timeFormatMap

/**
 * 序号格式映射
 */
export const serialNumberFormatMap = {
  natural: '自然数',
  zeroPad: '前导零填充',
} as const

/**
 * 序号格式
 */
export type SerialNumberFormat = keyof typeof serialNumberFormatMap

/**
 * 扩展的格式
 */
export interface ExtendedFormats {
  dateFormat: DateFormat
  timeFormat: TimeFormat
  serialNumberFormat: SerialNumberFormat
}
