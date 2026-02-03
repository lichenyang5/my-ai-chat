# 网络配置说明

## 问题：403 Cloudflare 错误

如果你看到这个错误：
```
PermissionDeniedError: 403 ... Cloudflare
```

这是因为 Anthropic API 在中国大陆被 Cloudflare 拦截。

## 解决方案

### 方法1：配置代理（推荐）

1. **确保你有代理工具运行**
   - Clash for Windows
   - V2Ray
   - 其他科学上网工具

2. **找到代理端口**
   - Clash 默认：`7890`
   - V2Ray 默认：`10809`
   - 查看你的工具设置

3. **配置 .env 文件**
```bash
# 编辑 .env 文件
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

4. **测试连接**
```bash
# 重新运行示例
pnpm example:01
```

### 方法2：全局设置代理

在运行命令前临时设置：

**macOS/Linux:**
```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
pnpm example:01
```

**Windows (PowerShell):**
```powershell
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
pnpm example:01
```

### 方法3：使用国内中转服务（不推荐）

有些服务提供国内中转：
- OpenAI 中转 API
- Cloudflare Workers 代理
- 第三方服务

但这些可能：
- 不稳定
- 有安全风险
- 需要额外费用

## 如何验证代理配置

运行测试命令：
```bash
# macOS/Linux
curl -x http://127.0.0.1:7890 https://api.anthropic.com

# 如果返回内容而不是错误，说明代理工作正常
```

## 常见端口

| 工具 | 默认端口 |
|------|---------|
| Clash | 7890 |
| V2Ray | 10809 |
| Shadowsocks | 1080 |
| Clash Verge | 7890 |
| Qv2ray | 8889 |

## 还是不行？

1. 确认代理工具正在运行
2. 确认端口号正确
3. 试试访问 https://www.google.com 确认代理能用
4. 查看代理工具的日志
