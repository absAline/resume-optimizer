import { useState } from 'react'
import useApiKey from './lib/useApiKey'
import { TABS } from './lib/config'
import AnalyzeTab from './components/AnalyzeTab'
import OptimizeTab from './components/OptimizeTab'
import TemplateTab from './components/TemplateTab'
import HistoryTab from './components/HistoryTab'

function ApiKeyModal({ config, update, onClose }) {
  const [localProvider, setLocalProvider] = useState(config.provider)
  const [localKey, setLocalKey] = useState(config.key)

  const handleSave = () => {
    update({ provider: localProvider, key: localKey.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">API 密钥设置</h3>
        <p className="text-xs text-gray-500 mb-4">密钥仅存储在浏览器本地，不会上传到任何服务器</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">AI 提供商</label>
        <select value={localProvider} onChange={e => setLocalProvider(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 text-sm mb-4">
          <option value="claude">Claude (Anthropic)</option>
          <option value="openai">OpenAI (GPT-4o)</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
        <input type="password" value={localKey} onChange={e => setLocalKey(e.target.value)}
          placeholder={localProvider === 'claude' ? 'sk-ant-...' : 'sk-...'}
          className="w-full rounded-lg border border-gray-300 p-2 text-sm mb-6"
        />

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">取消</button>
          <button onClick={handleSave} disabled={!localKey.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('analyze')
  const { provider, key, hasKey, update, showModal, setShowModal } = useApiKey()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">📄 AI 简历优化器</h1>
            <p className="text-xs text-gray-400">AI 驱动的简历分析 · 优化 · 匹配</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${hasKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {hasKey ? `${provider === 'claude' ? 'Claude' : 'GPT'} 已连接` : '未设置 API Key'}
            </span>
            <button onClick={() => setShowModal(true)}
              className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
              ⚙️
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex gap-1 -mb-px">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!hasKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium mb-1">🔑 请先设置 API Key</p>
            <p className="text-xs text-amber-600 mb-3">点击右上角 ⚙️ 输入你的 Claude 或 OpenAI API Key。密钥仅存储在本地浏览器中。</p>
            <button onClick={() => setShowModal(true)} className="text-xs text-amber-700 underline">立即设置</button>
          </div>
        )}
        {tab === 'analyze' && <AnalyzeTab />}
        {tab === 'optimize' && <OptimizeTab />}
        {tab === 'template' && <TemplateTab />}
        {tab === 'history' && <HistoryTab />}
      </main>

      {showModal && <ApiKeyModal config={{ provider, key }} update={update} onClose={() => setShowModal(false)} />}
    </div>
  )
}
