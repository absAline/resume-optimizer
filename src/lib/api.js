import { getApiConfig } from './useApiKey'

function getHeaders() {
  const { provider, key } = getApiConfig()
  if (provider === 'openai') return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }
  if (provider === 'ollama') return { 'Content-Type': 'application/json' }
  return { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }
}

function getBody(provider, prompt) {
  const config = getApiConfig()
  if (provider === 'openai') return { model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], stream: true }
  if (provider === 'ollama') return { model: config.ollamaModel, messages: [{ role: 'user', content: prompt }], stream: true }
  return { model: 'claude-sonnet-4-20250514', max_tokens: 4096, messages: [{ role: 'user', content: prompt }], stream: true }
}

function getEndpoint(provider) {
  const config = getApiConfig()
  if (provider === 'openai') return 'https://api.openai.com/v1/chat/completions'
  if (provider === 'ollama') return `${config.ollamaEndpoint}/api/chat`
  return 'https://api.anthropic.com/v1/messages'
}

export async function generateStream(prompt, onChunk, signal) {
  const { provider } = getApiConfig()
  const res = await fetch(getEndpoint(provider), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(getBody(provider, prompt)),
    signal,
  })

  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`API error (${res.status}): ${err}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    if (provider === 'ollama') {
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const data = JSON.parse(line)
          if (data.message?.content) onChunk(data.message.content)
        } catch {}
      }
    } else if (provider === 'claude') {
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'content_block_delta' && data.delta?.text) onChunk(data.delta.text)
          } catch {}
        }
      }
    } else {
      const lines = buffer.split('\n')
      buffer = ''
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6))
            const delta = data.choices?.[0]?.delta?.content
            if (delta) onChunk(delta)
          } catch {}
        }
      }
    }
  }
}

export function saveHistory(item) {
  const key = 'resume-history'
  const h = JSON.parse(localStorage.getItem(key) || '[]')
  h.unshift({ ...item, id: Date.now(), createdAt: new Date().toISOString() })
  localStorage.setItem(key, JSON.stringify(h.slice(0, 50)))
}

export function getHistory() {
  return JSON.parse(localStorage.getItem('resume-history') || '[]')
}

export function deleteHistoryItem(id) {
  const h = getHistory()
  localStorage.setItem('resume-history', JSON.stringify(h.filter(i => i.id !== id)))
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
