import { getApiConfig, isRealMode as _isRealMode } from './useApiKey'

export const isRealMode = _isRealMode

// ==================== Demo 数据 ====================

function getDemoAnalysis() {
  return `## 📊 匹配度分析

**整体匹配度：72%**

| 维度 | 匹配度 | 说明 |
|------|--------|------|
| 工作经验 | 75% | 3年全栈开发经验与目标职位匹配度良好 |
| 技术栈 | 80% | React/Node.js/TypeScript高度匹配 |
| 教育背景 | 70% | 计算机科学相关专业，符合基本要求 |
| 软技能 | 60% | 可更突出团队协作和项目管理经验 |

## ✅ 简历优势

1. **技术栈全面** — 覆盖前后端主流技术，具备全栈能力
2. **项目经验丰富** — 有多个上线的真实项目，包含数据支撑
3. **持续学习** — 有个人博客和技术社区贡献，体现自驱力
4. **结果导向** — 简历中多处使用量化数据（性能提升40%、日活10万+）

## 🔧 改进建议

### 工作经历部分
**问题**：描述偏重"做了什么"，缺少"达成了什么"
**建议优化**：
> 主导电商平台架构升级，将核心接口响应时间从800ms降至120ms（优化85%），支撑日活从2万增长至10万

### 技能部分
**问题**：技能列表与JD关键词匹配不足
**建议添加**：Docker/Kubernetes、Redis、消息队列、微服务架构

## 🏷️ 推荐关键词
\`全栈开发\` \`性能优化\` \`架构设计\` \`React\` \`Node.js\` \`TypeScript\` \`微服务\`

## 📈 技能差距
- Docker/K8s容器化经验 — 目标职位明确要求
- Redis缓存优化 — 建议补充相关项目经验

## 🎯 面试准备方向
1. **架构设计**：准备1-2个系统设计案例（如秒杀系统、IM系统）
2. **性能优化**：梳理简历中的优化案例，准备好具体数据和方案
3. **项目难点**：针对每个项目准备"最大挑战"的STAR讲述`
}

function getDemoOptimize(section) {
  const demos = {
    experience: `## 优化后的工作经历

**高级全栈工程师 | ABC科技有限公司 | 2021.06 - 至今**

### 电商平台架构升级
- 主导电商平台从单体架构到微服务架构的升级，将核心接口响应时间从800ms降至120ms（优化85%），支撑日活从2万增长至10万
- 设计并实现了基于Redis的缓存层，数据库查询负载降低60%，系统吞吐量提升3倍
- 引入Docker容器化部署，将部署时间从2小时缩短至15分钟，回滚成功率提升至99.9%

### 数据平台建设
- 搭建基于ELK的日志监控平台，覆盖200+微服务节点，问题定位时间从小时级降至分钟级
- 开发自动化测试框架，覆盖率达到85%，线上故障率降低70%`,

    skills: `## 优化后的技能列表

### 前端技术
React / TypeScript / Next.js / Tailwind CSS / Redux

### 后端技术
Node.js / Express / NestJS / Python / Java / RESTful API / GraphQL

### 数据库与中间件
PostgreSQL / MongoDB / Redis / RabbitMQ / Elasticsearch

### DevOps
Docker / Kubernetes / AWS / CI/CD (GitHub Actions) / Nginx

### 其他
微服务架构 / 系统设计 / 性能优化 / 团队管理 (5人)`,
  }
  return demos[section] || `## 优化后的内容

根据您的简历和职位描述，以下是优化建议：

1. 使用量化数据描述成就（如"提升40%"、"减少50%工时"）
2. 突出与目标职位最相关的经验和技能
3. 采用STAR法则（情境-任务-行动-结果）描述项目经验`
}

async function simulateStream(content, onChunk, signal) {
  const chars = content.split('')
  let i = 0
  while (i < chars.length) {
    if (signal?.aborted) break
    onChunk(chars[i])
    i++
    await new Promise(r => setTimeout(r, 10 + Math.random() * 20))
  }
}

// ==================== 真实 AI API（OpenAI 兼容/流式） ====================

