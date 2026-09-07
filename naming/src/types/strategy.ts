import type { ExtendedFormats } from './extended-format.js'
import type { FileNamingFieldDefinition, BaseFileNamingField } from './field.js'

/**
 * 文件命名策略
 */
export interface FileNamingStrategy<TData = unknown> {
  fields: (FileNamingFieldDefinition<TData> | BaseFileNamingField)[]
  extendedFormats: ExtendedFormats
}
