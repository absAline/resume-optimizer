import { useState, useRef, useCallback } from 'react'
import { generateStream, buildOptimizePrompt, saveHistory } from '../lib/api'

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
      saveHistory({ type: '优化建议', section, content: text })
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
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${section === s.key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">简历内容</label>
        <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={6}
          placeholder="粘贴需要优化的简历内容..." className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">职位要求（可选）</label>
        <textarea value={jdText} onChange={e => setJdText(e.target.value)} rows={3}
          placeholder="粘贴目标职位要求，使优化更有针对性..." className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
      </div>

      <button onClick={handleOptimize} disabled={loading}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium">
        {loading ? '优化中...' : '✨ 生成优化建议'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {output && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">优化结果</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-sm text-blue-600 hover:text-blue-700">复制</button>
          </div>
          <div className="whitespace-pre-wrap text-sm">{output}</div>
        </div>
      )}
    </div>
  )
}
