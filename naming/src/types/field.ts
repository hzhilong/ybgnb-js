import type { FileNamingContext } from './context.js'
import { createCharNamingFields } from '../utils/field.js'

/**
 * 文件命名字段定义
 */
export interface FileNamingFieldDefinition<TData = unknown> {
  label: string
  resolve: (context: FileNamingContext, data: TData) => string
}

/**
 * 文件命名字段映射
 */
export const baseFileNamingFieldMap = {
  serialNumber: {
    label: '序号',
    resolve: ({ total, serialNumber, extendedFormats }) => {
      if (extendedFormats.serialNumberFormat === 'natural') {
        return String(serialNumber)
      }
      return String(serialNumber).padStart(String(total).length, '0')
    },
  },
  total: {
    label: '总数',
    resolve: ({ total }) => String(total),
  },
  space: {
    label: '空格',
    resolve: () => ' ',
  },
  ...createCharNamingFields([
    '/',
    '-',
    '_',
    '.',
    ',',
    ';',
    '（',
    '）',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '+',
    '=',
    '~',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '“',
    '”',
    '：',
  ]),
} as const satisfies Record<string, FileNamingFieldDefinition>

/**
 * 基础文件命名字段
 */
export type BaseFileNamingField = keyof typeof baseFileNamingFieldMap

/**
 * 所有的基础文件命名字段
 */
export const allBaseFileNamingFields = Object.keys(baseFileNamingFieldMap) as BaseFileNamingField[]
