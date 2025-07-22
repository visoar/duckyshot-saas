# 宠物AI形象生成及周边定制SaaS - 产品需求文档

## 产品开发状态说明

**⚠️ 当前状态：概念阶段**

- 本文档描述的是目标产品愿景
- 现有代码库为通用SaaS启动模板（ullrai-starter）
- 需要基于现有技术栈进行宠物AI功能开发

**技术基础架构（已实现）：**

- Next.js 15 + App Router
- PostgreSQL + Drizzle ORM
- Better-Auth 身份验证
- Creem 支付集成
- Cloudflare R2 文件存储
- Tailwind CSS + shadcn/ui

## 1. 产品概述

### 1.1 产品定位

一站式宠物数字形象创作与周边定制平台，通过AI技术将用户的宠物照片转化为各种艺术风格的数字形象，并支持将这些形象定制成实体商品。

### 1.2 核心价值

- **情感价值**：将宠物形象艺术化，创造独特纪念品
- **便捷性**：一站式完成从创作到商品定制的全流程
- **个性化**：多样化风格选择，满足不同审美需求

## 2. 功能架构

```
宠物AI SaaS
├── 用户系统
│   ├── 注册/登录
│   ├── 个人中心
│   └── 账户设置
├── AI创作中心
│   ├── 图片上传
│   ├── 风格选择
│   ├── AI生成
│   └── 作品管理
├── 商品定制
│   ├── 商品选择
│   ├── 定制编辑器
│   ├── 效果预览
│   └── 购物车
├── 订单系统
│   ├── 订单创建
│   ├── 支付
│   ├── 订单管理
│   └── 物流追踪
└── 探索发现
    ├── 风格展示
    ├── 商品展示
    └── 灵感画廊
```

## 3. 详细功能需求

### 3.1 用户系统

#### 3.1.1 注册/登录（✅ 已实现）

- **注册方式**：
  - 邮箱 + Magic Link（使用 Better-Auth + Resend）
  - 第三方登录（Google、LinkedIn - 已配置）

#### 3.1.2 个人中心（🔄 部分实现）

- **基础设置**：账户信息、外观主题、通知设置（✅ 已实现）
- **计费管理**：订阅状态、支付历史（✅ 已实现）
- **我的作品**：展示所有AI生成的作品，支持筛选、排序（❌ 待开发）
- **我的订单**：订单列表及状态追踪（❌ 待开发）
- **收藏夹**：收藏的风格和商品（❌ 待开发）
- **地址管理**：收货地址的增删改查（❌ 待开发）

### 3.2 AI创作中心（❌ 待开发）

#### 3.2.1 创作流程

```
上传照片 → 选择风格 → 确认生成 → 等待处理 → 查看结果 → 保存/重新生成
```

#### 3.2.2 图片上传（🔄 基础功能已实现）

**现有技术基础：**

- Cloudflare R2 存储集成（✅ 已实现）
- 预签名URL上传（✅ 已实现）
- 文件验证和大小限制（✅ 已实现）
- 图片压缩功能（✅ 已实现）

**宠物AI特定需求：**

- **支持格式**：JPG、PNG、WEBP
- **文件大小**：最大20MB
- **推荐要求**：
  - 宠物萌照或搞怪照片
  - 主人与宠物合照
- **上传数量**：1张

#### 3.2.3 风格选择

可后台管理

- **风格类别**：
  - 经典艺术：油画、水彩、素描、版画
  - 现代风格：卡通、动漫、波普艺术、极简主义
  - 特色风格：赛博朋克、像素艺术、梵高风格、宫崎骏风格
  - 季节限定：圣诞风、万圣节风等
- **展示方式**：
  - 风格预览图（使用示例宠物）
  - 风格描述
  - 热度标签

#### 3.2.4 生成配置

- **生成数量**：默认2张，可选1-4张
- **生成模式**：
  - 快速生成（优先速度）
  - 高质量生成（优先效果）
- **费用计算**：生成成功实时扣减

#### 3.2.5 生成过程

