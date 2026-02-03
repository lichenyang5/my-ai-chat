# 示例01：最简单的AI对话

## 学习目标

理解AI对话的基本原理：
1. 如何调用AI API
2. 消息的结构
3. 如何接收响应

## 核心概念

### 1. API Key（密钥）
```typescript
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // 从环境变量读取
})
```
- 就像你的账号密码，用来访问AI服务
- 要保密，不能提交到git
- 不同的AI服务有不同的key（Anthropic、OpenAI等）

### 2. Model（模型）
```typescript
model: 'claude-3-5-sonnet-20241022'
```
- 选择使用哪个AI模型
- 不同模型有不同能力和价格
- Claude Sonnet：平衡性能和成本
- Claude Opus：最强但最贵
- Claude Haiku：最快最便宜

### 3. Messages（消息）
```typescript
messages: [
  {
    role: 'user',        // 谁说的：user或assistant
    content: '你好！'    // 说了什么
  }
]
```
- 对话历史的数组
- `role: 'user'` - 用户说的话
- `role: 'assistant'` - AI说的话
- 后面会看到如何保持多轮对话

### 4. Response（响应）
```typescript
response.content[0].text  // AI的回复文本
```
- AI返回的完整对象
- 包含回复内容、使用的token数等信息

## 运行示例

```bash
# 1. 安装依赖（如果还没装）
pnpm install

# 2. 配置API Key
cp .env.example .env
# 编辑.env，填入你的ANTHROPIC_API_KEY

# 3. 运行
pnpm example:01
```

## 预期输出

```
🤖 开始第一次AI对话...

AI回复：
大语言模型是通过学习海量文本数据训练而成的人工智能系统，能够理解和生成自然语言文本。

📊 完整响应对象：
{
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [...],
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 15,
    "output_tokens": 28
  }
}
```

## 下一步

完成这个示例后，你已经理解了：
- ✅ 如何配置和调用AI API
- ✅ messages的基本结构
- ✅ 如何获取AI的回复

接下来：
- 示例02：学习流式响应（像ChatGPT那样一个字一个字显示）
- 示例03：学习系统提示词（让AI扮演不同角色）
