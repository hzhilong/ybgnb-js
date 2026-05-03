/** URL query 中必须编码的保留字符 (RFC 3986) */
export const invalidCharRegex = /[!'()*]/g

/** 查询参数 */
export type QueryParams = Record<string, string | number | boolean | null | undefined>

/**
 * 已解析的 url
 */
export interface ParsedUrl {
  baseUrl: string
  searchParams: URLSearchParams
}

/**
 * 判断字符串是否为有效的 HTTP/HTTPS URL
 * @param path - 待检测的字符串
 */
export function isHttpUrl(path: string) {
  try {
    const url = new URL(path)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 解析 url
 * @param url
 */
export function parseUrl(url: string): ParsedUrl {
  try {
    const { origin, pathname, searchParams } = new URL(url)
    return {
      baseUrl: origin + pathname,
      searchParams,
    }
  } catch {
    throw new Error('Invalid URL')
  }
}

/**
 * 编码 URL 参数
 * @param params          查询参数
 * @param keepEmptyValues 保留 null/undefined的值（空字符串）
 */
export function encodeURLParams(params: QueryParams, keepEmptyValues: boolean = false) {
  return (
    Object.keys(params)
      // 排序
      .sort()
      // 过滤
      .filter((key) => {
        return keepEmptyValues || params[key] != null
      })
      // 编码 key 和 value
      .map((key) => {
        const raw = params[key] ?? ''
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(raw))}`
      })
      // 拼接
      .join('&')
  )
}

/**
 *
 */
/**
 * 合并查询参数
 * @param urlSearchParams url解析后查询参数
 * @param params          单独传的查询参数
 */
export function mergeQueryParams(urlSearchParams: URLSearchParams, params?: QueryParams): QueryParams {
  let mergedParams: QueryParams = {}
  if (urlSearchParams.size > 0) {
    // 合并url里的查询参数
    urlSearchParams.forEach((value, key) => {
      mergedParams[key] = value
    })
  }
  // 处理单独传的查询参数对象
  if (params) {
    mergedParams = { ...mergedParams, ...params }
  }
  return mergedParams
}
