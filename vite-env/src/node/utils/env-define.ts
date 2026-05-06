/**
 * 初始化全局定义的常量替换
 * @param env 环境变量
 * @param newEnv 自定义的环境变量
 * @returns 全局定义的常量替换
 */
export function initEnvDefine(env: Record<string, string>, newEnv: Record<string, string>) {
  const defineData: Record<string, string> = {}
  Object.keys(newEnv).forEach((key) => {
    env[key] = newEnv[key]
    defineData[`import.meta.env.${key}`] = JSON.stringify(newEnv[key])
  })
  return defineData
}
