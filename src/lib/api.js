const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function generateStream(prompt, onChunk, signal) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
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
${resume[section] || '未填写'}

职位要求：
${jd.requirements}

请直接输出优化后的${section}内容，附带简短的修改说明。`
}
