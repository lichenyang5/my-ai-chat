#!/bin/bash

# 设置代理环境变量并运行示例
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export ALL_PROXY=http://127.0.0.1:7890

echo "🔧 已设置全局代理"
echo "HTTP_PROXY=$HTTP_PROXY"
echo "HTTPS_PROXY=$HTTPS_PROXY"
echo ""

# 运行示例
tsx examples/01-simple-chat/index.ts
