import { useState } from 'react'

const TEMPLATES = [
  { name: '简约现代', desc: '经典黑白，适用广泛' },
  { name: '专业商务', desc: '蓝色调，稳重可靠' },
  { name: '清新活力', desc: '绿色系，年轻活力' },
  { name: '稳重深色', desc: '深色底，高端质感' },
]

export default function TemplateTab() {
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('张三')
  const [title, setTitle] = useState('高级前端工程师')
  const [email, setEmail] = useState('zhangsan@email.com')
  const [phone, setPhone] = useState('138-0000-0000')

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
      <div className="flex gap-2 flex-wrap">
        {TEMPLATES.map((t, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-lg border text-xs transition ${
              selected === i
                ? 'btn-gold'
                : 'border-gray-600/30 text-gray-400 bg-transparent'
            }`}>
            {t.name}
          </button>
        ))}
      </div>

      <div className="card-premium">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input placeholder="姓名" value={name} onChange={e => setName(e.target.value)} className="input-premium" />
          <input placeholder="求职意向" value={title} onChange={e => setTitle(e.target.value)} className="input-premium" />
          <input placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} className="input-premium" />
          <input placeholder="电话" value={phone} onChange={e => setPhone(e.target.value)} className="input-premium" />
        </div>

        <div className="rounded-xl border p-6 mb-4"
          style={{
            background: selected === 3 ? '#1a1f2e' : 'rgba(30, 41, 59, 0.5)',
            borderColor: selected === 3 ? '#d4a74a' : 'rgba(212, 167, 74, 0.1)',
            color: selected === 3 ? '#e8edf5' : '#cbd5e1',
          }}>
          <div className="text-center border-b pb-4 mb-4" style={{ borderColor: 'rgba(148, 163, 184, 0.2)' }}>
            <h2 className="text-xl font-bold" style={{fontFamily: 'var(--font-heading)'}}>{name}</h2>
            <p className="text-sm mt-1 opacity-80">{title}</p>
            <p className="text-xs mt-1 opacity-60">{email} | {phone}</p>
          </div>
          <div className="space-y-4 text-sm">
            <div><h3 className="font-semibold mb-1" style={{color: '#d4a74a'}}>📖 教育背景</h3><p className="opacity-80">xxxx - xxxx | xx大学 | 计算机科学与技术 | 本科</p></div>
            <div><h3 className="font-semibold mb-1" style={{color: '#d4a74a'}}>💼 工作经历</h3><p className="opacity-80">xxxx - xxxx | xx公司 | {title}</p><ul className="list-disc list-inside opacity-80"><li>负责核心系统开发</li><li>参与架构设计</li><li>性能优化</li></ul></div>
            <div><h3 className="font-semibold mb-1" style={{color: '#d4a74a'}}>🛠️ 技能</h3><p className="opacity-80">JavaScript/TypeScript, React, Node.js, Python</p></div>
          </div>
        </div>

        <button onClick={handleCopy} className="btn-gold w-full text-sm">
          📋 复制简历文本
        </button>
      </div>
    </div>
  )
}