- **等待界面**：
  - 进度条显示（分阶段：上传中、处理中、生成中）
  - 预计剩余时间
  - 有趣的等待动画（宠物相关）
  - 随机展示宠物小知识
- **超时处理**：
  - 超过60秒提示"正在精心创作中"
  - 超过120秒提供取消选项

#### 3.2.6 结果展示

- **展示方式**：
  - 大图预览
  - 缩略图切换
  - 原图对比开关
- **操作选项**：
  - 下载高清图（水印/无水印）
  - 保存到作品集
  - 直接定制商品
  - 重新生成
  - 分享功能

### 3.3 商品定制

#### 3.3.1 商品品类

可后台管理

- **服饰类**：T恤、卫衣、帽子
- **生活用品**：马克杯、抱枕、毛毯
- **数码周边**：手机壳、鼠标垫、笔记本贴
- **装饰品**：相框画、帆布包、钥匙扣
- **文具类**：笔记本、明信片、贴纸

#### 3.3.2 定制流程

```
选择商品 → 选择/上传图案 → 调整位置大小 → 添加文字(可选) → 预览确认 → 加入购物车
```

#### 3.3.3 定制编辑器

使用供应商提供版本，嵌入

- **图案操作**：
  - 位置拖拽
  - 大小缩放
  - 旋转角度
  - 图案居中/对齐辅助线
- **文字功能**（评估后建议支持）：
  - 添加宠物名字
  - 预设文字模板（如"My Best Friend"）
  - 字体选择（5-8种）
  - 颜色选择
- **商品配置**：
  - 尺码选择（服饰类）
  - 颜色选择
  - 材质选择（如有）

#### 3.3.4 预览功能

- **多角度预览**：正面、背面、侧面（如适用）
- **场景预览**：展示实际使用场景
- **细节放大**：查看印刷细节

### 3.4 订单系统（🔄 基础支付功能已实现）

**现有技术基础：**

- Creem 支付集成（✅ 已实现）
- 订阅和支付记录表（✅ 已实现）
- Webhook 事件处理（✅ 已实现）

#### 3.4.1 购物车（❌ 待开发）

- **功能特性**：
  - 商品数量调整
  - 批量删除
  - 价格实时计算
  - 优惠码输入
  - 运费计算

#### 3.4.2 结算流程（🔄 基础功能已实现）

- **信息确认**：
  - 收货地址（❌ 待开发）
  - 商品清单（❌ 待开发）
  - 价格明细（❌ 待开发）
- **支付方式**：
  - Creem（✅ 已实现）

#### 3.4.3 订单管理（❌ 待开发）

**需要扩展数据库表结构：**

- 实体商品订单表
- 订单商品详情表
- 物流信息表

- **订单状态**：
  - 待支付 → 制作中 → 已发货 → 已完成
- **订单详情**：
  - 商品信息
  - 物流信息
  - 发票下载

### 3.5 探索发现

#### 3.5.1 风格展厅

- **展示内容**：
  - 各风格效果示例
  - 风格介绍
  - 用户作品展示（需授权）
- **互动功能**：
  - 收藏风格
  - 查看使用量排行

#### 3.5.2 商品目录

- **展示方式**：
  - 商品分类浏览
  - 商品详情页
  - 定制示例展示
  - 价格区间筛选

## 4. 商业模式设计

### 4.1 收费策略（基于现有Creem集成）

**现有技术基础：**

- 多产品定价体系（✅ 已实现）
- 一次性、月付、年付支持（✅ 已实现）
- 需要调整为宠物AI产品定价

可以先按方案 2 实现？成本 cover 不住再切换方案 1

#### 方案一：混合收费模式（推荐）

- **基础使用**：
  - 注册赠送3次免费生成机会
  - 每月1次免费生成额度
- **AI生成收费**：
  - 单次购买：$0.99/次（生成2张）
  - 套餐包：
    - 10次：$7.99（省20%）
    - 30次：$19.99（省33%）
    - 月度会员：$9.99/月（30次额度）
- **商品定制**：按实际商品成本+合理利润定价

#### 方案二：商品驱动模式

- **AI生成**：完全免费（每日限制5次）
- **盈利来源**：商品销售利润
- **会员权益**：$4.99/月
  - 无限生成次数
  - 商品9折优惠
  - 专属风格

