# UllrAI SaaS Starter Kit

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ullrai/saas-starter)

这是一个免费、开源、生产就绪的全栈 SaaS 入门套件，旨在帮助您以前所未有的速度启动下一个项目。它集成了现代 Web 开发中备受推崇的工具和实践，为您提供了一个坚实的基础。

*(建议：请在此处替换为您的项目截图)*

## ✨ 功能特性

本入门套件提供了一系列强大的功能，可帮助您快速构建功能齐全的 SaaS 应用：

  * **身份验证 (Better-Auth + Resend):** 集成了 [Better-Auth](https://better-auth.com/)，提供安全的魔术链接登录和第三方 OAuth 功能。使用 [Resend](https://resend.com/) 提供可靠的邮件发送服务，还集成 Mailchecker 避免使用临时邮箱的恶意用户。
  * **现代 Web 框架 (Next.js 15 + TypeScript):** 基于最新的 [Next.js 15](https://nextjs.org/)，使用 App Router 和服务器组件。整个项目采用严格的 TypeScript 类型检查。
  * **数据库与 ORM (Drizzle + PostgreSQL):** 使用 [Drizzle ORM](https://orm.drizzle.team/) 进行类型安全的数据库操作，并与 PostgreSQL 深度集成。支持模式迁移、预编译语句和优化的查询构建。
  * **支付与订阅 (Creem):** 集成了 [Creem](https://creem.io/) 作为支付提供商，轻松处理订阅和一次性支付。
  * **UI 组件库 (shadcn/ui + Tailwind CSS):** 使用 [shadcn/ui](https://ui.shadcn.com/) 构建，它是一个基于 Radix UI 和 Tailwind CSS 的可访问、可组合的组件库，内置主题支持。
  * **表单处理 (Zod + React Hook Form):** 通过 [Zod](https://zod.dev/) 和 [React Hook Form](https://react-hook-form.com/) 实现强大的、类型安全的客户端和服务器端表单验证。

  * **代码质量:** 内置 ESLint 和 Prettier，确保代码风格统一和质量。

## 🛠️ 技术栈

| 分类       | 技术                                                                                                                                                   |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **框架**   | [Next.js](https://nextjs.org/) 15                                                                                                                      |
| **语言**   | [TypeScript](https://www.typescriptlang.org/)                                                                                                          |
| **UI**     | [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (图标) |
| **认证**   | [Better-Auth](https://better-auth.com/)                                                                                                                |
| **数据库** | [PostgreSQL](https://www.postgresql.org/)         |
| **ORM**    | [Drizzle ORM](https://orm.drizzle.team/)                                                                                                               |
| **支付**   | [Creem](https://creem.io/)                                                                                                             |
| **邮件**   | [Resend](https://resend.com/), [React Email](https://react.email/)                                                                                     |
| **表单**   | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                                                               |

| **部署**   | [Vercel](https://vercel.com/)                                                                                                                          |
| **包管理** | [pnpm](https://pnpm.io/)                                                                                                                               |

## 🚀 快速上手

### 1\. 环境准备

确保您的开发环境中已安装以下软件：

  * [Node.js](https://nodejs.org/en/) (推荐 v20.x 或更高版本)
  * [pnpm](https://pnpm.io/installation)

### 2\. 项目克隆与安装

```bash
# 克隆项目仓库
git clone https://github.com/ullrai/saas-starter.git

# 进入项目目录
cd saas-starter

# 使用 pnpm 安装依赖
pnpm install
```

### 3\. 环境配置

项目通过环境变量进行配置。首先，复制示例文件：

```bash
cp .env.example .env
```

然后，编辑 `.env` 文件，填入所有必需的值。

#### 环境变量说明

| 变量名                             | 描述                                                      | 示例                                                      |
| :--------------------------------- | :-------------------------------------------------------- | :-------------------------------------------------------- |
| `DATABASE_URL`         | **必需。** PostgreSQL 连接字符串。         | `postgresql://user:password@localhost:5432/db_name`       |
| `GITHUB_CLIENT_ID`                 | *可选。* 用于 GitHub OAuth 的 Client ID。                 | `your_github_client_id`                                   |
| `GITHUB_CLIENT_SECRET`             | *可选。* 用于 GitHub OAuth 的 Client Secret。             | `your_github_client_secret`                               |
| `BETTER_AUTH_SECRET`               | **必需。** 用于加密会话的密钥，必须是32个字符。           | `a_very_secure_random_32_char_string`                     |
| `RESEND_API_KEY`                   | **必需。** 用于发送魔术链接等邮件的 Resend API Key。      | `re_xxxxxxxxxxxxxxxx`                                     |
| `CREEM_API_KEY`                    | **必需。** Creem 的 API Key。                            | `your_creem_api_key`                                      |
| `CREEM_ENVIRONMENT`                | **必需。** Creem 环境模式。                              | `test_mode` 或 `live_mode`                               |
| `CREEM_WEBHOOK_SECRET`             | **必需。** Creem Webhook 密钥。                          | `whsec_your_webhook_secret`                              |
| `NEXT_PUBLIC_APP_URL`              | **必需。** 您应用部署后的公开 URL。                       | `http://localhost:3000` 或 `https://yourdomain.com`       |


> **提示:** 您可以使用以下命令生成一个安全的密钥：
> `openssl rand -base64 32`

### 4\. 数据库设置

本项目使用 Drizzle ORM 进行数据库迁移。根据不同环境，我们推荐使用不同的迁移策略：

#### 开发环境

对于本地开发和快速原型设计，推荐使用 `push` 命令直接同步模式变更：

```bash
# 启动本地 PostgreSQL 数据库
# 推送模式变更到开发数据库（快速原型设计）
pnpm db:push

# 或者使用传统的迁移方式
pnpm db:generate  # 生成迁移文件
pnpm db:migrate:dev  # 应用迁移到开发数据库
```

#### 生产环境

**重要：** 生产环境应该使用基于 SQL 迁移文件的方式，确保数据库变更的可追溯性和安全性：

```bash
# 1. 生成迁移文件（在开发环境中执行）
pnpm db:generate

# 2. 在生产环境中应用迁移
pnpm db:migrate:prod
```

> **安全提示：** 
> - 避免在本地环境直接连接生产数据库进行迁移操作
> - 生产环境迁移应该通过 CI/CD 流程自动化执行
> - 始终在应用迁移前备份生产数据库

### 5\. 启动开发服务器

```bash
pnpm dev
```

现在，您的应用应该已经在 [http://localhost:3000](http://localhost:3000) 上运行了！

## 📜 可用脚本

### 应用脚本

| 脚本                                             | 描述                                              |
| :----------------------------------------------- | :------------------------------------------------ |
| `pnpm dev`                                       | 使用 Turbopack 启动开发服务器。                   |
| `pnpm build`                                     | 为生产环境构建应用。                              |
| `pnpm start`                                     | 启动生产服务器。                                  |
| `pnpm lint`                                      | 检查代码中的 linting 错误。                       |
| `pnpm test`                                      | 运行单元测试并生成覆盖率报告。                    |
| `pnpm prettier:format`                           | 使用 Prettier 格式化所有代码。                    |

### 包体积分析脚本

| 脚本                                             | 描述                                              |
| :----------------------------------------------- | :------------------------------------------------ |
| `pnpm analyze`                                   | 构建应用并生成包体积分析报告。                    |
| `pnpm analyze:dev`                              | 启动开发服务器并启用包体积分析。                  |

### 数据库脚本

| 脚本                                             | 描述                                              | 环境     |
| :----------------------------------------------- | :------------------------------------------------ | :------- |
| `pnpm db:generate`                               | 基于模式变更生成 SQL 迁移文件。                   | 开发     |
| `pnpm db:push`                                   | 直接推送模式变更到数据库（快速原型设计）。        | 开发     |
| `pnpm db:migrate:dev`                            | 将迁移文件应用到开发数据库。                      | 开发     |
| `pnpm db:migrate:prod`                           | 将迁移文件应用到生产数据库。**推荐用于生产环境。** | 生产     |

## 📊 包体积监控与优化

本项目集成了 `@next/bundle-analyzer` 来帮助您分析和优化应用的包体积，确保最佳的加载性能。

### 生成包体积分析报告

#### 1. 分析生产构建

```bash
# 构建应用并生成包体积分析报告
pnpm analyze
```

构建完成后，会自动在浏览器中打开两个分析页面：
- **客户端包分析** - 显示发送到浏览器的 JavaScript 包
- **服务端包分析** - 显示服务器端渲染使用的包

#### 2. 开发环境分析

```bash
# 在开发模式下启用包体积分析
pnpm analyze:dev
```

### 包体积优化策略

#### 1. 识别大型依赖

使用分析报告识别占用空间最大的依赖包：
- 查看 "Parsed Size" 列，找出最大的包
- 检查是否有重复的依赖
- 识别未使用的代码

#### 2. 代码分割优化

```typescript
// 使用动态导入进行代码分割
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})

// 条件加载大型库
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js')
  return Chart
}
```

#### 3. 依赖优化建议

- **Tree Shaking**: 确保只导入需要的模块部分
  ```typescript
  // ✅ 好的做法
  import { debounce } from 'lodash/debounce'
  
  // ❌ 避免这样做
  import _ from 'lodash'
  ```

- **替换大型库**: 考虑使用更轻量的替代方案
  ```typescript
  // 考虑使用 date-fns 替代 moment.js
  // 考虑使用 zustand 替代 redux
  ```

- **外部化依赖**: 对于大型第三方库，考虑使用 CDN

#### 4. 图片和静态资源优化

- 使用 Next.js Image 组件进行自动优化
- 启用 WebP 格式
- 实施懒加载策略

### 性能监控最佳实践

#### 1. 定期分析

建议在以下情况下运行包体积分析：
- 添加新的依赖包后
- 重大功能更新前
- 性能优化周期中
- 生产部署前

#### 2. 设置性能预算

在 `next.config.ts` 中设置包体积限制：

```typescript
const nextConfig: NextConfig = {
  // 设置包体积警告阈值
  onDemandEntries: {
    // 页面在内存中保留的时间（毫秒）
    maxInactiveAge: 25 * 1000,
    // 同时保留的页面数
    pagesBufferLength: 2,
  },
  // 实验性功能：包体积分析
  experimental: {
    // 启用包体积分析
    bundlePagesRouterDependencies: true,
  },
}
```

#### 3. CI/CD 集成

在持续集成流程中添加包体积检查：

```yaml
# .github/workflows/bundle-analysis.yml
name: Bundle Analysis
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: pnpm install
      - name: Build and analyze
        run: ANALYZE=true pnpm build
        env:
          ANALYZE: true
```

### 常见问题排查

#### 包体积突然增大

1. **检查新增依赖**：
   ```bash
   # 查看依赖树
   pnpm list --depth=0
   
   # 分析特定包的大小
   npx bundlephobia <package-name>
   ```

2. **检查重复依赖**：
   ```bash
   # 查找重复的包
   pnpm list --depth=Infinity | grep -E "^[├└]" | sort | uniq -d
   ```

3. **检查未使用的代码**：
   - 使用 ESLint 的 `no-unused-vars` 规则
   - 定期清理未使用的组件和工具函数

#### 分析报告无法打开

- 确保端口 8888 和 8889 未被占用
- 检查防火墙设置
- 尝试手动打开 `.next/analyze/` 目录下的 HTML 文件

## 🗄️ 数据库迁移最佳实践

### 迁移策略对比

本项目支持两种主要的数据库迁移策略，适用于不同的使用场景：

#### 1. Push 策略（`db:push`）

**适用场景：** <mcreference link="https://orm.drizzle.team/docs/migrations" index="1">1</mcreference>
- 本地开发和快速原型设计
- 单人开发项目
- 不需要迁移历史记录的简单应用

**优点：**
- 快速同步模式变更
- 无需管理迁移文件
- 适合快速迭代

**缺点：**
- 缺乏迁移历史记录
- 不适合团队协作
- 无法回滚变更

#### 2. Migrate 策略（`db:migrate`）

**适用场景：** <mcreference link="https://orm.drizzle.team/docs/drizzle-kit-migrate" index="2">2</mcreference>
- 生产环境部署
- 团队协作开发
- 需要版本控制的数据库变更
- 复杂的数据库操作

**优点：**
- 完整的迁移历史记录
- 支持回滚操作
- 适合团队协作
- 可追溯的数据库变更

**缺点：**
- 需要管理迁移文件
- 相对复杂的工作流程

### 配置文件说明

项目包含 Drizzle 配置文件：

- **`database/config.ts`** - 开发环境配置，迁移文件输出到 `./database/migrations/development`
- **`database/config.prod.ts`** - 生产环境配置，迁移文件输出到 `./database/migrations/production`，包含 SSL 配置

### 团队协作工作流程

1. **开发阶段：**
   ```bash
   # 修改 schema 后生成迁移文件
   pnpm db:generate
   
   # 应用到本地数据库
   pnpm db:migrate:dev
   ```

2. **代码审查：**
   - 将生成的迁移文件提交到版本控制
   - 团队成员审查 SQL 迁移文件

3. **生产部署：**
   ```bash
   # 在 CI/CD 流程中自动执行
   pnpm db:migrate:prod
   ```

### 自定义迁移

对于 Drizzle Kit 暂不支持的 DDL 操作或数据种子，可以创建自定义迁移： <mcreference link="https://orm.drizzle.team/docs/kit-custom-migrations" index="4">4</mcreference>

```bash
# 生成空的自定义迁移文件
pnpm drizzle-kit generate --custom --name=seed-users
```

## ☁️ 部署

推荐使用 [Vercel](https://vercel.com) 进行部署，因为它与 Next.js 无缝集成。

1.  **推送至 Git 仓库:**
    将您的代码推送到 GitHub、GitLab 或 Bitbucket 仓库。

2.  **在 Vercel 中导入项目:**

      * 登录您的 Vercel 账户。
      * 点击 "Add New... \> Project"，然后选择您的 Git 仓库。
      * Vercel 会自动检测到这是-一个 Next.js 项目并配置好构建设置。

3.  **配置环境变量:**

      * 在 Vercel 项目的 "Settings" -\> "Environment Variables" 中，添加您在 `.env` 文件中定义的所有环境变量。**请勿将 `.env` 文件提交到 Git 仓库中**。

4.  **生产数据库迁移策略:**
    
    **推荐方式：使用 SQL 迁移文件**
    
    生产环境应该使用基于 SQL 迁移文件的方式，确保数据库变更的可追溯性和安全性：
    
    ```bash
    # 在 package.json 中添加生产迁移脚本
    "db:migrate:prod": "drizzle-kit migrate --config=database/config.ts"
    ```
    
    **CI/CD 集成示例（Vercel）：**
    
    在 `package.json` 中配置构建后脚本：
    ```json
    {
      "scripts": {
        "postbuild": "pnpm db:migrate:prod"
      }
    }
    ```
    
    **替代方案：** 对于简单的应用，也可以使用 `pnpm db:push`，但请注意这种方式缺乏迁移历史记录。
    
    **重要安全提示：** 
    - 避免在本地环境直接连接生产数据库进行迁移操作
    - 始终在应用迁移前备份生产数据库
    - 使用环境变量管理不同环境的数据库连接
    - 考虑使用数据库连接池和适当的超时设置

5.  **部署\!**
    完成上述步骤后，Vercel 会在您每次推送到主分支时自动部署您的应用。

## 📄 许可证

本项目采用 [MIT](https://github.com/ullrai/saas-starter/blob/main/LICENSE) 许可证。