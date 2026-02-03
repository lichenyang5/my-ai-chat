/**
 * 示例01：最简单的AI对话
 *
 * 学习目标：
 * 1. 理解如何调用AI API
 * 2. 了解messages的结构
 * 3. 看到AI的响应
 *
 * 核心概念：
 * - API Key: 访问AI服务的密钥
 * - Model: 选择使用的AI模型
 * - Messages: 对话消息数组，包含role和content
 * - Role: user（用户）或 assistant（AI助手）
 */

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
console.log("ANTHROPIC_API_KEY:", process.env, process.env.ANTHROPIC_API_KEY);
// 检查API Key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ 请先配置ANTHROPIC_API_KEY环境变量");
  console.log("💡 提示：复制.env.example为.env，然后填入你的API Key");
  process.exit(1);
}

// 配置代理或中转服务
// 🔥 强制使用正确的中转服务地址，忽略所有环境变量
const baseURL = "https://api.aicodemirror.com/api/claudecode";
const proxyUrl = null; // 不使用代理

if (baseURL) {
  console.log(`🌐 使用中转服务: ${baseURL}\n`);
} else if (proxyUrl) {
  console.log(`🔧 使用代理: ${proxyUrl}\n`);
} else {
  console.error("❌ 未检测到中转服务或代理配置");
  console.log("💡 请在.env中配置 ANTHROPIC_BASE_URL 或代理");
  process.exit(1);
}

// 创建客户端
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: baseURL, // 使用中转服务地址
});

async function simpleChat() {
  console.log("🤖 开始第一次AI对话...\n");

  try {
    // 发送消息给AI
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022", // 模型名称
      max_tokens: 1024, // 最大返回长度
      messages: [
        {
          role: "user", // 角色：用户
          content: "你好！请用一句话介绍什么是大语言模型。", // 消息内容
        },
      ],
    });

    // 打印AI的回复
    console.log("AI回复：");
    console.log(response.content[0].text);
    console.log("\n");

    // 查看完整响应结构（帮助理解）
    console.log("📊 完整响应对象：");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("❌ 错误：", error);
  }
}

// 运行
simpleChat();
