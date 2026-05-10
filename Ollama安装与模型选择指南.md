# Ollama 安装与模型选择指南

## 什么是 Ollama？

Ollama 是一个免费开源的本地 AI 模型运行工具。安装后你可以在自己电脑上运行大语言模型，**无需联网、无需 API Key、完全免费**，数据不会离开你的电脑。

## 一、安装 Ollama

### macOS

```bash
brew install ollama
# 或者从官网下载：https://ollama.com/download
```

安装后启动服务：

```bash
ollama serve
```

### Windows

从 https://ollama.com/download 下载 Windows 安装包，双击安装即可。

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## 二、下载模型

Ollama 启动后，打开新终端下载模型：

```bash
# 推荐模型（按需求选择）
ollama pull qwen2.5:7b      # 通义千问 7B — 中文最强，写作/分析首选（推荐）
ollama pull llama3.1:8b     # Meta Llama 3.1 — 英文能力强
ollama pull deepseek-r1:7b  # DeepSeek R1 — 推理能力强，适合分析任务
ollama pull qwen2.5:14b     # 通义千问 14B — 效果更好，但需要更多内存（推荐 16G+）
```

查看已下载的模型：

```bash
ollama list
```

## 三、模型选择建议

| 任务 | 推荐模型 | 说明 |
|------|---------|------|
| 中文文案创作 | `qwen2.5:7b` | 中文理解与生成能力出色 |
| 简历分析与优化 | `qwen2.5:7b` 或 `deepseek-r1:7b` | 结构化输出能力强 |
| 英文内容生成 | `llama3.1:8b` | 英文最自然 |
| 代码生成 | `qwen2.5:7b` 或 `deepseek-coder:6.7b` | 代码任务表现好 |
| 高质量输出（需 16G+ 内存） | `qwen2.5:14b` 或 `llama3.1:70b` | 更大的模型效果更好 |

**新手推荐**：先安装 `qwen2.5:7b`（约 4.4GB），中文好、速度快、普通电脑都能跑。

## 四、硬件要求

| 模型 | 最低内存 | 推荐内存 | 磁盘空间 |
|------|---------|---------|---------|
| qwen2.5:7b | 8GB | 16GB | 4.4GB |
| llama3.1:8b | 8GB | 16GB | 4.9GB |
| deepseek-r1:7b | 8GB | 16GB | 4.7GB |
| qwen2.5:14b | 16GB | 32GB | ~9GB |
| llama3.1:70b | 32GB | 64GB | ~40GB |

## 五、验证安装

```bash
# 终端直接对话测试
ollama run qwen2.5:7b

# 进入后输入 "你好" 看是否有回复
# 输入 /bye 退出
```

## 六、在本项目中使用

1. 确保 Ollama 已启动（`ollama serve`）
2. 打开项目页面，点击右上角 ⚙️
3. 选择「Ollama (本地) — 免费」
4. 输入模型名称（如 `qwen2.5:7b`）
5. Ollama 地址保持默认 `http://localhost:11434`
6. 点击保存，开始使用

> **提示**：如果 Ollama 和网页不在同一台电脑上（如 Ollama 跑在服务器），将地址改为服务器 IP 即可，如 `http://192.168.1.100:11434`

## 七、常见问题

**Q: 连接不上 Ollama？**
A: 确保已运行 `ollama serve`，且地址端口正确（默认 localhost:11434）

**Q: 模型回答很慢？**
A: 7B 模型在普通电脑上需要几秒到十几秒生成，这是正常的。可以尝试关闭其他程序释放内存。

**Q: 中文回答质量不好？**
A: 优先使用 `qwen2.5:7b` 或 `qwen2.5:14b`，中文能力最强。

**Q: 如何更新模型？**
A: `ollama pull qwen2.5:7b` 会下载最新版本。
