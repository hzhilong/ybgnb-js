/**
 * 生成 CSS `color-mix()` 函数的字符串表示，用于动态计算两种颜色的混合结果
 *
 * @param {string} color1 - 参与混合的第一种颜色（支持 CSS 合法颜色值，如 HEX、RGB、HSL 等）
 * @param {string} color2 - 参与混合的第二种颜色
 * @param {number} percentage - 主颜色（color1）在混合中的占比（百分比数值，范围 0-100）
 * @param {'srgb' | 'hsl'} [colorSpace='srgb'] - 色彩空间选项：
 *   - `'srgb'`: 标准 RGB 色彩空间（默认）
 *   - `'hsl'`: 色相-饱和度-明度色彩空间
 * @param {number} [percentage2] - 可选参数：副颜色（color2）的独立占比。
 *   若未提供，则自动计算为 `100 - percentage`
 * @returns {string} 可直接用于 CSS 的 `color-mix()` 函数字符串（如 `color-mix(in srgb, red 30%, blue 70%)`）
 *
 * @example
 * // 基础用法（自动计算互补占比）
 * mixColor('red', 'blue', 30)
 * // 返回: "color-mix(in srgb, red 30%, blue 70%)"
 *
 * @example
 * // 显式指定双占比 + HSL 色彩空间
 * mixColor('#ff0000', '#0000ff', 40, 'hsl', 60)
 * // 返回: "color-mix(in hsl, #ff0000 40%, #0000ff 60%)"
 */
export const mixColor = (
  color1: string,
  color2: string,
  percentage: number,
  colorSpace: 'srgb' | 'hsl' = 'srgb',
  percentage2?: number,
): string => {
  return `color-mix(in ${colorSpace}, ${color1} ${percentage}%, ${color2} ${percentage2 ? percentage2 : 100 - percentage}%)`
}

/**
 * 将十六进制颜色转换为 RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
