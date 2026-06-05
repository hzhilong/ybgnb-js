/* eslint-disable @typescript-eslint/no-explicit-any */
import { type LogLevel, logLevels, type Logger, type LogFn, LogLevelMap } from '../types/logger.js'

const noop = () => {}
const ignoredProps = new Set(['then', 'catch', 'finally', 'toJSON', 'toString', 'valueOf'])

export function isLogLevel<K extends LogLevel = LogLevel>(level: string): level is K {
  return logLevels.indexOf(level as LogLevel) > -1
}

/**
 * 创建一个带级别过滤的 logger 代理。
 *
 * @template K - 支持的日志级别类型
 * @param getLogLevel - 获取当前配置级别的函数，仅在创建代理时执行
 * @param logWriter - 执行实际日志输出的函数（如 console.log）
 * @returns 返回一个可直接调用的 logger 实例
 */
export function createLogger<K extends LogLevel = LogLevel>(
  getLogLevel: K | (() => K | Promise<K>),
  logWriter: (logLevel: K, ...data: any[]) => void,
): Logger<K> {
  let cachedLevel: K = 'info' as K

  const syncConfig = async () => {
    try {
      const configLevel = (typeof getLogLevel === 'function' ? await getLogLevel() : getLogLevel).toLowerCase()
      if (isLogLevel<K>(configLevel)) {
        cachedLevel = configLevel
      } else {
        cachedLevel = 'info' as K
      }
    } catch {
      cachedLevel = 'info' as K
    }
  }

  syncConfig().then()

  return new Proxy(noop, {
    get(target, logLevel) {
      if (typeof logLevel !== 'string' || ignoredProps.has(logLevel)) return undefined
      if (!isLogLevel<K>(logLevel)) return undefined

      return new Proxy(noop, {
        apply(_target: () => void, _thisArg: any, args: any[]): void {
          if (!args) return

          if (LogLevelMap[logLevel] < LogLevelMap[cachedLevel]) {
            return
          }

          logWriter(logLevel, ...args)
        },
      }) as LogFn
    },
  }) as unknown as Logger<K>
}
