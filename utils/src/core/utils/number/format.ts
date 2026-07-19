/**
 * 格式化后的单位数据（如文件大小）
 */
export interface FormattedUnitSize {
  /** 换算后该单位的数值（未四舍五入） */
  size: number
  /** 单位名称，如 'MB' */
  unit: string
  /** 显示文本：数值四舍五入保留两位小数 + 单位，如 '1.50 MB' */
  text: string
}

/**
 * 按进制自动格式化单位
 * @param value 数值
 * @param base 进制（1024 / 1000）
 * @param units 单位列表
 * @param invalidText 无效值返回文本
 */
export function formatUnitSize(value: number, base: number, units: string[], invalidText = ''): FormattedUnitSize {
  if (!Number.isFinite(value)) {
    return { size: 0, unit: '', text: invalidText }
  }

  let size = value
  let unitIndex = 0

  while (size >= base && unitIndex < units.length - 1) {
    size /= base
    unitIndex++
  }

  return {
    size,
    unit: units[unitIndex],
    text: `${size.toFixed(2).replace(/\.?0+$/, '')} ${units[unitIndex]}`,
  }
}

/**
 * 将 KB 文件大小格式化为字符串
 * @param sizeKB 文件大小（单位：KB）
 * @param invalidText 输入无效时返回文本
 */
export function formatFileSizeFromKB(sizeKB: number, invalidText: string = '') {
  const { size, unit, text } = formatUnitSize(sizeKB, 1024, ['KB', 'MB', 'GB'], invalidText)

  if (text === invalidText) {
    return invalidText
  }

  // 整数部分
  const integerPart = Math.floor(size)

  // 根据整数位数动态控制小数位
  let fractionDigits: number
  // 整数位 >= 3：不保留小数
  if (integerPart > 99) fractionDigits = 0
  // 整数位 = 2：保留 1 位小数
  else if (integerPart > 9) fractionDigits = 1
  // 整数位 = 1：保留 2 位小数
  else fractionDigits = 2

  const rounded = Math.round(size * 10 ** fractionDigits) / 10 ** fractionDigits
  return `${rounded} ${unit}`
}
