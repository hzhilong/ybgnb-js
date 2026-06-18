/**
 * 安装开发环境代理劫持。
 *
 * 作用：
 * - 将所有绝对 URL（http/https）重写为 `/proxy?url=...`（默认前缀）
 * - 统一走本地开发代理，绕过 CORS，并方便调试与拦截请求
 *
 * 当前覆盖：
 * - fetch
 * - XMLHttpRequest
 * - img.src
 * - script.src
 * - link.href（如 stylesheet / preload）
 * - source.src（如 video / audio / picture）
 * - iframe.src
 *
 * 说明：
 * - 仅重写绝对 URL（http:// / https://）
 * - 相对路径不会处理
 * - 仅建议在开发环境使用
 * - 内部带防重复安装保护，避免 HMR 导致重复 hook
 */
export function setupDevProxyHook(prefix: string = '/proxy?url=') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__DEV_PROXY_HOOKED__) return

  const rewrite = (url: string) => {
    if (/^http?:\/\//.test(url) || /^https?:\/\//.test(url)) {
      return `${prefix}${encodeURIComponent(url)}`
    }
    return url
  }

  const originFetch = window.fetch
  window.fetch = function (input, init) {
    if (input instanceof Request) {
      input = new Request(rewrite(input.url), input)
      return originFetch.call(this, input, init)
    }

    const url = rewrite(input.toString())
    return originFetch.call(this, url, init)
  }

  const originOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null | undefined,
    password?: string | null | undefined,
  ) {
    if (typeof url === 'string') {
      url = rewrite(url)
    } else {
      url = new URL(rewrite(url.href))
    }
    return originOpen.call(this, method, url, async ?? true, username, password)
  }

  /**
   * 通用属性 Hook
   *
   * 用于重写资源加载类元素的 src / href 属性
   */
  const hookUrlProperty = (proto: object, key: 'src' | 'href') => {
    const desc = Object.getOwnPropertyDescriptor(proto, key)
    if (!desc?.set) return

    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: desc.enumerable,
      get: desc.get,
      set(value: string) {
        return desc.set!.call(this, rewrite(value))
      },
    })
  }

  // 图片资源
  hookUrlProperty(HTMLImageElement.prototype, 'src')

  // 动态脚本资源
  hookUrlProperty(HTMLScriptElement.prototype, 'src')

  // 样式 / preload / prefetch
  hookUrlProperty(HTMLLinkElement.prototype, 'href')

  // video / audio / picture
  hookUrlProperty(HTMLSourceElement.prototype, 'src')

  // iframe 页面资源
  hookUrlProperty(HTMLIFrameElement.prototype, 'src')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__DEV_PROXY_HOOKED__ = true
}
