/**
 * 等待 <img> 加载完成
 */
export function whenImageLoaded(img: HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (img.dataset['state'] === 'loading') {
      img.src = img.dataset['src']!
    }

    if (img.complete && img.naturalWidth > 0) {
      resolve(img)
      return
    }

    const onLoad = () => {
      cleanup()
      resolve(img)
    }

    const onError = () => {
      cleanup()
      reject(new Error(`图片加载失败: ${img.src}`))
    }

    const cleanup = () => {
      img.removeEventListener('load', onLoad)
      img.removeEventListener('error', onError)
    }

    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)
  })
}

/**
 * 从 <img> 元素获取图片字节数据（ArrayBuffer）
 * @param img 已加载的 <img> 元素
 * @param type 图片类型，可选（默认 png）
 */
export async function getImageArrayBuffer(img: HTMLImageElement, type: string = 'image/png'): Promise<ArrayBuffer> {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建 Canvas 2D 上下文')
  ctx.drawImage(img, 0, 0)

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob 失败'))), type)
  })

  return await blob.arrayBuffer()
}

/**
 * 等待加载完成并获取字节数据
 */
export async function getImgArrayBufferAfterLoad(img: HTMLImageElement, type?: string): Promise<ArrayBuffer> {
  const loaded = await whenImageLoaded(img)
  return await getImageArrayBuffer(loaded, type)
}
