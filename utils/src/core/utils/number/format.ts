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
