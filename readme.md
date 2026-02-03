# Node.js AI 学习项目

从零开始学习AI应用开发的实践项目。

## 学习路径

### 第一阶段：快速建立感觉（1-2周）
- [x] 项目初始化
- [ ] 01-simple-chat: 最简单的AI对话
- [ ] 02-streaming-chat: 流式响应对话
- [ ] 03-system-prompt: 理解系统提示词

### 第二阶段：AI工程基础（2-4周）
- [ ] 04-function-calling: 让AI调用函数
- [ ] 05-multi-tool: 多工具集成
- [ ] 06-conversation-memory: 对话记忆

### 第三阶段：Agent架构（1-2月）
- [ ] 07-simple-agent: 简单的自主Agent
- [ ] 08-langchain-agent: 使用LangChain
- [ ] 09-custom-agent: 自定义Agent逻辑

### 第四阶段：RAG与知识库（1-2月）
- [ ] 10-embeddings: 理解向量嵌入
- [ ] 11-vector-search: 向量检索
- [ ] 12-rag-demo: 完整的RAG应用

## 项目结构

```
examples/          # 学习示例（按阶段组织）
projects/          # 实战项目
docs/             # 学习笔记
playground/       # 临时测试
```

## 环境要求

- Node.js >= 18
- pnpm
- Claude API Key 或 OpenAI API Key

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 配置 .env 文件
cp .env.example .env
# 编辑 .env，填入你的 ANTHROPIC_API_KEY 和 ANTHROPIC_BASE_URL

# 3. 运行示例
pnpm example:01    # 示例1：基础对话
pnpm example:02    # 示例2：流式响应
pnpm example:03    # 示例3：系统提示词
```

## 网络配置

### 方法1：使用中转服务（推荐，不需要梯子）

在 `.env` 中配置：
```bash
ANTHROPIC_BASE_URL="https://api.aicodemirror.com/api/claudecode"
```

这样可以直接在国内访问，不需要任何代理。

### 方法2：使用代理（如果访问官方API）

如果你有梯子并想访问官方API，在 `.env` 中配置：
```bash
# 注释掉或删除 ANTHROPIC_BASE_URL
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

然后使用 `proxy:*` 命令：
```bash
pnpm proxy:01    # 自动使用代理运行
```

常见代理端口：
- Clash: 7890
- V2Ray: 10809
- Shadowsocks: 1080