### 4.2 定价参考

- T恤：$19.99 - $24.99
- 马克杯：$12.99 - $15.99
- 手机壳：$14.99 - $19.99
- 相框画：$29.99 - $49.99

## 5. 页面组织结构

### 5.1 信息架构

```
首页
├── Hero区：核心价值展示
├── 功能介绍：3步完成定制
├── 风格展示：热门风格轮播
├── 商品展示：热销商品
└── 用户评价：社交证明

创作工坊（需登录）
├── 新建作品
├── 我的作品
├── 创作历史
└── 风格收藏

商品中心
├── 全部商品
├── 分类浏览
├── 定制编辑器
└── 设计灵感

个人中心
├── 账户信息
├── 作品管理
├── 订单管理
├── 地址管理
└── 账户余额
```

### 5.2 核心页面流程图

#### 5.2.1 主要用户流程

```
首页 → 立即体验 → 上传照片 → 选择风格 → AI生成 → 查看结果
                                               ↓
                                          选择商品
                                               ↓
                                          定制编辑
                                               ↓
                                          加入购物车
                                               ↓
                                          结算支付
                                               ↓
                                          订单完成
```

#### 5.2.2 作品管理流程

```
个人中心 → 我的作品 → 作品列表（网格/列表视图）
                     ↓
                选择作品
                     ↓
         ┌──────────┼──────────┐
         ↓          ↓          ↓
     查看详情   定制商品    删除作品
         ↓          ↓
     下载/分享   进入定制流程
```

## 6. 用户体验优化要点

### 6.1 降低用户门槛

- **免注册体验**：允许用户先体验AI生成，结果保存时才要求注册
- **智能引导**：首次使用时的新手引导
- **示例体验**：提供示例宠物照片快速体验

### 6.2 提升等待体验

- **分步反馈**：明确展示当前处理阶段
- **趣味互动**：等待时展示宠物趣味知识、其他用户作品
- **预期管理**：诚实告知可能的等待时间

### 6.3 创作体验优化

- **批量操作**：支持多张图片同时生成不同风格
- **历史记录**：保存用户的风格偏好
- **快速重试**：一键使用相同配置重新生成

### 6.4 定制体验优化

- **实时预览**：所见即所得的编辑体验
- **智能推荐**：基于图片风格推荐合适商品
- **保存草稿**：定制方案自动保存

### 6.5 移动端适配（✅ 已实现）

- **响应式设计**：完美适配各种屏幕尺寸（基于Tailwind CSS）
- **触控优化**：便捷的手势操作
- **简化流程**：移动端精简操作步骤

## 7. 技术实现路线图

### 基础功能扩展（部分库表示例）

**数据库扩展：**

