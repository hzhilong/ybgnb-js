const INVALID_CHAR_REGEX = /[<>:"/\\|?*\u0000-\u001F]/g

const WINDOWS_RESERVED_NAMES = new Set([
  'CON',
  'PRN',
  'AUX',
  'NUL',
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'LPT1',
  'LPT2',
  'LPT3',
  'LPT4',
  'LPT5',
  'LPT6',
  'LPT7',
  'LPT8',
  'LPT9',
])

export function defaultSanitizePathSegment(segment: string): string {
  let result = segment.trim()

  // 非法字符
  result = result.replace(INVALID_CHAR_REGEX, '_')

  // Windows 不允许结尾为空格或 .
  result = result.replace(/[. ]+$/, '')

  // 空字符串
  if (result.length === 0) {
    return ''
  }

  // Windows 保留名
  if (WINDOWS_RESERVED_NAMES.has(result.toUpperCase())) {
    result = `_${result}`
  }

  return result
}
