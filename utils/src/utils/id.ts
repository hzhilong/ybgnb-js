import { nanoid } from 'nanoid'

/**
 * 生成唯一 id
 */
export function generateId(): string {
  return nanoid()
}
