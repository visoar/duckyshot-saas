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
  * **文件上传 (Cloudflare R2):** 基于 Cloudflare R2 的安全文件上传系统，支持多种文件类型和大小限制，内置图片压缩功能。

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
| `R2_ACCOUNT_ID`                    | *可选。* Cloudflare 账户 ID。                           | `your_cloudflare_account_id`                             |
| `R2_ACCESS_KEY_ID`                 | *可选。* R2 访问密钥 ID。                               | `your_r2_access_key_id`                                  |
| `R2_SECRET_ACCESS_KEY`             | *可选。* R2 秘密访问密钥。                              | `your_r2_secret_access_key`                              |
| `R2_BUCKET_NAME`                   | *可选。* R2 存储桶名称。                                | `your_r2_bucket_name`                                    |
| `R2_PUBLIC_URL`                    | *可选。* R2 存储桶的公共访问 URL。                       | `https://your-bucket.your-account.r2.cloudflarestorage.com` |


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

## 📁 文件上传功能

本项目集成了基于 Cloudflare R2 的安全文件上传系统，支持客户端直传和服务端上传两种方式。

### 配置 Cloudflare R2

1. **创建 R2 存储桶**：
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 导航到 R2 Object Storage
   - 创建新的存储桶

2. **获取 API 令牌**：
   - 在 Cloudflare Dashboard 中，转到 "My Profile" > "API Tokens"
   - 创建自定义令牌，权限包括 "Object Storage:Edit"

3. **配置环境变量**：
   ```bash
   R2_ACCOUNT_ID="your_cloudflare_account_id"
   R2_ACCESS_KEY_ID="your_r2_access_key_id"
   R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
   R2_BUCKET_NAME="your_r2_bucket_name"
   R2_PUBLIC_URL="https://your-bucket.your-account.r2.cloudflarestorage.com"
   ```

### 使用 FileUploader 组件

#### 基本用法

```tsx
import { FileUploader } from '@/components/ui/file-uploader'

function MyComponent() {
  const handleUploadComplete = (files) => {
    console.log('上传完成:', files)
    // 处理上传完成的文件
  }

  return (
    <FileUploader
      acceptedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}
      maxFileSize={5 * 1024 * 1024} // 5MB
      maxFiles={3}
      onUploadComplete={handleUploadComplete}
    />
  )
}
```

#### 组件属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `acceptedFileTypes` | `string[]` | `['image/*']` | 允许的文件 MIME 类型 |
| `maxFileSize` | `number` | `10MB` | 最大文件大小（字节） |
| `maxFiles` | `number` | `1` | 允许上传的文件数量 |
| `onUploadComplete` | `function` | - | 上传完成回调函数 |
| `className` | `string` | - | 自定义 CSS 类名 |

#### 高级用法示例

```tsx
// 图片上传组件
<FileUploader
  acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
  maxFileSize={2 * 1024 * 1024} // 2MB
  maxFiles={5}
  onUploadComplete={(files) => {
    // 更新用户头像或图片库
    setImages(prev => [...prev, ...files])
  }}
  className="border-dashed border-2 border-blue-300"
/>

// 文档上传组件
<FileUploader
  acceptedFileTypes={['application/pdf', 'application/msword', 'text/plain']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  maxFiles={1}
  onUploadComplete={(files) => {
    // 处理文档上传
    setDocument(files[0])
  }}
/>
```

### 服务端上传 API

#### 从 URL 上传文件

```typescript
import { uploadFromUrl } from '@/lib/r2'

const result = await uploadFromUrl(
  'https://example.com/image.jpg',
  'uploads/user-123/profile.jpg'
)

if (result.success) {
  console.log('文件 URL:', result.url)
}
```

#### 从 Buffer 上传文件

```typescript
import { uploadBuffer } from '@/lib/r2'

const buffer = Buffer.from(fileData)
const result = await uploadBuffer(
  buffer,
  'uploads/user-123/document.pdf',
  'application/pdf'
)

if (result.success) {
  console.log('文件 URL:', result.url)
}
```

### 文件管理

#### 删除文件

```typescript
import { deleteFile } from '@/lib/r2'

const success = await deleteFile('uploads/user-123/old-file.jpg')
if (success) {
  console.log('文件删除成功')
}
```

#### 生成下载链接

```typescript
import { getDownloadUrl } from '@/lib/r2'

const downloadUrl = await getDownloadUrl(
  'uploads/user-123/document.pdf',
  3600 // 1小时有效期
)
console.log('下载链接:', downloadUrl)
```

### 数据库集成

上传的文件信息会自动保存到 `uploads` 表中：

```sql
SELECT * FROM uploads WHERE "userId" = 'user-123' ORDER BY "createdAt" DESC;
```

### 安全考虑

- 所有上传请求都需要用户认证
- 文件类型和大小在服务端进行二次验证
- 预签名 URL 具有时效性（默认 1 小时）
- 支持自定义文件类型和大小限制

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

## 📁 文件上传组件使用指南

### 基本用法

文件上传组件 `FileUploader` 提供了完整的文件上传功能，支持拖拽上传、进度显示和错误处理。

```tsx
import { FileUploader } from '@/components/ui/file-uploader';

function MyComponent() {
  const handleUploadComplete = (files) => {
    console.log('上传完成:', files);
  };

  return (
    <FileUploader
      maxFiles={3}
      maxFileSize={10 * 1024 * 1024} // 10MB
      acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
      onUploadComplete={handleUploadComplete}
      enableImageCompression={true}
      imageCompressionQuality={0.8}
    />
  );
}
```

### 配置选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `maxFiles` | `number` | `1` | 最大文件数量 |
| `maxFileSize` | `number` | `10MB` | 最大文件大小（字节） |
| `acceptedFileTypes` | `string[]` | - | 允许的文件类型 |
| `onUploadComplete` | `function` | - | 上传完成回调 |
| `enableImageCompression` | `boolean` | `false` | 启用图片压缩 |
| `imageCompressionQuality` | `number` | `0.8` | 压缩质量 (0.1-1.0) |
| `imageCompressionMaxWidth` | `number` | `1920` | 压缩后最大宽度 |
| `imageCompressionMaxHeight` | `number` | `1080` | 压缩后最大高度 |
| `disabled` | `boolean` | `false` | 禁用组件 |

### 图片压缩功能

组件内置了图片压缩功能，可以在上传前自动压缩图片文件：

```tsx
<FileUploader
  enableImageCompression={true}
  imageCompressionQuality={0.7}  // 压缩质量
  imageCompressionMaxWidth={1200} // 最大宽度
  imageCompressionMaxHeight={800}  // 最大高度
/>
```

### Cloudflare R2 CORS 配置

为了确保文件上传正常工作，需要在 Cloudflare R2 存储桶中配置 CORS 策略：

1. **登录 Cloudflare 控制台**
2. **进入 R2 Object Storage**
3. **选择您的存储桶**
4. **点击 Settings 标签**
5. **在 CORS policy 部分添加以下配置：**

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### 环境变量配置

确保在 `.env` 文件中配置了以下 R2 相关的环境变量：

```env
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
```

### 故障排除

如果遇到上传问题，请参考 [文件上传故障排除指南](./docs/file-upload-troubleshooting.md)，其中包含了常见问题的解决方案。

常见问题：
- **"Failed to fetch" 错误**：通常是 CORS 配置问题
- **"Invalid request data" 错误**：检查文件属性和验证逻辑
- **网络连接问题**：组件会自动进行网络连接测试

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