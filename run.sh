#!/bin/bash

# 设置更完整的代理环境变量
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export ALL_PROXY=http://127.0.0.1:7890
export all_proxy=http://127.0.0.1:7890

# 告诉Node.js忽略SSL证书验证（仅用于测试）
export NODE_TLS_REJECT_UNAUTHORIZED=0

echo "🔧 已设置全局代理（包括小写变量）"
echo ""

# 运行示例
case "$1" in
  "01"|"1")
    echo "运行示例01..."
    tsx examples/01-simple-chat/index.ts
    ;;
  "02"|"2")
    echo "运行示例02..."
    tsx examples/02-streaming-chat/index.ts
    ;;
  "03"|"3")
    echo "运行示例03..."
    tsx examples/03-system-prompt/index.ts
    ;;
  *)
    echo "用法: ./run.sh [01|02|03]"
    echo "示例: ./run.sh 01"
    ;;
esac
