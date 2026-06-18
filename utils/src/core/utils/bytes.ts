/**
 * 合并多个 Uint8Array 为一个新的 Uint8Array。
 *
 * 会分配一个新的连续内存块，并按顺序复制所有数据。
 *
 * @param chunks 待合并的数据块
 * @returns 合并后的 Uint8Array
 */
export function concatUint8Arrays(chunks: readonly Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)

  const result = new Uint8Array(totalLength)

  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }

  return result
}
