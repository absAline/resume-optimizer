import { useState } from 'react'

const TEMPLATES = [
  { name: '简约现代', color: 'bg-white border-gray-200', text: 'text-gray-800' },
  { name: '专业商务', color: 'bg-blue-50 border-blue-200', text: 'text-blue-900' },
  { name: '清新活力', color: 'bg-green-50 border-green-200', text: 'text-green-900' },
  { name: '稳重深色', color: 'bg-gray-800 border-gray-700', text: 'text-white' },
]

export default function TemplateTab() {
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('张三')
  const [title, setTitle] = useState('高级前端工程师')
  const [email, setEmail] = useState('zhangsan@email.com')
  const [phone, setPhone] = useState('138-0000-0000')

  const t = TEMPLATES[selected]

  const handleCopy = () => {
    const text = `姓名: ${name}
求职意向: ${title}
联系方式: ${email} | ${phone}

教育背景
xxxx - xxxx | xx大学 | 计算机科学与技术 | 本科

工作经历
xxxx - xxxx | xx公司 | ${title}
- 负责xx系统的开发和维护
- 主导xx项目的架构设计
- 优化系统性能，提升30%响应速度

技能
- 熟练掌握: JavaScript/TypeScript, React, Node.js
- 了解: Python, Docker, Kubernetes
- 工具: Git, Webpack, Vite`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {TEMPLATES.map((t, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`px-4 py-2 rounded-lg border text-sm transition ${selected === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="姓名" value={name} onChange={e => setName(e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
        <input placeholder="求职意向" value={title} onChange={e => setTitle(e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
        <input placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
        <input placeholder="电话" value={phone} onChange={e => setPhone(e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm" />
      </div>

      <div className={`rounded-xl border-2 p-6 ${t.color} ${t.text}`}>
        <div className="text-center border-b pb-4 mb-4" style={{ borderColor: selected === 3 ? '#555' : '#e2e8f0' }}>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm mt-1 opacity-80">{title}</p>
          <p className="text-xs mt-1 opacity-60">{email} | {phone}</p>
        </div>
        <div className="space-y-4 text-sm">
          <div><h3 className="font-semibold mb-1">📖 教育背景</h3><p className="opacity-80">xxxx - xxxx | xx大学 | 计算机科学与技术 | 本科</p></div>
          <div><h3 className="font-semibold mb-1">💼 工作经历</h3><p className="opacity-80">xxxx - xxxx | xx公司 | {title}</p><ul className="list-disc list-inside opacity-80"><li>负责核心系统开发</li><li>参与架构设计</li><li>性能优化</li></ul></div>
          <div><h3 className="font-semibold mb-1">🛠️ 技能</h3><p className="opacity-80">JavaScript/TypeScript, React, Node.js, Python</p></div>
        </div>
      </div>

      <button onClick={handleCopy} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
        📋 复制简历文本
      </button>
    </div>
  )
}
