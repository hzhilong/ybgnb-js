/**
 * 监听 DOM，在指定元素出现时执行回调。
 *
 * 特点：
 * - 目标元素已经存在时，立即执行
 * - 目标元素之后动态创建时，自动执行
 * - 只处理新插入的 DOM，避免每次 Mutation 都扫描整个页面
 * - 同一个 DOM 元素只回调一次
 *
 * @param selector CSS 选择器
 * @param callback 发现元素后的回调
 * @returns 停止监听的方法
 */
export function observeElement<EL extends Element = Element>(
  selector: string,
  callback: (element: EL) => void,
): () => void {
  const processed = new WeakSet<Element>()

  const process = (element: EL) => {
    if (processed.has(element)) {
      return
    }

    if (element.matches(selector)) {
      processed.add(element)
      callback(element)
    }

    for (const child of element.querySelectorAll<EL>(selector)) {
      if (processed.has(child)) {
        continue
      }

      processed.add(child)
      callback(child)
    }
  }

  // 处理已经存在的元素
  for (const element of document.querySelectorAll<EL>(selector)) {
    processed.add(element)
    callback(element)
  }

  // 监听之后动态插入的元素
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          process(node as EL)
        }
      }
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  return () => observer.disconnect()
}
