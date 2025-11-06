interface NetworkInformation extends EventTarget {
  // 带宽（估算）
  downlink: number;
  // 延迟（估算）
  rtt: number;
  // 类型（估算）
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
}

/**
 * 网络状态信息
 * - 'offline': 无网络
 * - 'online': 在线但不支持 NetworkInformation API
 * - NetworkInformation: 含详细网络信息
 */
export type NetworkInfo = 'offline' | Omit<NetworkInformation, keyof EventTarget> | 'online'

function isConnection(obj: any): obj is NetworkInformation {
  return obj && typeof obj === 'object' && 'downlink' in obj && 'rtt' in obj && 'effectiveType' in obj;
}

/**
 * 获取网络信息
 */
export function getNetworkInfo(): NetworkInfo {
  if (!navigator.onLine) {
    return 'offline'
  }

  if ('connection' in navigator && isConnection(navigator.connection)) {
    // 现代 Web API 直接获取网络连接的信息
    const connection = navigator.connection;
    return {
      downlink: connection.downlink,
      rtt: connection.rtt,
      effectiveType: connection.effectiveType
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
export function onNetworkChange(listener: (info: NetworkInfo) => void) {

  const handleChange = () => {
    listener(getNetworkInfo())
  }

  if ('connection' in navigator && isConnection(navigator.connection)) {
    // 现代 Web API
    let connection = navigator.connection;
    connection.addEventListener('change', handleChange)
    return () => connection.removeEventListener('change', handleChange);
  } else {

    window.addEventListener('online', handleChange)
    window.addEventListener('offline', handleChange)
    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);
    };
  }
}