```sql
-- AI作品表
CREATE TABLE ai_artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id),
  original_image_key TEXT NOT NULL,
  style_id TEXT NOT NULL,
  generated_images JSONB NOT NULL, -- 存储生成的图片信息
  generation_params JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 商品定制订单表
CREATE TABLE product_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id),
  artwork_id UUID REFERENCES ai_artworks(id),
  product_type TEXT NOT NULL,
  customization_data JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 风格配置表
CREATE TABLE ai_styles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  is_active BOOLEAN DEFAULT true,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API集成需求：**

- AI图像生成服务（推荐 Fal.ai ）
  About
  FLUX.1 Kontext [pro] -- Frontier image editing model.

Kontext makes editing images easy! Specify what you want to change and Kontext will follow. It is capable of understanding the context of the image, making it easier to edit them without having to describe in details what you want to do.

1. Calling the API

#

Install the client

#

The client provides a convenient way to interact with the model API.

npmyarnpnpmbun

npm install --save @fal-ai/client
Migrate to @fal-ai/client
The @fal-ai/serverless-client package has been deprecated in favor of @fal-ai/client. Please check the migration guide for more information.

Setup your API Key

#

Set FAL_KEY as an environment variable in your runtime.

export FAL_KEY="YOUR_API_KEY"
Submit a request

#

The client API handles the API submit protocol. It will handle the request status updates and return the result when the request is completed.

import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
input: {
prompt: "Put a donut next to the flour.",
image_url: "https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png"
},
logs: true,
onQueueUpdate: (update) => {
if (update.status === "IN_PROGRESS") {
update.logs.map((log) => log.message).forEach(console.log);
}
},
});
console.log(result.data);
console.log(result.requestId); 2. Authentication

#

The API uses an API Key for authentication. It is recommended you set the FAL_KEY environment variable in your runtime when possible.

API Key

#

In case your app is running in an environment where you cannot set environment variables, you can set the API Key manually as a client configuration.

import { fal } from "@fal-ai/client";

fal.config({
credentials: "YOUR_FAL_KEY"
});
Protect your API Key
When running code on the client-side (e.g. in a browser, mobile app or GUI applications), make sure to not expose your FAL_KEY. Instead, use a server-side proxy to make requests to the API. For more information, check out our server-side integration guide.

3. Queue

#

Long-running requests
For long-running requests, such as training jobs or models with slower inference times, it is recommended to check the Queue status and rely on Webhooks instead of blocking while waiting for the result.

Submit a request

#

The client API provides a convenient way to submit requests to the model.

import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/flux-pro/kontext", {
input: {
prompt: "Put a donut next to the flour.",
image_url: "https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png"
},
webhookUrl: "https://optional.webhook.url/for/results",
});
Fetch request status

#

You can fetch the status of a request to check if it is completed or still in progress.

import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/flux-pro/kontext", {
requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
logs: true,
});
Get the result

#

Once the request is completed, you can fetch the result. See the Output Schema for the expected result format.

import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/flux-pro/kontext", {
requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
console.log(result.data);
console.log(result.requestId); 4. Files

#

Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

Data URI (base64)

#

You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

Hosted files (URL)

#

You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

Uploading files

#

We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.

import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
Auto uploads
The client will auto-upload the file for you if you pass a binary object (e.g. File, Data).

Read more about file handling in our file upload guide.

5. Schema

#

Input

#

prompt string
The prompt to generate an image from.

seed integer
The same seed and the same prompt given to the same version of the model will output the same image every time.

guidance_scale float
The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 3.5

sync_mode boolean
If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.

num_images integer
The number of images to generate. Default value: 1

output_format OutputFormatEnum
The format of the generated image. Default value: "jpeg"

Possible enum values: jpeg, png

safety_tolerance SafetyToleranceEnum
The safety tolerance level for the generated image. 1 being the most strict and 5 being the most permissive. Default value: "2"

Possible enum values: 1, 2, 3, 4, 5, 6

Note: This property is only available through API calls.

aspect_ratio AspectRatioEnum
The aspect ratio of the generated image.

Possible enum values: 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21

image_url string
Image prompt for the omni model.

{
"prompt": "Put a donut next to the flour.",
"guidance_scale": 3.5,
"num_images": 1,
"output_format": "jpeg",
"safety_tolerance": "2",
"image_url": "https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png"
}
Output

#

images list<fal**toolkit**image**image**Image>
The generated image files info.

timings Timings
seed integer
Seed of the generated Image. It will be the same value of the one passed in the input or the randomly generated that was used in case none was passed.

has_nsfw_concepts list<boolean>
Whether the generated images contain NSFW concepts.

prompt string
The prompt used for generating the image.

{
"images": [
{
"height": 1024,
"url": "https://fal.media/files/tiger/7dSJbIU_Ni-0Zp9eaLsvR_fe56916811d84ac69c6ffc0d32dca151.jpg",
"width": 1024
}
],
"prompt": ""
}
Other types

#

registry**image**fast_sdxl**models**Image

#

url string
width integer
height integer
content_type string
Default value: "image/jpeg"

FluxProRedux

#

prompt string
The prompt to generate an image from. Default value: ""

image_size ImageSize | Enum
The size of the generated image. Default value: landscape_4_3

Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9

Note: For custom image sizes, you can pass the width and height as an object:

"image_size": {
"width": 1280,
"height": 720
}
num_inference_steps integer
The number of inference steps to perform. Default value: 28

seed integer
The same seed and the same prompt given to the same version of the model will output the same image every time.

guidance_scale float
The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 3.5

sync_mode boolean
If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.

num_images integer
The number of images to generate. Default value: 1

output_format OutputFormatEnum
The format of the generated image. Default value: "jpeg"

Possible enum values: jpeg, png

safety_tolerance SafetyToleranceEnum
The safety tolerance level for the generated image. 1 being the most strict and 5 being the most permissive. Default value: "2"

Possible enum values: 1, 2, 3, 4, 5, 6

Note: This property is only available through API calls.

image_url string
The image URL to generate an image from. Needs to match the dimensions of the mask.

FluxProV1Redux

#

prompt string
The prompt to generate an image from. Default value: ""

image_size ImageSize | Enum
The size of the generated image. Default value: landscape_4_3

Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9

Note: For custom image sizes, you can pass the width and height as an object:

"image_size": {
"width": 1280,
"height": 720
}
num_inference_steps integer
The number of inference steps to perform. Default value: 28

seed integer
The same seed and the same prompt given to the same version of the model will output the same image every time.

guidance_scale float
The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 3.5

sync_mode boolean
If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.

num_images integer
The number of images to generate. Default value: 1

output_format OutputFormatEnum
The format of the generated image. Default value: "jpeg"

Possible enum values: jpeg, png

safety_tolerance SafetyToleranceEnum
The safety tolerance level for the generated image. 1 being the most strict and 5 being the most permissive. Default value: "2"

Possible enum values: 1, 2, 3, 4, 5, 6

Note: This property is only available through API calls.

image_url string
The image URL to generate an image from. Needs to match the dimensions of the mask.

fal**toolkit**image**image**Image

#

url string
The URL where the file can be downloaded from.

content_type string
The mime type of the file.

file_name string
The name of the file. It will be auto-generated if not provided.

file_size integer
The size of the file in bytes.

file_data string
File data

width integer
The width of the image in pixels.

height integer
The height of the image in pixels.

FluxProUltraTextToImageInputRedux

#

prompt string
The prompt to generate an image from. Default value: ""

seed integer
The same seed and the same prompt given to the same version of the model will output the same image every time.

sync_mode boolean
If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.

num_images integer
The number of images to generate. Default value: 1

enable_safety_checker boolean
If set to true, the safety checker will be enabled. Default value: true

output_format OutputFormatEnum
The format of the generated image. Default value: "jpeg"

Possible enum values: jpeg, png

safety_tolerance SafetyToleranceEnum
The safety tolerance level for the generated image. 1 being the most strict and 5 being the most permissive. Default value: "2"

Possible enum values: 1, 2, 3, 4, 5, 6

Note: This property is only available through API calls.

aspect_ratio Enum | string
The aspect ratio of the generated image. Default value: 16:9

Possible enum values: 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21

raw boolean
Generate less processed, more natural-looking images.

image_url string
The image URL to generate an image from. Needs to match the dimensions of the mask.

image_prompt_strength float
The strength of the image prompt, between 0 and 1. Default value: 0.1

ImageSize

#

width integer
The width of the generated image. Default value: 512

height integer
The height of the generated image. Default value: 512

FluxProTextToImageInputWithAR

#

prompt string
The prompt to generate an image from.

seed integer
The same seed and the same prompt given to the same version of the model will output the same image every time.

guidance_scale float
The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 3.5

sync_mode boolean
If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.

num_images integer
The number of images to generate. Default value: 1

output_format OutputFormatEnum
The format of the generated image. Default value: "jpeg"

Possible enum values: jpeg, png

safety_tolerance SafetyToleranceEnum
The safety tolerance level for the generated image. 1 being the most strict and 5 being the most permissive. Default value: "2"

Possible enum values: 1, 2, 3, 4, 5, 6

Note: This property is only available through API calls.

aspect_ratio AspectRatioEnum
The aspect ratio of the generated image. Default value: "1:1"

Possible enum values: 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21

- 商品生产服务（暂时仅记录至数据库，手工处理，后续可对接 Printful、Gooten 等）
