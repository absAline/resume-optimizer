import { useState, useRef, useCallback } from 'react'
import { downloadTextFile } from '../lib/utils'
import { DEFAULT_RESUME, DEFAULT_JD, INDUSTRIES, EXPERIENCE_LEVELS } from '../lib/config'
import { generateStream, buildAnalyzePrompt, saveToHistory, canUseToday, incrementUsage, isRealMode } from '../lib/api'

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

    if (!isRealMode() && !canUseToday().allowed) {
      setError(`今日免费次数已用尽（${canUseToday().total}/${canUseToday().total}），配置 API Key 可解除限制`)
      return
    }

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
      saveToHistory({ type: '分析报告', name: resume.name, title: resume.title, content: text })
      incrementUsage()
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
        <button onClick={() => setStep('input')} className="text-sm" style={{color: '#d4a74a'}}>← 返回编辑</button>
        {loading && <p className="text-sm animate-pulse" style={{color: '#64748b'}}>AI 分析中...</p>}
        {error && <p className="text-sm" style={{color: '#e8564a'}}>{error}</p>}
        {output && (
          <div className="card-premium">
            <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{color: '#cbd5e1'}}>{output}</div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(output)} className="btn-gold text-xs">复制报告</button>
              <button onClick={() => downloadTextFile(output, `简历分析-${resume.name}.txt`)} className="btn-gold text-xs" style={{background: 'rgba(45, 125, 70, 0.6)'}}>导出 TXT</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#94a3b8'}}>行业</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)} className="select-premium">
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#94a3b8'}}>经验</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="select-premium">
              {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card-premium">
        <h3 className="text-sm font-semibold mb-3" style={{color: '#d4a74a'}}>📝 简历信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="姓名" value={resume.name} onChange={e => updateResume('name', e.target.value)} className="input-premium" />
          <input placeholder="电话" value={resume.phone} onChange={e => updateResume('phone', e.target.value)} className="input-premium" />
          <input placeholder="邮箱" value={resume.email} onChange={e => updateResume('email', e.target.value)} className="input-premium" />
        </div>
        <input placeholder="求职意向 / 目标职位" value={resume.title} onChange={e => updateResume('title', e.target.value)} className="input-premium mt-3" />
        <textarea placeholder="工作经历（每段经历一行，包含公司、职位、时间、职责）" value={resume.experience} onChange={e => updateResume('experience', e.target.value)} rows={3} className="textarea-premium mt-3" />
        <textarea placeholder="教育背景（学校、专业、学历、时间）" value={resume.education} onChange={e => updateResume('education', e.target.value)} rows={2} className="textarea-premium mt-3" />
        <textarea placeholder="技能清单（逗号分隔）" value={resume.skills} onChange={e => updateResume('skills', e.target.value)} rows={2} className="textarea-premium mt-3" />
        <textarea placeholder="项目经历（如有）" value={resume.projects} onChange={e => updateResume('projects', e.target.value)} rows={2} className="textarea-premium mt-3" />
      </div>

      <div className="card-premium">
        <h3 className="text-sm font-semibold mb-3" style={{color: '#d4a74a'}}>🎯 职位描述</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="公司名称" value={jd.company} onChange={e => updateJd('company', e.target.value)} className="input-premium" />
          <input placeholder="目标职位" value={jd.position} onChange={e => updateJd('position', e.target.value)} className="input-premium" />
        </div>
        <textarea placeholder="岗位要求（每行一条）" value={jd.requirements} onChange={e => updateJd('requirements', e.target.value)} rows={4} className="textarea-premium mt-3" />
        <textarea placeholder="职位描述（可选）" value={jd.description} onChange={e => updateJd('description', e.target.value)} rows={3} className="textarea-premium mt-3" />
      </div>

      <button onClick={handleAnalyze} disabled={loading} className="btn-gold w-full text-sm">
        {loading ? '分析中...' : '🚀 AI 简历分析'}
      </button>
      {error && <p className="text-sm" style={{color: '#e8564a'}}>{error}</p>}
    </div>
  )
}
