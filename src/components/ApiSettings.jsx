import { useState } from 'react'
import useApiKey, { setApiConfig, clearApiConfig, DEFAULT_PROVIDERS } from '../lib/useApiKey'

export default function ApiSettings({ onClose }) {
  const current = useApiKey()
  const [provider, setProvider] = useState(current.config?.provider || '')
  const [apiKey, setApiKey] = useState(current.config?.apiKey || '')
  const [endpoint, setEndpoint] = useState(current.config?.endpoint || '')
  const [model, setModel] = useState(current.config?.model || '')
  const [customMode, setCustomMode] = useState(!!(current.config && !DEFAULT_PROVIDERS[current.config?.provider]))
  const [saved, setSaved] = useState(false)

  const handleSelectProvider = (key) => {
    setProvider(key)
    setCustomMode(false)
    const p = DEFAULT_PROVIDERS[key]
    if (p) { setEndpoint(p.endpoint); setModel(p.model) }
  }

  const handleSave = () => {
    if (!apiKey.trim()) return
    setApiConfig({
      provider: customMode ? 'custom' : provider,
      apiKey: apiKey.trim(),
      endpoint: endpoint.trim(),
      model: model.trim() || 'gpt-4o-mini',
    })
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  const handleClear = () => {
    clearApiConfig()
    setApiKey(''); setEndpoint(''); setModel(''); setProvider('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-xl"
        style={{ background: '#1a1f2e', border: '1px solid #2a2f3e' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #2a2f3e' }}>
          <h2 className="text-base font-semibold" style={{ color: '#e8edf5' }}>AI 配置</h2>
          <button onClick={onClose} className="text-sm" style={{ color: '#64748b' }}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {saved ? (
            <div className="text-center py-8">
              <span className="text-3xl">✅</span>
              <p className="mt-2 font-medium" style={{ color: '#4ad47a' }}>配置已保存</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>选择服务商</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DEFAULT_PROVIDERS).map(([key, p]) => (
                    <button key={key} onClick={() => handleSelectProvider(key)}
                      className="p-2.5 rounded-lg border text-sm font-medium transition-all duration-200"
                      style={{
                        borderColor: provider === key && !customMode ? '#d4a74a' : '#2a2f3e',
                        background: provider === key && !customMode ? 'rgba(212, 167, 74, 0.08)' : '#1a1f2e',
                        color: provider === key && !customMode ? '#d4a74a' : '#94a3b8',
                      }}>{p.name}</button>
                  ))}
                  <button onClick={() => { setCustomMode(true); setProvider('custom') }}
                    className="p-2.5 rounded-lg border text-sm font-medium transition-all duration-200"
                    style={{
                      borderColor: customMode ? '#d4a74a' : '#2a2f3e',
                      background: customMode ? 'rgba(212, 167, 74, 0.08)' : '#1a1f2e',
                      color: customMode ? '#d4a74a' : '#94a3b8',
                    }}>自定义</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#94a3b8' }}>
                  API Key <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..." className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: '#0f172a', borderColor: '#2a2f3e', color: '#e8edf5' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#94a3b8' }}>接口地址</label>
                <input type="text" value={endpoint} onChange={e => setEndpoint(e.target.value)}
                  placeholder="https://api.openai.com/v1/chat/completions"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: customMode ? '#0f172a' : '#1a1f2e',
                    borderColor: '#2a2f3e', color: '#e8edf5',
                    cursor: customMode ? 'text' : 'not-allowed',
                  }}
                  readOnly={!customMode} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#94a3b8' }}>模型</label>
                <input type="text" value={model} onChange={e => setModel(e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: customMode ? '#0f172a' : '#1a1f2e',
                    borderColor: '#2a2f3e', color: '#e8edf5',
                    cursor: customMode ? 'text' : 'not-allowed',
                  }}
                  readOnly={!customMode} />
              </div>

              <p className="text-xs" style={{ color: '#64748b' }}>
                API Key 仅存储在浏览器本地，不会上传到任何服务器。
              </p>

              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={!apiKey.trim()}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: apiKey.trim() ? '#d4a74a' : '#2a2f3e',
                    color: apiKey.trim() ? '#0f172a' : '#64748b',
                  }}>保存配置</button>
                {current.config && (
                  <button onClick={handleClear}
                    className="px-4 py-2 rounded-lg text-sm font-medium border"
                    style={{ borderColor: '#2a2f3e', color: '#94a3b8' }}>清除</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
