# @ybgnb/vite-env

自用 Vite 环境变量初始化工具库。自动从 `package.json` 提取项目元信息并注入为 Vite 环境变量，提供完整的 TypeScript 类型支持，开箱即用。

## 功能特性

- **自动注入** — 从 `package.json` 自动提取项目名称、版本、作者、仓库等元信息，注入为 `import.meta.env.APP_*` 环境变量，无需手动维护
- **类型安全** — 提供 `AppEnv` 接口和 `ImportMetaEnv` 类型增强，IDE 智能提示所有自定义环境变量
- **分模式管理** — 通过 `env/` 目录统一管理 development / production / test 等不同环境的差异化配置
- **CLI 初始化** — 提供 `init` 命令，一键将类型声明文件注入用户项目
- **即插即用** — 在 `vite.config.ts` 中一行调用 `loadEnvConfig()` 即完成全部配置

## 安装

```bash
npm install @ybgnb/vite-env -D
```

## 快速开始

### 1. 初始化类型声明

```bash
npx @ybgnb/vite-env init
```

该命令会将 `env.d.ts` 类型声明文件拷贝到项目的 `src/vite-env.d.ts`，使 `import.meta.env` 获得完整的类型提示。

### 2. 配置 Vite

在 `vite.config.ts` 中调用 `loadEnvConfig()`：

```ts
import { defineConfig } from 'vite'
import { loadEnvConfig } from '@ybgnb/vite-env'

export default defineConfig(({ mode }) => ({
  ...loadEnvConfig({ mode }),
  // 其他 Vite 配置...
}))
```

### 3. 在前端代码中使用

```ts
import { appEnv } from '@ybgnb/vite-env/common'

console.log(appEnv.APP_PRODUCT_NAME)
console.log(appEnv.APP_VERSION)
```

或直接通过 `import.meta.env` 访问：

```ts
console.log(import.meta.env.APP_TITLE)
```

## 环境变量

所有自定义环境变量以 `APP_` 为前缀，自动从 `package.json` 提取：

| 变量名                | 说明       | 数据来源                                         |
| --------------------- | ---------- | ------------------------------------------------ |
| `APP_NPM_NAME`        | npm 包名   | `package.json` `name`                            |
| `APP_PRODUCT_NAME`    | 项目英文名 | `package.json` `productName`                     |
| `APP_PRODUCT_CN_NAME` | 项目中文名 | `package.json` `productCNName`                   |
| `APP_PRODUCT_URL`     | 项目网站   | `package.json` `homepage` / `repository`         |
| `APP_TITLE`           | 应用标题   | `productName` + `version`（非生产环境追加 mode） |
| `APP_DESCRIPTION`     | 应用描述   | `package.json` `description`                     |
| `APP_VERSION`         | 应用版本   | `package.json` `version`                         |
| `APP_AUTHOR`          | 应用作者   | `package.json` `author`                          |
| `APP_REPO_URL`        | 仓库地址   | `package.json` `repository`                      |
| `APP_LOG_LEVEL`       | 日志级别   | `.env.*` 文件手动配置                            |

同时包含 Vite 内置变量：`BASE_URL`、`MODE`、`PROD`、`DEV`。

## API

### `loadEnvConfig(configEnv, options?)`

Node 端核心函数，用于在 `vite.config.ts` 中加载环境变量配置。

**参数：**

| 参数                | 类型        | 说明                                 |
| ------------------- | ----------- | ------------------------------------ |
| `configEnv`         | `ConfigEnv` | Vite 传入的配置环境对象（含 `mode`） |
| `options.envPrefix` | `string`    | 环境变量前缀，默认 `'APP_'`          |
| `options.root`      | `string`    | 项目根目录，默认为 `process.cwd()`   |

**返回：** Vite `UserConfig` 对象，包含 `base`、`envDir`、`envPrefix`、`define` 配置。

### `appEnv`

客户端运行时环境变量对象，通过 `@ybgnb/vite-env/common` 导入，封装了所有 `import.meta.env` 上的标准字段，提供类型安全访问。

## 脚本命令

| 命令                  | 说明                      |
| --------------------- | ------------------------- |
| `npm run build`       | 使用 tsup 构建项目        |
| `npm run check`       | TypeScript 类型检查       |
| `npm run lint`        | ESLint 代码检查并自动修复 |
| `npm run format`      | Prettier 格式化           |
| `npm run npm publish` | 发布到 npm                |

## 技术栈

- **语言：** TypeScript
- **构建：** tsup (esbuild)
- **目标框架：** Vite
- **模块系统：** ESM

## 许可证

[MIT](LICENSE)