async function callRealAPI(messages, onChunk, signal) {
  const config = getApiConfig()
  if (!config?.apiKey) throw new Error('未配置 API Key')

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`API 请求失败 (${response.status}): ${errText || response.statusText}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    if (signal?.aborted) break
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'data: [DONE]') continue
      if (!trimmed.startsWith('data: ')) continue

      try {
        const json = JSON.parse(trimmed.slice(6))
        const delta = json.choices?.[0]?.delta?.content
        if (delta) onChunk(delta)
      } catch { /* skip malformed chunks */ }
    }
  }
}

// ==================== 统一出口 ====================

export async function generateStream(prompt, onChunk, signal) {
  const messages = [
    {
      role: 'system',
      content: '你是一个专业的简历优化专家。请根据用户的指令直接输出分析结果或优化建议。使用Markdown格式，中文输出。不要输出思考过程。',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]

  if (isRealMode()) {
    try {
      await callRealAPI(messages, onChunk, signal)
      return
    } catch (err) {
      if (err.name === 'AbortError') throw err
      console.warn('Real API call failed, falling back to demo:', err.message)
    }
  }

  // Demo mode: use keyword matching for more relevant demos
  const isOptimize = prompt.includes('优化')
  const isSection = prompt.includes('工作经历') || prompt.includes('技能')
  await simulateStream(
    isOptimize && isSection ? getDemoOptimize('experience') :
    isOptimize ? getDemoOptimize('skills') :
    getDemoAnalysis(),
    onChunk, signal
  )
}

function buildResumePrompt(resume, jd) {
  return `你是一个专业的简历优化专家。请分析以下简历和职位描述，给出优化建议。

## 简历信息
- 姓名：${resume.name}
- 求职意向：${resume.title}
- 工作经历：${resume.experience}
- 教育背景：${resume.education}
- 技能：${resume.skills}
- 项目经历：${resume.projects}

## 职位描述
- 公司：${jd.company}
- 职位：${jd.position}
- 岗位要求：${jd.requirements}
- 职位描述：${jd.description}

## 输出要求
请按以下格式输出分析结果：

1. **匹配度分析**（整体匹配度评分 0-100，分项说明）
2. **简历优势**（3-5点）
3. **改进建议**（每项包含问题描述和优化后的文本）
4. **关键词推荐**（建议添加到简历中的关键词）
5. **技能差距**（JD需要但简历缺失的技能）
6. **面试准备方向**（基于JD的建议）

格式要求：使用Markdown，中文，详细具体。`
}

export function buildAnalyzePrompt(resume, jd) {
  return buildResumePrompt(resume, jd)
}

export function buildOptimizePrompt(resume, jd, section) {
  return `作为简历优化专家，请专门优化以下简历中的"${section}"部分，使其更匹配职位描述。

简历${section}原文：
${resume[section] || jd?.requirements || '未填写'}

职位要求：
${jd?.requirements || '未提供'}

请直接输出优化后的${section}内容，附带简短的修改说明。`
}

// ==================== 历史记录 (localStorage) ========================

const HISTORY_KEY = 'resume-optimizer-history'
const USAGE_KEY = 'resume-optimizer-usage'

export function saveToHistory(item) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  history.unshift({ ...item, id: Date.now(), createdAt: new Date().toISOString() })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
}

export function deleteHistoryItem(id) {
  const history = getHistory()
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.filter(h => h.id !== id)))
}

export function clearAllHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

// ==================== 使用次数限制 ====================

const DAILY_LIMIT = 10

export function getDailyUsage() {
  const today = new Date().toDateString()
  const usage = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}')
  if (usage.date !== today) return { date: today, count: 0 }
  return usage
}

export function incrementUsage() {
  const today = new Date().toDateString()
  const usage = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}')
  if (usage.date !== today) {
    const newUsage = { date: today, count: 1 }
    localStorage.setItem(USAGE_KEY, JSON.stringify(newUsage))
    return newUsage
  }
  usage.count += 1
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  return usage
}

export function canUseToday() {
  if (isRealMode()) return { allowed: true, remaining: 999 } // no limit in real mode
  const usage = getDailyUsage()
  const remaining = DAILY_LIMIT - usage.count
  return { allowed: remaining > 0, remaining: Math.max(0, remaining), total: DAILY_LIMIT }
}
