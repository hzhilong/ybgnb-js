import type { NetworkInfo, NetworkState } from '../types/network.js'

function isConnection(obj: unknown): obj is NetworkInfo {
  return obj !== null && typeof obj === 'object' && 'downlink' in obj && 'rtt' in obj && 'effectiveType' in obj
}

/**
 * 获取网络信息
 */
export function getNetworkInfo(): NetworkState {
  if (!navigator.onLine) {
    return 'offline'
  }

  if ('connection' in navigator && isConnection(navigator.connection)) {
    // 现代 Web API 直接获取网络连接的信息
    const connection = navigator.connection
    return {
      downlink: connection.downlink,
      rtt: connection.rtt,
      effectiveType: connection.effectiveType,
    }
  } else {
    return 'online'
  }
}

/**
 * 监听网络状态变化
 * @param listener 监听器
 * @returns 成功监听时返回解绑函数
 */
export function onNetworkChange(listener: (info: NetworkState) => void) {
  const handleChange = () => {
    listener(getNetworkInfo())
  }

  if ('connection' in navigator && isConnection(navigator.connection)) {
    // 现代 Web API
    const connection = navigator.connection
    connection.addEventListener('change', handleChange)
    return () => connection.removeEventListener('change', handleChange)
  } else {
    window.addEventListener('online', handleChange)
    window.addEventListener('offline', handleChange)
    return () => {
      window.removeEventListener('online', handleChange)
      window.removeEventListener('offline', handleChange)
    }
  }
}
