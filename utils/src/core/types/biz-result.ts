export interface BizError {
  name: string
  message: string
  stack?: string
  cause?: BizError
}

export type BizResult<T = unknown> =
  | {
      success: true
      msg: string
      data?: T
    }
  | {
      success: false
      msg: string
      data?: T
      error?: BizError
    }
