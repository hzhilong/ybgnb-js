import { createAbortError } from '../../../core/index.js'
import { exec } from 'node:child_process'
import * as iconv from 'iconv-lite'

/**
 * 命令执行的选项
 */
interface ExecOptions {
  /**
   * 判断结果码是否成功
   * @param number 结果码
   */
  codeIsSuccess?: (number: number) => boolean
  /**
   * 终止信号
   */
  signal?: AbortSignal
}

/**
 * 执行 windows 的命令
 * @param cmd     命令
 * @param options 执行选项
 */
export async function execWinCmd(cmd: string, options?: ExecOptions) {
  return new Promise<string>((resolve, reject) => {
    // 前置检查：如果 signal 已终止，直接拒绝
    if (options?.signal?.aborted) {
      throw createAbortError()
    }
    let abortHandler: (() => void) | null = null

    const child = exec(`${cmd}`, { encoding: 'buffer' }, (error, stdout, stderr) => {
      const stdoutStr = iconv.decode(stdout, 'cp936')
      const stderrStr = iconv.decode(stderr, 'cp936')

      // 清理 abort 监听
      if (abortHandler) {
        options?.signal?.removeEventListener('abort', abortHandler)
      }

      const exitCode = error ? Number((error as NodeJS.ErrnoException).code ?? 0) : 0
      if (options?.codeIsSuccess ? !options.codeIsSuccess(exitCode) : exitCode !== 0) {
        reject(new Error(`命令行执行出错 (${exitCode}): ${stderrStr || stdoutStr}`))
      } else {
        resolve(stdoutStr)
      }
    })
    // 进程取消后超时响应的处理定时器
    let timeout: ReturnType<typeof setTimeout>
    // 定义 abort 处理函数
    abortHandler = () => {
      // 请求终止，进程可拒绝或延迟
      child.kill('SIGTERM')
      timeout = setTimeout(() => {
        child.kill('SIGKILL')
      }, 3000)
      reject(createAbortError())
    }
    // 注册 abort 监听
    if (options?.signal) {
      options.signal.addEventListener('abort', abortHandler)
    }

    // 进程意外终止处理
    child.on('close', () => {
      if (timeout !== undefined) clearTimeout(timeout)
      options?.signal?.removeEventListener('abort', abortHandler)
    })
  })
}
