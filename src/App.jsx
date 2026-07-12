import { useState, useEffect } from 'react'
import { TABS } from './lib/config'
import AnalyzeTab from './components/AnalyzeTab'
import OptimizeTab from './components/OptimizeTab'
import TemplateTab from './components/TemplateTab'
import HistoryTab from './components/HistoryTab'
import ApiSettings from './components/ApiSettings'
import useApiKey, { isRealMode } from './lib/useApiKey'

export default function App() {
  const [tab, setTab] = useState('analyze')
  const [showSettings, setShowSettings] = useState(false)
  const [realMode, setRealMode] = useState(isRealMode())
  const api = useApiKey()

  useEffect(() => {
    setRealMode(isRealMode())
  }, [showSettings])

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1a 100%)' }}>
      {/* Animated background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(ellipse, #d4a74a 0%, transparent 70%)' }} />
      </div>

      <header className="relative border-b border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#e8edf5', fontFamily: 'var(--font-heading)' }}>
              <span style={{ color: '#d4a74a' }}>✦</span> 简历优化器
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>简历分析 · 优化 · 匹配</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-3 py-1 rounded-full border font-medium cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: realMode ? 'rgba(74, 212, 122, 0.3)' : 'rgba(212, 167, 74, 0.3)',
                color: realMode ? '#4ad47a' : '#d4a74a',
                background: realMode ? 'rgba(74, 212, 122, 0.08)' : 'rgba(212, 167, 74, 0.08)',
              }}
              onClick={() => setShowSettings(true)}
            >
              {realMode ? `已连接 · ${api.provider || 'AI'}` : '未配置 API'}
            </span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex gap-1 -mb-px">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200"
                style={{
                  borderColor: tab === t.id ? '#d4a74a' : 'transparent',
                  color: tab === t.id ? '#d4a74a' : '#64748b',
                  fontFamily: 'var(--font-body)',
                }}>
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-6">
        {!realMode && (
          <div className="rounded-xl p-4 mb-6 flex items-start gap-3"
            style={{
              background: 'rgba(212, 167, 74, 0.04)',
              border: '1px solid rgba(212, 167, 74, 0.12)',
            }}>
            <span className="text-xl shrink-0" style={{ lineHeight: 1 }}>🔄</span>
            <div>
              <p className="text-sm font-medium mb-0.5" style={{ color: '#d4a74a' }}>当前为示例模式</p>
              <p className="text-xs" style={{ color: '#64748b' }}>
                点击右上角「未配置 API」配置 API Key 即可切换真实 AI 分析
              </p>
            </div>
          </div>
        )}

        <div className="transition-opacity duration-300" style={{ opacity: 1 }}>
          {tab === 'analyze' && <AnalyzeTab />}
          {tab === 'optimize' && <OptimizeTab />}
          {tab === 'template' && <TemplateTab />}
          {tab === 'history' && <HistoryTab />}
        </div>
      </main>

      {showSettings && <ApiSettings onClose={() => setShowSettings(false)} />}
    </div>
  )
}
