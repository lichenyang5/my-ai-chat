/**
 * 示例02：流式响应对话
 *
 * 学习目标：
 * 1. 理解流式响应（streaming）的原理
 * 2. 体验像ChatGPT那样逐字显示的效果
 * 3. 了解为什么要用streaming
 *
 * 核心概念：
 * - Streaming: 服务器逐步发送数据，而不是等全部生成完
 * - 用户体验: 立即看到响应，不用等待
 * - 实时性: 对于长回复特别有用
 */

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import { HttpsProxyAgent } from "https-proxy-agent";

// 配置中转服务或代理
// 🔥 强制使用正确的中转服务地址
const baseURL = "https://api.aicodemirror.com/api/claudecode";
const proxyUrl = null;
const httpAgent = undefined;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: baseURL,
  httpAgent: httpAgent as any,
});

async function streamingChat() {
  console.log("🤖 流式对话示例（像ChatGPT那样逐字显示）\n");
  console.log("问题：用三段话介绍人工智能的历史\n");
  console.log("AI回复：");

  try {
    // 🔑 关键：使用 stream() 方法而不是 create()
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
      // 当收到文本内容时
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        // 逐字输出，不换行
        process.stdout.write(event.delta.text);
      }
    }

    console.log("\n\n✅ 流式响应完成！");

    // 获取最终的完整消息
    const finalMessage = await stream.finalMessage();
    console.log("\n📊 Token使用情况：");
    console.log(`输入: ${finalMessage.usage.input_tokens} tokens`);
    console.log(`输出: ${finalMessage.usage.output_tokens} tokens`);
  } catch (error) {
    console.error("❌ 错误：", error);
  }
}

// 运行
streamingChat();
