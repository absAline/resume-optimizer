import { useState, useRef, useCallback } from 'react'
import { DEFAULT_RESUME, DEFAULT_JD, INDUSTRIES, EXPERIENCE_LEVELS } from '../lib/config'
import { generateStream, buildAnalyzePrompt, saveHistory } from '../lib/api'

export default function AnalyzeTab() {
  const [step, setStep] = useState('input')
  const [resume, setResume] = useState(DEFAULT_RESUME)
  const [jd, setJd] = useState(DEFAULT_JD)
  const [industry, setIndustry] = useState('互联网/IT')
  const [level, setLevel] = useState('1-3年')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const aborter = useRef(null)

  const updateResume = (k, v) => setResume(r => ({ ...r, [k]: v }))
  const updateJd = (k, v) => setJd(j => ({ ...j, [k]: v }))

  const handleAnalyze = useCallback(async () => {
    if (!resume.name) { setError('请输入姓名'); return }
    setError('')
    setOutput('')
    setLoading(true)
    setStep('result')

    const prompt = buildAnalyzePrompt(resume, jd)

    try {
      aborter.current = new AbortController()
      let text = ''
      await generateStream(prompt, (chunk) => {
        text += chunk
        setOutput(text)
      }, aborter.current.signal)
      saveHistory({ type: '分析报告', name: resume.name, title: resume.title, content: text })
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setLoading(false)
      aborter.current = null
    }
  }, [resume, jd])

  if (step === 'result') {
    return (
      <div className="space-y-4">
        <button onClick={() => setStep('input')} className="text-sm text-blue-600 hover:text-blue-700">← 返回编辑</button>
        {loading && <p className="text-sm text-gray-500 animate-pulse">AI 分析中...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {output && (
          <div className="bg-white rounded-xl border p-6">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{output}</div>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-4 text-sm text-blue-600 hover:text-blue-700">复制报告</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">经验</label>
          <select value={level} onChange={e => setLevel(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">📝 简历信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="姓名" value={resume.name} onChange={e => updateResume('name', e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
          <input placeholder="电话" value={resume.phone} onChange={e => updateResume('phone', e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
          <input placeholder="邮箱" value={resume.email} onChange={e => updateResume('email', e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
        </div>
        <input placeholder="求职意向 / 目标职位" value={resume.title} onChange={e => updateResume('title', e.target.value)} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
        <textarea placeholder="工作经历（每段经历一行，包含公司、职位、时间、职责）" value={resume.experience} onChange={e => updateResume('experience', e.target.value)} rows={3} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
        <textarea placeholder="教育背景（学校、专业、学历、时间）" value={resume.education} onChange={e => updateResume('education', e.target.value)} rows={2} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
        <textarea placeholder="技能清单（逗号分隔）" value={resume.skills} onChange={e => updateResume('skills', e.target.value)} rows={2} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
        <textarea placeholder="项目经历（如有）" value={resume.projects} onChange={e => updateResume('projects', e.target.value)} rows={2} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">🎯 职位描述</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="公司名称" value={jd.company} onChange={e => updateJd('company', e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
          <input placeholder="目标职位" value={jd.position} onChange={e => updateJd('position', e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
        </div>
        <textarea placeholder="岗位要求（每行一条）" value={jd.requirements} onChange={e => updateJd('requirements', e.target.value)} rows={4} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
        <textarea placeholder="职位描述（可选）" value={jd.description} onChange={e => updateJd('description', e.target.value)} rows={3} className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm" />
      </div>

      <button onClick={handleAnalyze} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium w-full">
        {loading ? '分析中...' : '🚀 AI 简历分析'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
