import { createAbortError } from './error.js'

/**
 * 支持取消的 sleep
 * @param ms      延迟毫秒数
 * @param signal  取消信号
 */
export function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(createAbortError())

    const timer = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timer)
      cleanup()
      reject(createAbortError())
    }

    const cleanup = () => {
      signal?.removeEventListener('abort', onAbort)
    }

    signal?.addEventListener('abort', onAbort)
  })
}

/**
 * 支持取消的随机 sleep
 * @param minMS   最小延迟毫秒数
 * @param maxMS   最大延迟毫秒数
 * @param signal  取消信号
 */
export function sleepRandom(minMS: number, maxMS: number, signal?: AbortSignal) {
  const ms = Math.random() * (maxMS - minMS) + minMS
  return sleep(ms, signal)
}
