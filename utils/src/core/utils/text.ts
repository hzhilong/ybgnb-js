/**
 * 缩短文本。
 *
 * 当文本长度超过指定最大长度时，会截取文本内容并添加占位符。
 *
 * @param text 原始文本
 * @param maxLength 最大长度（包含占位符长度）
 * @param placeholder 超出长度后的占位符，默认为 "..."
 * @returns 截断后的文本
 *
 * @example
 * truncateText("这是一个很长的文本", 8)
 * // "这是一个..."
 */
export function shortenText(text: string, maxLength: number, placeholder: string = '...'): string {
  if (maxLength <= 0) return ''

  if (text.length <= maxLength) {
    return text
  }

  if (placeholder.length >= maxLength) {
    return placeholder.slice(0, maxLength)
  }

  return text.slice(0, maxLength - placeholder.length) + placeholder
}
