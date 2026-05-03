/**
 * 滚动元素到屏幕中心
 * @param el
 */
export async function humanScrollElIntoCenter(el: HTMLElement) {
  if (!el) return

  const rect = el.getBoundingClientRect()
  const doc = document.documentElement
  const body = document.body

  const scrollX = window.scrollX || doc.scrollLeft || body.scrollLeft
  const scrollY = window.scrollY || doc.scrollTop || body.scrollTop

  const viewW = window.innerWidth
  const viewH = window.innerHeight

  // 目标中心点相对页面的位置
  const targetX = rect.left + scrollX + rect.width / 2 - viewW / 2
  const targetY = rect.top + scrollY + rect.height / 2 - viewH / 2

  const maxX = Math.max(0, body.scrollWidth - viewW)
  const maxY = Math.max(0, body.scrollHeight - viewH)

  // 页面不需要滚动
  if (maxX === 0 && maxY === 0) return

  // 水平滚动：仅在可滚动时
  const newX = maxX > 0 ? Math.min(Math.max(targetX, 0), maxX) : scrollX
  // 垂直滚动
  const newY = maxY > 0 ? Math.min(Math.max(targetY, 0), maxY) : scrollY

  // 判断是否真正需要滚动
  const needScrollX = Math.abs(window.scrollX - newX) > 1
  const needScrollY = Math.abs(window.scrollY - newY) > 1
  if (!needScrollX && !needScrollY) return

  await humanScrollTo(newX, newY)
}

/**
 * 等待滚动
 */
export function waitScrollTo(targetX: number, targetY: number): Promise<void> {
  return new Promise((resolve) => {
    const currentX = window.scrollX
    const currentY = window.scrollY

    // 若无需滚动
    if (Math.abs(currentX - targetX) < 1 && Math.abs(currentY - targetY) < 1) {
      resolve()
      return
    }

    let timer: number | undefined
    let finished = false

    const cleanup = () => {
      if (finished) return
      finished = true
      window.removeEventListener('scroll', handler)
      if (timer) clearTimeout(timer)
      resolve()
    }

    const handler = () => {
      if (timer) clearTimeout(timer)
      // 若 50ms 内无新滚动事件，则视为滚动结束
      timer = window.setTimeout(cleanup, 50)
    }

    // 启动兜底超时（比如滚动事件根本不触发）
    const failSafe = window.setTimeout(() => {
      console.debug('[waitScrollTo] fallback timeout reached')
      cleanup()
    }, 1000)

    const cleanupWithTimeout = () => {
      cleanup()
      clearTimeout(failSafe)
    }

    // 替换 cleanup，确保清理超时器
    const finalHandler = () => {
      if (timer) clearTimeout(timer)
      timer = window.setTimeout(cleanupWithTimeout, 50)
    }

    // 注册事件
    window.addEventListener('scroll', finalHandler, { passive: true })

    // 立即触发滚动
    window.scrollTo({ left: targetX, top: targetY })

    // 有时浏览器同步滚动，不触发 scroll 事件
    requestAnimationFrame(() => {
      const nowX = window.scrollX
      const nowY = window.scrollY
      if (Math.abs(nowX - targetX) < 1 && Math.abs(nowY - targetY) < 1) {
        cleanupWithTimeout()
      }
    })
  })
}

/**
 * 模拟人类手感滚动到指定位置
 */
export async function humanScrollTo(targetX: number, targetY: number): Promise<void> {
  return new Promise<void>((resolve) => {
    let currentX = window.scrollX
    let currentY = window.scrollY

    async function step() {
      const dx = targetX - currentX
      const dy = targetY - currentY

      // 如果距离足够小，直接跳到目标结束
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        window.scrollTo(targetX, targetY)
        resolve()
        return
      }

      // 随机步长 (最小 2px，最大剩余距离的 20%)
      const stepX = Math.sign(dx) * Math.min(Math.max(2, Math.random() * Math.abs(dx) * 0.2), Math.abs(dx))
      const stepY = Math.sign(dy) * Math.min(Math.max(2, Math.random() * Math.abs(dy) * 0.2), Math.abs(dy))

      currentX += stepX
      currentY += stepY
      await waitScrollTo(currentX, currentY)

      // 随机短暂停顿 10~30ms
      const delay = 10 + Math.random() * 20
      setTimeout(step, delay)
    }

    step()
  })
}
