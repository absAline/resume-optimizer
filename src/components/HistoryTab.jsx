import { useState, useEffect } from 'react'
import { getHistory, deleteHistoryItem, clearAllHistory, canUseToday, isRealMode } from '../lib/api'

export default function HistoryTab() {
  const [items, setItems] = useState([])
  const usage = canUseToday()

  useEffect(() => { setItems(getHistory()) }, [])

  const handleDelete = (id) => { deleteHistoryItem(id); setItems(getHistory()) }
  const handleClearAll = () => { if (confirm('确定清空所有历史记录？')) { clearAllHistory(); setItems([]) } }

  return (
    <div className="space-y-4">
      {/* Usage info */}
      {!isRealMode() && (
        <div className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(212, 167, 74, 0.04)', border: '1px solid rgba(212, 167, 74, 0.12)' }}>
          <span className="text-xs" style={{ color: '#94a3b8' }}>
            每日免费次数：<span style={{ color: usage.allowed ? '#4ad47a' : '#ef4444' }}>{usage.remaining}/{usage.total}</span>
          </span>
          {!usage.allowed && (
            <span className="text-xs" style={{ color: '#d4a74a' }}>配置 API 可解除限制</span>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12" style={{color: '#475569'}}>
          <p className="text-4xl mb-2">📂</p>
          <p className="text-sm">还没有分析记录</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: '#64748b' }}>共 {items.length} 条记录</span>
            <button onClick={handleClearAll} className="text-xs" style={{ color: '#ef4444' }}>清空全部</button>
          </div>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="card-premium p-0 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2"
                  style={{ background: 'rgba(15, 23, 42, 0.5)', borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded text-xs font-medium tag-premium">{item.type}</span>
                    <span style={{color: '#94a3b8'}}>{item.name}</span>
                    <span className="text-xs" style={{color: '#475569'}}>{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-xs" style={{color: '#e8564a'}}>删除</button>
                </div>
                <div className="px-4 py-3">
                  <pre className="text-sm whitespace-pre-wrap font-sans line-clamp-3" style={{color: '#94a3b8'}}>{item.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
