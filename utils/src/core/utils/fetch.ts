/**
 * 用于指定 `fetch` 响应体的解析方式。
 * 对应 `Response` 对象的不同解析方法（`.json()`、`.text()` 等）。
 */
export type ResponseBodyFormat =
  | 'json' // 解析为 JSON 对象
  | 'text' // 解析为原始字符串
  | 'blob' // 解析为 Blob 对象（适用于二进制文件，如图片、压缩包）
  | 'arrayBuffer' // 解析为 ArrayBuffer（适用于底层二进制操作）
  | 'formData' // 解析为 FormData 对象（适用于处理 multipart/form-data 响应）

/**
 * 创建响应错误
 */
export function createResponseError(response: Response) {
  return new Error(`HTTP ${response.status}: ${response.statusText}`)
}

/**
 * 使用指定的响应解析格式发起 fetch 请求
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchWithFormat<T = any>(
  url: string,
  format: ResponseBodyFormat,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw createResponseError(response)
  }
  switch (format) {
    case 'json':
      return (await response.json()) as T
    case 'text':
      return (await response.text()) as T
    case 'blob':
      return (await response.blob()) as T
    case 'arrayBuffer':
      return (await response.arrayBuffer()) as T
    case 'formData':
      return (await response.formData()) as T
    default:
      return (await response.text()) as T
  }
}
