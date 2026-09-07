# @ybgnb/file-naming

按字段模板解析文件相对路径的 TypeScript 库。

把文件名拆成一组可组合的字段（内置字段或自定义 `resolve`），拼出相对路径；支持用 `/` 分段生成目录，并对每一级路径片段做非法字符清洗。适合批量导出、下载、归档时按规则生成文件名。

## 安装

```bash
npm install @ybgnb/file-naming
```

## 快速开始

```ts
import { FileNamer, type FileNamingFieldDefinition } from '@ybgnb/file-naming'

interface Photo {
  title: string
  ext: string
}

const titleField: FileNamingFieldDefinition<Photo> = {
  label: '标题',
  resolve: ({ data }) => data.title,
}

const extField: FileNamingFieldDefinition<Photo> = {
  label: '扩展名',
  resolve: ({ data }) => data.ext,
}

const namer = new FileNamer<Photo>({
  fields: ['serialNumber', '-', titleField, '.', extField],
})

const result = namer.resolve({ title: '日落', ext: 'jpg' })

result.fileName // "1-日落.jpg"
result.relativePath // "1-日落.jpg"
result.dir // ""
result.segments // ["1-日落.jpg"]
```

批量解析时，序号从 `1` 开始，`total` 为数组长度；单个对象解析时序号和总数均为 `1`。

```ts
const results = namer.resolve([
  { title: 'a', ext: 'jpg' },
  { title: 'b', ext: 'png' },
])

results[0].fileName // "1-a.jpg"（默认 zeroPad，总数为 1 位数时不补零）
results[1].fileName // "2-b.png"
```

带目录的模板：在字段列表中插入 `fileSeparator`，会按 `/` 拆成多级路径。

```ts
const albumField: FileNamingFieldDefinition<Photo & { album: string }> = {
  label: '相册',
  resolve: ({ data }) => data.album,
}

const pathNamer = new FileNamer<Photo & { album: string }>({
  fields: [albumField, 'fileSeparator', 'serialNumber', '-', titleField, '.', extField],
})

const path = pathNamer.resolve({ album: '旅行', title: '日落', ext: 'jpg' })

path.dir // "旅行"
path.fileName // "1-日落.jpg"
path.relativePath // "旅行/1-日落.jpg"
path.segments // ["旅行", "1-日落.jpg"]
```

## FileNamer

```ts
new FileNamer<TData>(options)
```

| 选项 | 说明 |
| --- | --- |
| `fields` | 必填。字段列表，元素为内置字段名，或自定义 `FileNamingFieldDefinition`。 |
| `extendedFormats` | 可选。日期、时间、序号格式，会写入解析上下文。 |
| `pathSegmentTransformer` | 可选。对每个路径片段做转换，默认使用 `defaultSanitizePathSegment`。 |

`resolve(data)` 接收单个数据或数组，返回 `ResolveFilePathResult` 或 `ResolveFilePathResult[]`。

| 字段 | 说明 |
| --- | --- |
| `relativePath` | 用 `/` 连接后的相对路径 |
| `segments` | 清洗后的路径片段（目录各级 + 文件名） |
| `dir` | 去掉最后一段后的目录；只有文件名时为空字符串 |
| `fileName` | 最后一段，即文件名 |

空片段会被丢弃。路径分隔使用 `/`，与运行平台无关。

## 内置字段

通过字符串引用 `baseFileNamingFieldMap` 中的键：

| 字段 | 结果 |
| --- | --- |
| `serialNumber` | 当前序号。`zeroPad` 时按 `total` 的位数前导补零；`natural` 时为自然数。 |
| `total` | 本次解析的总数 |
| `space` | 空格 |
| `fileSeparator` | `/`，用于拆分目录与文件名，本身不会出现在 `segments` 里 |

其余内置字段为字面字符，字段名就是字符本身：

`-` `_` `.` `,` `;` `（` `）` `(` `)` `[` `]` `{` `}` `+` `=` `~` `!` `@` `#` `$` `%` `^` `&` `“` `”` `：`

不在映射中的字符串字段会解析为空字符串。完整键列表见导出的 `allBaseFileNamingFields`。

## 自定义字段

```ts
interface FileNamingFieldDefinition<TData = unknown> {
  label: string
  resolve: (context: FileNamingContext<TData>) => string
}
```

`resolve` 收到的上下文：

| 字段 | 说明 |
| --- | --- |
| `data` | 当前这条数据 |
| `serialNumber` | 序号（从 1 开始） |
| `total` | 总数 |
| `resolveDate` | 本次解析时的 `Date` |
| `extendedFormats` | 构造时合并后的格式配置 |

可用 `createCharNamingField` / `createCharNamingFields` 快速生成字面字符字段。

## 扩展格式

未传入时的默认值：

```ts
{
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH-mm-ss',
  serialNumberFormat: 'zeroPad',
}
```

- `serialNumberFormat`：`zeroPad`（按总数位数补零）或 `natural`（不补零）。内置 `serialNumber` 字段会使用该配置。
- `dateFormat` / `timeFormat`：仅放入上下文，供自定义字段自行格式化日期时间。可选键见导出的 `dateFormatMap`、`timeFormatMap`。

可选日期格式：`YYYY-MM-DD`、`YYYY_MM_DD`、`YYYYMMDD`、`YY-MM-DD`、`YY_MM_DD`、`YYMMDD`。

可选时间格式：`HHmmss`、`HH-mm-ss`、`HH_mm_ss`、`HHmm`、`HH-mm`、`HH_mm`。

```ts
const namer = new FileNamer({
  fields: ['serialNumber'],
  extendedFormats: { serialNumberFormat: 'zeroPad' },
})

namer.resolve(['a', 'b', 'c'])[0].fileName // "1"（总数 3 为 1 位数）
```

总数为两位数时才会看到补零，例如 10 条数据中的第 1 条为 `"01"`。

## 路径片段清洗

默认 `defaultSanitizePathSegment` 会对每一级目录名和文件名：

- 去掉首尾空白
- 将 `<>:"/\|?*` 以及控制字符替换为 `_`
- 去掉末尾的 `.` 和空格
- 空结果丢弃
- Windows 保留名（如 `CON`、`PRN`、`NUL`、`COM1`–`COM9`、`LPT1`–`LPT9`）前加 `_`

可通过 `pathSegmentTransformer` 替换该行为：

```ts
const namer = new FileNamer({
  fields: ['serialNumber'],
  pathSegmentTransformer: (segment) => segment.toLowerCase(),
})
```

## License

[MIT](./LICENSE)
