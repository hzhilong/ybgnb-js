/**
 * 将任意文本转换为安全的文件名（去除非法字符、控制字符，截断长度）
 * @param text - 原始文本（若为空则返回空字符串）
 * @param maxLength - 最大允许长度（默认 255）
 * @param replacement - 替换非法字符的字符串（默认 ''，即直接移除）
 * @returns 安全的文件名
 */
export function toSafeFilename(text?: string, maxLength = 255, replacement = ''): string {
  if (!text) return ''

  // Windows 文件名非法字符（含反斜杠、正斜杠、通配符等）
  const illegalChars = /[<>:"/\\|?*]/g
  // 控制字符（ASCII 0-31 及 127）
  const controlChars = /[\x00-\x1f\x7f]/g

  let safe = text
    .replace(illegalChars, replacement)
    .replace(controlChars, replacement)
    .trim()
    .replace(/[. ]+$/, '') // 移除末尾的点或空格（Windows 不允许）

  // 如果替换后为空，返回默认名称
  if (!safe) safe = 'unnamed'

  return safe.slice(0, maxLength)
}

/**
 * 构建文件路径：拼接多个片段，过滤空值，并规范化斜杠
 * @param parts - 路径片段（可为 undefined 或空字符串）
 * @returns 规范化的路径字符串（如 'a/b/c'）
 */
export function buildFilePath(...parts: (string | undefined)[]): string {
  return parts
    .filter((p): p is string => !!p) // 过滤掉 undefined 和空字符串
    .join('/')
    .replace(/\/+/g, '/') // 合并连续斜杠
}

/**
 * 获取不包含扩展名的文件名。
 *
 * @param fileName 文件名或文件路径
 * @returns 不包含扩展名的文件名
 *
 * @example
 * getFileNameWithoutExtension("test.mp4") // "test"
 * getFileNameWithoutExtension("/video/test.mp4") // "test"
 * getFileNameWithoutExtension("test") // "test"
 */
export function getFileNameWithoutExtension(fileName: string): string {
  const name = getFileName(fileName)
  const index = name.lastIndexOf('.')

  // 没有扩展名，或者文件名以 . 开头（例如 .gitignore）
  if (index <= 0) {
    return name
  }

  return name.slice(0, index)
}

/**
 * 获取文件扩展名。
 *
 * 返回的扩展名不包含 "."。
 *
 * @param fileName 文件名或文件路径
 * @returns 文件扩展名，没有扩展名时返回空字符串
 *
 * @example
 * getFileExtension("test.mp4") // "mp4"
 * getFileExtension("test") // ""
 * getFileExtension("archive.tar.gz") // "gz"
 */
export function getFileExtension(fileName: string): string {
  const name = getFileName(fileName)
  const index = name.lastIndexOf('.')

  // 没有扩展名，或者文件名以 . 开头（例如 .gitignore）
  if (index <= 0 || index === name.length - 1) {
    return ''
  }

  return name.slice(index + 1)
}

/**
 * 解析文件名。
 *
 * 将文件名拆分为不包含扩展名的名称和扩展名。
 *
 * @param fileName 文件名或文件路径
 * @returns 文件名解析结果
 *
 * @example
 * parseFileName("test.mp4")
 * // {
 * //   name: "test",
 * //   extension: "mp4"
 * // }
 */
export function parseFileName(fileName: string): {
  name: string
  extension: string
} {
  return {
    name: getFileNameWithoutExtension(fileName),
    extension: getFileExtension(fileName),
  }
}

/**
 * 获取路径中的文件名部分。
 *
 * 兼容 Web 环境中的 Unix 路径和 Windows 路径。
 *
 * @param filePath 文件路径
 * @returns 文件名
 */
export function getFileName(filePath: string): string {
  const index = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'))

  return filePath.slice(index + 1)
}
