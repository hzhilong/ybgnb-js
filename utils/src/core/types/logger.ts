export const LogLevelMap = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
} as const

export type LogLevel = keyof typeof LogLevelMap

export const logLevels = ['trace', 'debug', 'info', 'warn', 'error'] as LogLevel[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LogFn = (...data: any[]) => void

export type Logger<K extends LogLevel = LogLevel> = {
  [key in K]: LogFn
}
