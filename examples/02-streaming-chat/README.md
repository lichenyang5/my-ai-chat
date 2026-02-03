# 示例02：流式响应对话

## 学习目标

理解流式响应（Streaming）：
1. 什么是streaming，为什么需要它
2. 如何实现逐字显示效果
3. streaming vs 非streaming的区别

## 核心概念

### 1. 什么是Streaming？

**非流式（示例01）：**
```
用户发送请求 → 等待... → AI生成完整回复 → 一次性返回
```
- 优点：简单
- 缺点：长回复时用户要等很久

**流式（本示例）：**
```
用户发送请求 → AI生成第一个字 → 立即发送 → 生成第二个字 → 发送...
```
- 优点：立即看到响应，体验更好
- 缺点：代码稍微复杂一点

### 2. 代码对比

**非流式：**
```typescript
const response = await client.messages.create({...})
console.log(response.content[0].text)  // 一次性输出全部
```

**流式：**
```typescript
const stream = await client.messages.stream({...})
for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text)  // 逐字输出
  }
}
```

### 3. 事件类型

在streaming过程中会收到多种事件：

```typescript
// 消息开始
{ type: 'message_start', message: {...} }

// 内容块开始
{ type: 'content_block_start', index: 0 }

// 内容增量（这是我们要的！）
{ type: 'content_block_delta', delta: { type: 'text_delta', text: '人' } }
{ type: 'content_block_delta', delta: { type: 'text_delta', text: '工' } }
{ type: 'content_block_delta', delta: { type: 'text_delta', text: '智' } }

// 内容块结束
{ type: 'content_block_stop' }

// 消息结束
{ type: 'message_stop' }
```

### 4. 实际应用场景

**必须用streaming：**
- 聊天应用（ChatGPT、Claude等）
- 实时翻译
- 代码生成（看到代码逐渐生成）

**可以不用streaming：**
- API后台处理
- 批量任务
- 简短问答

## 运行示例

```bash
pnpm example:02
```

## 预期输出

```
🤖 流式对话示例（像ChatGPT那样逐字显示）

问题：用三段话介绍人工智能的历史

AI回复：
人工智能的概念诞生于1956年的达特茅斯会议，当时一群科学家...
（文字会逐字显示，而不是一次性出现）

✅ 流式响应完成！

📊 Token使用情况：
输入: 28 tokens
输出: 156 tokens
```

## 技巧：在Web应用中使用

在实际项目中（比如Next.js），streaming通常这样用：

```typescript
// API路由（app/api/chat/route.ts）
export async function POST(req: Request) {
  const stream = await client.messages.stream({...})

  // 转换为Web标准的ReadableStream
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta') {
            controller.enqueue(event.delta.text)
          }
        }
        controller.close()
      }
    })
  )
}
```

## 下一步

完成这个示例后，你已经掌握：
- ✅ 流式响应的原理
- ✅ 如何实现逐字显示
- ✅ streaming的应用场景

接下来：
- 示例03：学习系统提示词（让AI扮演专业角色）
