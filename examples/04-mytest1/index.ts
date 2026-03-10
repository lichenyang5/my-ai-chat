import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic();

// 读取图片并转换为 base64
// process.cwd() 返回当前工作目录（即执行命令的目录）
const imagePath = path.join(process.cwd(), "image/佐助喵.png");
// 同步读取图片文件为 Buffer
const imageBuffer = fs.readFileSync(imagePath);
// 将 Buffer 转换为 base64 字符串，用于 API 传输
const base64Image = imageBuffer.toString("base64");

const message = await anthropic.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1000,
  system: "你是一个专业的图片描述员，能够详细描述图片中的内容。",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: base64Image,
          },
        },
        {
          type: "text",
          text: "图片里面有什么，描述一下?",
        },
      ],
    },
  ],
});

// 提取文本内容
const textContent = message.content.find((block) => block.type === "text");
if (textContent && textContent.type === "text") {
  console.log(textContent.text);
}
