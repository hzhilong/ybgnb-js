/**
 * 获取环境变量
 */
export function getEnv(): { [p: string]: string } {
  const env: { [p: string]: string } = {}
  for (const envKey in process.env) {
    env[envKey] = process.env[envKey] as string
  }
  return env
}
