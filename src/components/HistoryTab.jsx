import { useState, useEffect } from 'react'
import { getHistory, deleteHistoryItem } from '../lib/api'

export default function HistoryTab() {
  const [items, setItems] = useState([])

  useEffect(() => { setItems(getHistory()) }, [])

  const handleDelete = (id) => { deleteHistoryItem(id); setItems(getHistory()) }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">📂</p>
        <p className="text-sm">还没有分析记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="border rounded-xl overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">{item.type}</span>
              <span className="text-gray-500">{item.name}</span>
              <span className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 hover:text-red-600">删除</button>
          </div>
          <div className="px-4 py-3">
            <pre className="text-sm whitespace-pre-wrap font-sans line-clamp-3">{item.content}</pre>
          </div>
        </div>
      ))}
    </div>
  )
}
