import { useState, useRef, useCallback } from 'react'
import { downloadTextFile } from '../lib/utils'
import { generateStream, buildOptimizePrompt, saveToHistory, canUseToday, incrementUsage, isRealMode } from '../lib/api'

const SECTIONS = [
  { key: 'experience', label: '工作经历' },
  { key: 'education', label: '教育背景' },
  { key: 'skills', label: '技能清单' },
  { key: 'projects', label: '项目经历' },
  { key: 'all', label: '全文优化' },
]

export default function OptimizeTab() {
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [section, setSection] = useState('experience')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const aborter = useRef(null)

  const handleOptimize = useCallback(async () => {
    if (!resumeText.trim()) { setError('请输入简历内容'); return }

    if (!isRealMode() && !canUseToday().allowed) {
      setError(`今日免费次数已用尽（${canUseToday().total}/${canUseToday().total}），配置 API Key 可解除限制`)
      return
    }

    setError('')
    setOutput('')
    setLoading(true)

    const prompt = buildOptimizePrompt({ [section]: resumeText, experience: resumeText, education: resumeText, skills: resumeText, projects: resumeText }, { requirements: jdText }, section)

    try {
      aborter.current = new AbortController()
      let text = ''
      await generateStream(prompt, (chunk) => {
        text += chunk
        setOutput(text)
      }, aborter.current.signal)
      saveToHistory({ type: '优化建议', name: section, content: text })
      incrementUsage()
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setLoading(false)
      aborter.current = null
    }
  }, [resumeText, jdText, section])

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              section === s.key
                ? 'btn-gold text-xs'
                : 'border-gray-600/30 text-gray-400 bg-transparent'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="card-premium">
        <label className="block text-sm font-medium mb-1" style={{color: '#94a3b8'}}>简历内容</label>
        <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={6}
          placeholder="粘贴需要优化的简历内容..." className="textarea-premium" />
      </div>

      <div className="card-premium">
        <label className="block text-sm font-medium mb-1" style={{color: '#94a3b8'}}>职位要求（可选）</label>
        <textarea value={jdText} onChange={e => setJdText(e.target.value)} rows={3}
          placeholder="粘贴目标职位要求，使优化更有针对性..." className="textarea-premium" />
      </div>

      <button onClick={handleOptimize} disabled={loading} className="btn-gold w-full text-sm">
        {loading ? '优化中...' : '✨ 生成优化建议'}
      </button>

      {error && <p className="text-sm" style={{color: '#e8564a'}}>{error}</p>}

      {output && (
        <div className="card-premium">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium" style={{color: '#94a3b8'}}>优化结果</span>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs btn-gold">复制</button>
              <button onClick={() => downloadTextFile(output, `优化建议-${Date.now()}.txt`)} className="text-xs btn-gold" style={{background: 'rgba(45, 125, 70, 0.6)'}}>导出 TXT</button>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-sm" style={{color: '#cbd5e1'}}>{output}</div>
        </div>
      )}
    </div>
  )
}
