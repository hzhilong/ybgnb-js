// 可见性改变的监听器
export interface VisibilityChangeListener {
  (hidden: boolean): void;
}

/**
 * 监听页面可见性变化（兼容旧的IE/Chrome）
 * @param listener 监听器
 * @returns 成功监听时返回解绑函数
 */
export function onVisibilityChange(listener: VisibilityChangeListener) {
  let hiddenPropName: string | undefined = undefined,
    hiddenEventName: string | undefined = undefined;

  if (typeof document.hidden !== "undefined") {
    // 现代 Web API
    hiddenPropName = 'hidden';
    hiddenEventName = 'visibilitychange'
  } else if ('msHidden' in document && typeof document.msHidden !== "undefined") {
    // 旧 IE
    hiddenPropName = 'msHidden';
    hiddenEventName = 'msvisibilitychange'
  } else if ('webkitHidden' in document && typeof document.webkitHidden !== "undefined") {
    // 旧 Chrome
    hiddenPropName = 'webkitHidden';
    hiddenEventName = 'webkitvisibilitychange'
  }

  if (!hiddenPropName || !hiddenEventName) {
    return null;
  }

  const handler = () => {
    // @ts-ignore
    listener(document[hiddenPropName]);
  };

  document.addEventListener(hiddenEventName, handler);

  return () => {
    document.removeEventListener(hiddenEventName, handler);
  };
}

