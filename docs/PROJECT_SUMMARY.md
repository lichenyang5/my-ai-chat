# Node.js AI 学习项目 - 完整开发文档

> 📅 创建时间：2026-02-02
> 📝 本文档记录了从零开始搭建 Node.js AI 应用的完整过程

---

## 📋 目录

1. [项目概述](#项目概述)
2. [开发历程](#开发历程)
3. [技术架构](#技术架构)
4. [项目结构](#项目结构)
5. [环境配置详解](#环境配置详解)
6. [已实现的功能](#已实现的功能)
7. [运行与测试](#运行与测试)
8. [问题与解决方案](#问题与解决方案)
9. [下一步计划](#下一步计划)

---

## 🎯 项目概述

### 项目定位

这是一个**从零开始学习 AI 应用开发**的实践项目，通过循序渐进的示例来掌握 AI 工程的核心概念和实战技能。

### 学习目标

- 理解如何调用 AI API（Anthropic Claude）
- 掌握流式响应、系统提示词等核心概念
- 学习 AI Agent、Function Calling、RAG 等高级技术
- 积累 AI 应用开发的实战经验

### 技术选型

- **运行环境**：Node.js 18+
- **包管理器**：pnpm 10.16.1
- **AI 服务**：Anthropic Claude API
- **开发语言**：TypeScript
- **执行工具**：tsx（用于直接运行 TS 文件）

---

## 🚀 开发历程

### 第一步：项目初始化（✅ 已完成）

```bash
# 初始化 package.json
pnpm init

# 安装核心依赖
pnpm add -D @anthropic-ai/sdk @types/node dotenv https-proxy-agent tsx
```

**关键决策**：

- 使用 `type: "module"` 启用 ES Modules（现代 Node.js 标准）
- 选择 `tsx` 而不是 `ts-node`，因为它更快且支持 ESM
- 添加 `https-proxy-agent` 用于网络代理配置

### 第二步：配置项目基础（✅ 已完成）

创建了以下配置文件：

#### 1. `tsconfig.json` - TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2022", // 使用现代 JS 特性
    "module": "ESNext", // 使用最新的模块系统
    "moduleResolution": "bundler", // 适配现代打包工具
    "esModuleInterop": true, // 兼容 CommonJS 模块
    "strict": true, // 开启严格类型检查
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["examples/**/*", "projects/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2. `.gitignore` - 版本控制忽略文件

```
node_modules/
dist/
.env           # 保护 API Key 不被提交
.DS_Store
*.log
```

#### 3. `.env.example` - 环境变量模板

```bash
ANTHROPIC_API_KEY="你的token"
# 或者使用 OpenAI
# OPENAI_API_KEY=your_openai_api_key_here
```

### 第三步：网络配置（✅ 核心问题解决）

**遇到的问题**：
访问 Anthropic API 时遇到 `403 Cloudflare` 错误，因为 API 在国内被拦截。

**解决方案探索过程**：

#### 方案 1：尝试使用代理（遇到困难）

最初尝试通过设置 HTTP_PROXY 环境变量：

```typescript
// 在代码中配置代理
const httpAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  httpAgent: httpAgent as any,
});
```

**遇到的坑**：

- Anthropic SDK 的代理配置方式需要特定写法
- 环境变量设置时机要在进程启动前
- 代理端口需要根据工具（Clash/V2Ray）确认

#### 方案 2：使用中转服务（✅ 最终采用）

发现可以使用国内可访问的中转服务：

```typescript
const baseURL = "https://api.aicodemirror.com/api/claudecode";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: baseURL, // 使用中转服务
});
```

**优势**：

- ✅ 不需要代理工具
- ✅ 国内直接访问
- ✅ 配置简单
- ✅ 稳定可靠

#### 两种方案的对比配置

在 `package.json` 中提供了两种运行方式：

```json
{
  "scripts": {
    // 直接运行（使用中转服务）
    "example:01": "tsx examples/01-simple-chat/index.ts",
    "example:02": "tsx examples/02-streaming-chat/index.ts",
    "example:03": "tsx examples/03-system-prompt/index.ts",

    // 使用代理运行（如果访问官方 API）
    "proxy:01": "HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 pnpm example:01",
    "proxy:02": "HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 pnpm example:02",
    "proxy:03": "HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 pnpm example:03"
  }
}
```

### 第四步：实现核心示例（✅ 已完成）

#### 示例 01：简单对话（01-simple-chat）

**学习目标**：理解 AI API 的基本调用方式

**核心代码**：

```typescript
const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "你好！请用一句话介绍什么是大语言模型。",
    },
  ],
});

console.log(response.content[0].text);
```

**学到的概念**：

- ✅ API Key 认证
- ✅ Model 选择
- ✅ Messages 结构（role + content）
- ✅ Response 响应解析

#### 示例 02：流式响应（02-streaming-chat）

**学习目标**：实现类似 ChatGPT 的逐字显示效果

**核心代码**：

```typescript
// 使用 stream() 方法代替 create()
const stream = await client.messages.stream({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "用三段话介绍人工智能的历史",
    },
  ],
});

// 监听流式事件
for await (const event of stream) {
  if (
    event.type === "content_block_delta" &&
    event.delta.type === "text_delta"
  ) {
    process.stdout.write(event.delta.text); // 逐字输出
  }
}
```

**学到的概念**：

- ✅ Streaming 流式响应原理
- ✅ 异步迭代器（for await...of）
- ✅ 事件驱动编程
- ✅ Token 使用统计

**为什么用流式响应？**

1. **用户体验好**：立即看到响应，不用等待
2. **实时性**：对长回复特别有用
3. **节省资源**：可以提前终止不需要的响应

#### 示例 03：系统提示词（03-system-prompt）

**学习目标**：控制 AI 的角色和行为风格

**核心代码**：

```typescript
const systemPrompts = {
  professional: "你是一位专业的技术顾问，擅长用简洁、准确的语言解释复杂概念。",
  teacher: "你是一位耐心的老师，擅长用通俗易懂的例子和比喻来教学。",
  pirate: "你是一位海盗船长，说话带有海盗腔调...",
  programmer: "你是一位资深程序员，回答时：\n1. 先给出简短答案\n2. 然后提供代码示例..."
};

const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 500,
  system: systemPrompts.professional, // 🔑 关键：添加系统提示词
  messages: [...]
});
```

**学到的概念**：

- ✅ System Prompt 的作用
- ✅ 如何控制 AI 的回答风格
- ✅ Prompt Engineering 基础
- ✅ 同一问题不同风格的对比

**重要发现**：

> System Prompt 是 AI 应用的"灵魂"，好的 Prompt 工程是核心技能！

---

## 🏗️ 技术架构

### 核心依赖解析

```json
{
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.72.1", // Anthropic Claude API SDK
    "@types/node": "^25.2.0", // Node.js 类型定义
    "dotenv": "^17.2.3", // 环境变量管理
    "https-proxy-agent": "^7.0.6", // HTTP 代理支持
    "tsx": "^4.21.0" // TypeScript 执行器
  }
}
```

### 为什么选择这些工具？

| 工具                | 作用                 | 为什么选它                          |
| ------------------- | -------------------- | ----------------------------------- |
| `@anthropic-ai/sdk` | Anthropic API 客户端 | 官方 SDK，类型完善，支持流式响应    |
| `tsx`               | TypeScript 执行器    | 比 ts-node 更快，支持 ESM，开箱即用 |
| `dotenv`            | 环境变量管理         | 业界标准，保护 API Key 安全         |
| `https-proxy-agent` | HTTP 代理            | 解决网络访问问题                    |
| `pnpm`              | 包管理器             | 比 npm/yarn 更快，节省磁盘空间      |

### 网络架构

```
┌─────────────┐
│   应用代码   │
└──────┬──────┘
       │
       ├─→ 方案1: 使用中转服务（推荐）
       │    └─→ https://api.aicodemirror.com
       │         └─→ Anthropic API
       │
       └─→ 方案2: 使用代理
            └─→ HTTP_PROXY (127.0.0.1:7890)
                 └─→ Anthropic API
```

---

## 📁 项目结构

```
node-ai/
├── examples/                  # 📚 学习示例（按阶段组织）
│   ├── 01-simple-chat/       # 示例1：基础对话
│   │   ├── index.ts          # 核心代码
│   │   └── README.md         # 示例说明
│   ├── 02-streaming-chat/    # 示例2：流式响应
│   │   ├── index.ts
│   │   └── README.md
│   └── 03-system-prompt/     # 示例3：系统提示词
│       ├── index.ts
│       └── README.md
│
├── docs/                      # 📖 文档目录
│   ├── PROXY_SETUP.md        # 网络配置指南
│   └── PROJECT_SUMMARY.md    # 本文档
│
├── projects/                  # 🚧 实战项目（待开发）
├── playground/                # 🧪 临时测试（待创建）
│
├── .env.example              # 环境变量模板
├── .gitignore                # Git 忽略配置
├── package.json              # 项目配置
├── pnpm-lock.yaml            # 依赖锁定文件
├── tsconfig.json             # TypeScript 配置
├── readme.md                 # 项目说明
│
├── run.sh                    # 快速运行脚本（可选）
└── run-with-proxy.sh         # 带代理运行脚本（可选）
```

### 目录设计理念

- **examples/**：学习示例，每个示例都是独立的、可运行的
- **docs/**：文档集合，记录学习过程和配置说明
- **projects/**：实战项目，应用所学知识
- **playground/**：临时测试，快速验证想法

---

## ⚙️ 环境配置详解

### 1. 安装依赖

```bash
# 确保安装了 Node.js 18+ 和 pnpm
node -v  # 应该 >= 18
pnpm -v  # 应该 >= 8

# 安装项目依赖
pnpm install
```

### 2. 配置 API Key

```bash
# 1. 复制环境变量模板
cp .env.example .env

# 2. 编辑 .env 文件
# 打开 .env，填入你的 ANTHROPIC_API_KEY
```

**如何获取 API Key？**

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制并填入 `.env` 文件

### 3. 网络配置（重要！）

#### 方法 1：使用中转服务（推荐，不需要梯子）

在 `.env` 中添加：

```bash
ANTHROPIC_BASE_URL="https://api.aicodemirror.com/api/claudecode"
```

然后直接运行：

```bash
pnpm example:01
```

#### 方法 2：使用代理（如果有梯子）

**macOS/Linux：**

```bash
# 在 .env 中配置
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

**或者使用 proxy 命令：**

```bash
pnpm proxy:01
```

**常见代理端口：**

- Clash: 7890
- V2Ray: 10809
- Shadowsocks: 1080

---

## ✅ 已实现的功能

### 第一阶段：快速建立感觉（✅ 已完成）

| 示例              | 功能         | 状态 | 学习要点                     |
| ----------------- | ------------ | ---- | ---------------------------- |
| 01-simple-chat    | 基础 AI 对话 | ✅   | API 调用、Messages 结构      |
| 02-streaming-chat | 流式响应     | ✅   | Streaming、用户体验优化      |
| 03-system-prompt  | 系统提示词   | ✅   | Prompt Engineering、角色控制 |

### 后续阶段（🚧 规划中）

#### 第二阶段：AI 工程基础（2-4周）

- [ ] 04-function-calling：让 AI 调用函数
- [ ] 05-multi-tool：多工具集成
- [ ] 06-conversation-memory：对话记忆

#### 第三阶段：Agent 架构（1-2月）

- [ ] 07-simple-agent：简单的自主 Agent
- [ ] 08-langchain-agent：使用 LangChain
- [ ] 09-custom-agent：自定义 Agent 逻辑

#### 第四阶段：RAG 与知识库（1-2月）

- [ ] 10-embeddings：理解向量嵌入
- [ ] 11-vector-search：向量检索
- [ ] 12-rag-demo：完整的 RAG 应用

---

## 🚀 运行与测试

### 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的 ANTHROPIC_API_KEY

# 3. 运行示例
pnpm example:01    # 示例1：基础对话
pnpm example:02    # 示例2：流式响应
pnpm example:03    # 示例3：系统提示词
```

### 示例输出

#### 示例 01 输出：

```
🤖 开始第一次AI对话...

AI回复：
大语言模型是通过学习海量文本数据训练而成的人工智能系统，能够理解和生成自然语言文本。

📊 完整响应对象：
{
  "id": "msg_01XYZ...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "大语言模型是..."
    }
  ],
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 15,
    "output_tokens": 28
  }
}
```

#### 示例 02 输出：

```
🤖 流式对话示例（像ChatGPT那样逐字显示）

问题：用三段话介绍人工智能的历史

AI回复：
人工智能的概念诞生于1956年的达特茅斯会议...
[文字逐个显示，像打字机效果]

✅ 流式响应完成！

📊 Token使用情况：
输入: 12 tokens
输出: 156 tokens
```

#### 示例 03 输出：

```
🎭 系统提示词示例：同一个问题，不同的回答风格

============================================================
📋 默认AI助手
============================================================
系统提示词: 你是一个有帮助的AI助手。
用户问题: 什么是递归？

AI回复:
递归是一种编程技术，函数在执行过程中调用自身...

============================================================
📋 海盗船长
============================================================
系统提示词: 你是一位海盗船长，说话带有海盗腔调...
用户问题: 什么是递归？

AI回复:
啊哈！小伙子，听我这老船长说说这"递归"的航海术...
[海盗风格的解释]
```

### 测试清单

- [x] 基础对话能正常返回响应
- [x] 流式响应能逐字显示
- [x] 系统提示词能改变 AI 风格
- [x] 网络配置正确（中转服务或代理）
- [x] Token 统计显示正常
- [x] 错误处理能捕获异常

---

## 🐛 问题与解决方案

### 问题 1：403 Cloudflare 错误

**错误信息：**

```
PermissionDeniedError: 403 ... Cloudflare
```

**原因：**
Anthropic API 在中国大陆被 Cloudflare 拦截。

**解决方案：**

1. ✅ **推荐**：使用中转服务 `https://api.aicodemirror.com/api/claudecode`
2. 使用代理：配置 HTTP_PROXY 环境变量

详见：[docs/PROXY_SETUP.md](./PROXY_SETUP.md)

### 问题 2：代理配置不生效

**症状：**
设置了 HTTP_PROXY 但仍然连接失败。

**原因：**

1. 代理工具未运行
2. 端口号错误
3. Anthropic SDK 需要特定配置方式

**解决方案：**

```typescript
// 正确的代理配置方式
import { HttpsProxyAgent } from "https-proxy-agent";

const httpAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  httpAgent: httpAgent as any, // 注意：需要 as any
});
```

### 问题 3：API Key 未配置

**错误信息：**

```
❌ 请先配置ANTHROPIC_API_KEY环境变量
```

**解决方案：**

```bash
# 1. 确保 .env 文件存在
cp .env.example .env

# 2. 编辑 .env 文件，填入 API Key
ANTHROPIC_API_KEY="sk-ant-..."

# 3. 确认 dotenv 已加载
# 在代码中添加：import "dotenv/config";
```

### 问题 4：TypeScript 模块导入错误

**错误信息：**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```

**原因：**
ES Modules 和 CommonJS 的兼容问题。

**解决方案：**
在 `package.json` 中添加：

```json
{
  "type": "module"
}
```

在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true
  }
}
```

---

## 🎓 核心知识总结

### 1. AI API 调用流程

```typescript
// 基本流程
1. 创建客户端 → 2. 配置参数 → 3. 发送请求 → 4. 处理响应

// 代码体现
const client = new Anthropic({ apiKey: "..." });      // 1
const params = { model, max_tokens, messages };       // 2
const response = await client.messages.create(params); // 3
console.log(response.content[0].text);                // 4
```

### 2. Messages 结构

```typescript
// 单轮对话
messages: [{ role: "user", content: "你好" }];

// 多轮对话
messages: [
  { role: "user", content: "你好" },
  { role: "assistant", content: "你好！有什么可以帮你的吗？" },
  { role: "user", content: "什么是AI？" },
];
```

### 3. 流式 vs 非流式

| 特性       | 非流式（create）   | 流式（stream）         |
| ---------- | ------------------ | ---------------------- |
| 返回方式   | 一次性返回完整响应 | 逐步返回，像打字       |
| 用户体验   | 需要等待           | 立即看到响应           |
| 适用场景   | 短文本、批处理     | 长文本、交互式对话     |
| 实现复杂度 | 简单               | 稍复杂（需要处理事件） |

### 4. System Prompt 的重要性

```typescript
// ❌ 没有 System Prompt
messages: [{ role: "user", content: "什么是递归？" }];
// → AI 可能给出通用的解释

// ✅ 有 System Prompt
system: "你是一位资深程序员，用代码示例解释概念。";
messages: [{ role: "user", content: "什么是递归？" }];
// → AI 会给出带代码的、程序员风格的解释
```

**关键点：**

- System Prompt 定义了 AI 的"人设"
- 好的 Prompt 能显著提升回答质量
- 这是 Prompt Engineering 的基础

---

## 📚 学习资源

### 官方文档

- [Anthropic API 文档](https://docs.anthropic.com/)
- [Claude 模型对比](https://docs.anthropic.com/claude/docs/models-overview)
- [Prompt Engineering 指南](https://docs.anthropic.com/claude/docs/prompt-engineering)

### 社区资源

- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
- [LangChain 文档](https://js.langchain.com/)
- [AI工程师学习路线](https://github.com/mlabonne/llm-course)

---

## 📝 下一步计划

### 近期目标（1-2周）

- [ ] 实现 04-function-calling 示例
- [ ] 实现 05-multi-tool 示例
- [ ] 学习 Token 计算和成本优化
- [ ] 添加错误处理和重试机制

### 中期目标（1个月）

- [ ] 完成第二阶段所有示例
- [ ] 实现一个简单的 AI 聊天机器人
- [ ] 学习 Conversation Memory 管理
- [ ] 探索 LangChain 集成

### 长期目标（2-3个月）

- [ ] 实现完整的 Agent 系统
- [ ] 学习 RAG（检索增强生成）
- [ ] 构建知识库应用
- [ ] 部署一个实用的 AI 应用

---

## 🔖 重要提示

### 安全注意事项

⚠️ **API Key 安全**：

- ✅ 使用 `.env` 文件存储
- ✅ 添加 `.env` 到 `.gitignore`
- ❌ 永远不要把 API Key 提交到 Git
- ❌ 不要在代码中硬编码 API Key

### 成本控制

💰 **Token 使用**：

- Claude API 按 Token 计费
- 每个示例都显示 Token 使用量
- 合理设置 `max_tokens` 参数
- 使用 Haiku 模型可以降低成本

### 最佳实践

✨ **开发建议**：

- 先在小示例中测试，确认可行后再应用到项目
- 保持每个示例的独立性和简洁性
- 为每个示例编写 README 说明
- 及时记录遇到的问题和解决方案

---

## 🙏 致谢

感谢以下资源和工具：

- [Anthropic](https://www.anthropic.com/) 提供的强大 AI 模型
- [Node.js](https://nodejs.org/) 社区的优秀生态
- [pnpm](https://pnpm.io/) 高效的包管理器
- 所有开源贡献者

---

## 📞 反馈与贡献

如果你在学习过程中：

- 发现了更好的实现方式
- 遇到了新的问题
- 有改进建议

欢迎：

- 提出 Issue
- 提交 Pull Request
- 分享你的学习心得

---

**📅 最后更新时间：2026-02-02**

**🎯 当前进度：第一阶段完成，共 3 个示例全部可运行**

**🚀 下一个里程碑：实现 Function Calling**
