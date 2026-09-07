import type { FileNamingStrategy } from '../types/strategy.js'
import type { ExtendedFormats } from '../types/extended-format.js'
import type { ResolveFilePathResult } from '../types/result.js'
import type { FileNamingContext } from '../types/context.js'
import { baseFileNamingFieldMap } from '../types/field.js'
import { defaultSanitizePathSegment } from '../utils/path.js'
import type { PathSegmentTransformer } from '../types/path.js'

export class FileNamer<TData = unknown> {
  private strategy: FileNamingStrategy<TData>
  private pathSegmentTransformer: PathSegmentTransformer

  constructor(
    options: Omit<FileNamingStrategy<TData>, 'extendedFormats'> & {
      extendedFormats?: Partial<ExtendedFormats>
      pathSegmentTransformer?: PathSegmentTransformer
    },
  ) {
    const { dateFormat, timeFormat, serialNumberFormat } = options.extendedFormats ?? {}
    this.strategy = {
      fields: options.fields,
      extendedFormats: {
        dateFormat: dateFormat ?? 'YYYY-MM-DD',
        timeFormat: timeFormat ?? 'HH-mm-ss',
        serialNumberFormat: serialNumberFormat ?? 'zeroPad',
      },
    }
    this.pathSegmentTransformer = options.pathSegmentTransformer ?? defaultSanitizePathSegment
  }

  private buildPathSegments(fieldValues: string[]) {
    const segments: string[] = []

    let current = ''

    for (const field of fieldValues) {
      if (field === '/') {
        if (current) {
          segments.push(current)
          current = ''
        }
        continue
      }

      current += field
    }

    if (current) {
      segments.push(current)
    }

    return segments
  }

  private resolveOne(data: TData): ResolveFilePathResult {
    const context: FileNamingContext = {
      total: 1,
      serialNumber: 1,
      extendedFormats: this.strategy.extendedFormats,
      resolveDate: new Date(),
    }

    const fieldValues = this.strategy.fields.map((field) => {
      if (typeof field === 'string') {
        if (baseFileNamingFieldMap[field]) {
          return baseFileNamingFieldMap[field].resolve(context, data)
        }
        return ''
      } else {
        return field.resolve(context, data)
      }
    })

    const segments = this.buildPathSegments(fieldValues)

    const transformedSegments = segments.filter(Boolean).map(this.pathSegmentTransformer)

    return {
      segments: transformedSegments,
      relativePath: transformedSegments.join('/'),
    }
  }

  resolve(data: TData): ResolveFilePathResult
  resolve(data: TData[]): ResolveFilePathResult[]
  resolve(data: TData | TData[]): ResolveFilePathResult | ResolveFilePathResult[] {
    if (Array.isArray(data)) {
      return data.map((item) => this.resolveOne(item))
    }
    return this.resolveOne(data)
  }
}
