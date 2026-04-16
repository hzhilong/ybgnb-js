/**
 * 网络信息
 */
export interface NetworkInfo extends EventTarget {
  // 带宽（估算）
  downlink: number
  // 延迟（估算）
  rtt: number
  // 类型（估算）
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
}

/**
 * 网络状态
 * - 'offline': 无网络
 * - 'online': 在线但不支持 NetworkInformation API
 * - NetworkInformation: 含详细网络信息
 */
export type NetworkState = 'offline' | Omit<NetworkInfo, keyof EventTarget> | 'online'
