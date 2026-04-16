/**
 * 数组洗牌
 */
export function shuffle<T>(arr: T[]): T[] {
  const clone = arr.slice();
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

/**
 * 获取 [min, max] 的随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取 [min, max) 的随机浮点数
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * 从数组中随机取若干项，不可重复
 */
export function sample<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

/**
 * 从数组中随机取若干项，可重复
 */
export function sampleWithReplacement<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const index = randomInt(0, arr.length - 1);
    result.push(arr[index]);
  }
  return result;
}

/**
 * 从数组中获取随机项
 */
export function sampleOne<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * 获取 1~n 的随机数
 */
export function random1ToN(n: number): number {
  return randomInt(1, n);
}
