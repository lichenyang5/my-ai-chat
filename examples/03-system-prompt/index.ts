/**
 * 示例03：系统提示词（System Prompt）
 *
 * 学习目标：
 * 1. 理解什么是系统提示词
 * 2. 学会如何控制AI的角色和行为
 * 3. 看到同样的问题，不同的系统提示词产生不同的回答
 *
 * 核心概念：
 * - System Prompt: 设定AI的角色、风格、规则
 * - 这是AI应用的"灵魂"，决定了AI如何回答
 * - 好的Prompt工程是AI开发的核心技能
 */

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import { HttpsProxyAgent } from "https-proxy-agent";

// 配置中转服务或代理
// 🔥 强制使用正确的中转服务地址
const baseURL = "https://api.aicodemirror.com/api/claudecode";
const proxyUrl = null;

if (baseURL) {
  console.log(`🌐 使用中转服务: ${baseURL}`);
} else if (proxyUrl) {
  console.log(`🔧 使用代理: ${proxyUrl}`);
}

const httpAgent = proxyUrl && !baseURL ? new HttpsProxyAgent(proxyUrl) : undefined;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: baseURL,
  httpAgent: httpAgent as any,
});

// 定义不同的系统提示词
const systemPrompts = {
  default: "你是一个有帮助的AI助手。",

  professional:
    "你是一位专业的技术顾问，擅长用简洁、准确的语言解释复杂概念。",

  teacher:
    "你是一位耐心的老师，擅长用通俗易懂的例子和比喻来教学。总是先问学生的理解程度，然后调整解释的深度。",

  pirate: "你是一位海盗船长，说话带有海盗腔调，喜欢用航海术语，但仍然能准确回答问题。",

  programmer: `你是一位资深程序员，回答时：
1. 先给出简短答案
2. 然后提供代码示例
3. 最后说明注意事项
你喜欢用代码来解释概念。`,
};

async function testSystemPrompt(
  systemPrompt: string,
  userQuestion: string,
  label: string
) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📋 ${label}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`系统提示词: ${systemPrompt}`);
  console.log(`用户问题: ${userQuestion}\n`);

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 500,
    system: systemPrompt, // 🔑 关键：添加系统提示词
    messages: [
      {
        role: "user",
        content: userQuestion,
      },
    ],
  });

  console.log("AI回复:");
  console.log(response.content[0].text);
}

async function main() {
  if (proxyUrl) {
    console.log(`🔧 使用代理: ${proxyUrl}`);
  }

  console.log("\n🎭 系统提示词示例：同一个问题，不同的回答风格\n");

  const question = "什么是递归？";

  // 测试不同的系统提示词
  await testSystemPrompt(systemPrompts.default, question, "默认AI助手");

  await testSystemPrompt(systemPrompts.professional, question, "专业技术顾问");

  await testSystemPrompt(systemPrompts.teacher, question, "耐心的老师");

  await testSystemPrompt(systemPrompts.pirate, question, "海盗船长");

  await testSystemPrompt(systemPrompts.programmer, question, "资深程序员");

  console.log("\n" + "=".repeat(60));
  console.log("✅ 完成！看到不同的系统提示词如何影响回答风格了吗？");
  console.log("=".repeat(60));
}

main().catch(console.error);
