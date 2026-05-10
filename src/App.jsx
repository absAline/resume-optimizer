import { useState } from 'react'
import { TABS } from './lib/config'
import AnalyzeTab from './components/AnalyzeTab'
import OptimizeTab from './components/OptimizeTab'
import TemplateTab from './components/TemplateTab'
import HistoryTab from './components/HistoryTab'

export default function App() {
  const [tab, setTab] = useState('analyze')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">📄 AI 简历优化器</h1>
          <p className="text-xs text-gray-400">AI 驱动的简历分析 · 优化 · 匹配</p>
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
        {tab === 'analyze' && <AnalyzeTab />}
        {tab === 'optimize' && <OptimizeTab />}
        {tab === 'template' && <TemplateTab />}
        {tab === 'history' && <HistoryTab />}
      </main>
    </div>
  )
}
