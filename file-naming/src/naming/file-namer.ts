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

  private resolveOne(
    data: TData,
    { serialNumber, total }: { serialNumber: number; total: number } = { serialNumber: 1, total: 1 },
  ): ResolveFilePathResult {
    const context: FileNamingContext<TData> = {
      total: total,
      serialNumber: serialNumber,
      extendedFormats: this.strategy.extendedFormats,
      resolveDate: new Date(),
      data: data,
    }

    const fieldValues = this.strategy.fields.map((field) => {
      if (typeof field === 'string') {
        if (baseFileNamingFieldMap[field]) {
          return baseFileNamingFieldMap[field].resolve(context)
        }
        return ''
      } else {
        return field.resolve(context)
      }
    })

    const segments = this.buildPathSegments(fieldValues)

    const transformedSegments = segments.filter(Boolean).map(this.pathSegmentTransformer).filter(Boolean)

    return {
      segments: transformedSegments,
      relativePath: transformedSegments.join('/'),
      fileName: transformedSegments[transformedSegments.length - 1],
      dir: transformedSegments.length > 1 ? transformedSegments.slice(0, -1).join('/') : '',
    }
  }

  resolve(data: TData): ResolveFilePathResult
  resolve(data: TData[]): ResolveFilePathResult[]
  resolve(data: TData | TData[]): ResolveFilePathResult | ResolveFilePathResult[] {
    if (Array.isArray(data)) {
      return data.map((item, index) =>
        this.resolveOne(item, {
          total: data.length,
          serialNumber: index + 1,
        }),
      )
    }
    return this.resolveOne(data)
  }
}
