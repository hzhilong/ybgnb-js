/**
 * 设置 html 根元素的 css 变量
 */
export const setCssVar = (k: string, v: string) => {
  document.documentElement.style.setProperty(k, v)
}
