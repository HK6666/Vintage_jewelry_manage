import { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import { defaultEras, type EraItem } from '../data/collections'

export default function EraManagePage() {
  const [eras, setEras] = useState<EraItem[]>(defaultEras)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', nameEn: '', period: '', description: '' })

  const resetForm = () => {
    setForm({ name: '', nameEn: '', period: '', description: '' })
    setEditingId(null)
    setShowAdd(false)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.nameEn.trim()) return
    if (editingId !== null) {
      setEras(eras.map(e => e.id === editingId ? { ...e, ...form } : e))
    } else {
      const newId = Math.max(...eras.map(e => e.id), 0) + 1
      setEras([...eras, { id: newId, ...form, count: 0 }])
    }
    resetForm()
  }

  const handleEdit = (era: EraItem) => {
    setForm({ name: era.name, nameEn: era.nameEn, period: era.period, description: era.description })
    setEditingId(era.id)
    setShowAdd(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: number) => {
    setEras(eras.filter(e => e.id !== id))
  }

  const totalCount = eras.reduce((sum, e) => sum + e.count, 0)

  return (
    <div className="fade-in">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink-800">年代管理</h2>
            <p className="text-ink-400 mt-1 text-sm">管理珠宝历史年代分类与时期信息</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAdd(true) }}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            添加年代
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="px-4 sm:px-6 md:px-8 grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="stat-card rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-ink-400">年代数</p>
          <p className="text-xl sm:text-2xl font-bold text-ink-800 font-heading mt-0.5 sm:mt-1">{eras.length}</p>
        </div>
        <div className="stat-card rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-ink-400">藏品总量</p>
          <p className="text-xl sm:text-2xl font-bold text-primary-600 font-heading mt-0.5 sm:mt-1">{totalCount.toLocaleString()}</p>
        </div>
        <div className="stat-card rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-ink-400">平均每代</p>
          <p className="text-xl sm:text-2xl font-bold text-ink-800 font-heading mt-0.5 sm:mt-1">{eras.length ? Math.round(totalCount / eras.length) : 0}</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showAdd && (
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <GlassCard>
            <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">
              {editingId !== null ? '编辑年代' : '添加年代'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">中文名称 <span className="text-accent-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="如：维多利亚时期"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">英文名称 <span className="text-accent-500">*</span></label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={e => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="如：Victorian"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">时间跨度</label>
                <input
                  type="text"
                  value={form.period}
                  onChange={e => setForm({ ...form, period: e.target.value })}
                  placeholder="如：1837–1901"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">描述</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="年代特征简述"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button onClick={handleSave} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">
                {editingId !== null ? '保存修改' : '确认添加'}
              </button>
              <button onClick={resetForm} className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">取消</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Mobile Card List (< md) */}
      <div className="md:hidden px-4 sm:px-6 pb-10 space-y-3">
        {eras.map(era => (
          <GlassCard key={era.id} className="!p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 mr-3">
                <h4 className="font-heading text-base font-semibold text-ink-800">{era.name}</h4>
                <p className="text-sm text-ink-500 mt-0.5">{era.nameEn} · {era.period}</p>
              </div>
              <span className="tag bg-primary-50 text-primary-600 flex-shrink-0">{era.count} 件</span>
            </div>
            <p className="text-sm text-ink-400 mb-3 line-clamp-2">{era.description}</p>
            <div className="flex items-center gap-4 pt-2 border-t border-ivory-200/60">
              <button
                onClick={() => handleEdit(era)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-ink-500 hover:text-primary-500 hover:bg-primary-50/50 active:bg-primary-50 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                编辑
              </button>
              <div className="w-px h-5 bg-ivory-200" />
              <button
                onClick={() => handleDelete(era.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-ink-500 hover:text-accent-500 hover:bg-accent-50/50 active:bg-accent-50 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                删除
              </button>
            </div>
          </GlassCard>
        ))}
        {eras.length === 0 && (
          <div className="text-center py-12 text-ink-400">
            <p>暂无年代数据</p>
            <p className="text-sm mt-1">点击"添加年代"开始录入</p>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Table (>= md) */}
      <div className="hidden md:block px-6 md:px-8 pb-10">
        <GlassCard className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ivory-200/80">
                  <th className="text-left px-6 py-4 font-medium text-ink-500">中文名称</th>
                  <th className="text-left px-6 py-4 font-medium text-ink-500">英文名称</th>
                  <th className="text-left px-6 py-4 font-medium text-ink-500">时间跨度</th>
                  <th className="text-left px-6 py-4 font-medium text-ink-500 hidden lg:table-cell">描述</th>
                  <th className="text-center px-6 py-4 font-medium text-ink-500">藏品数</th>
                  <th className="text-right px-6 py-4 font-medium text-ink-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {eras.map(era => (
                  <tr key={era.id} className="table-row border-b border-ivory-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-ink-800">{era.name}</td>
                    <td className="px-6 py-4 text-ink-600">{era.nameEn}</td>
                    <td className="px-6 py-4 text-ink-500">{era.period}</td>
                    <td className="px-6 py-4 text-ink-400 hidden lg:table-cell max-w-xs truncate">{era.description}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="tag bg-primary-50 text-primary-600">{era.count}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(era)}
                          className="text-ink-400 hover:text-primary-500 cursor-pointer p-2 rounded-lg hover:bg-primary-50/50"
                          title="编辑"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(era.id)}
                          className="text-ink-400 hover:text-accent-500 cursor-pointer p-2 rounded-lg hover:bg-accent-50/50"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {eras.length === 0 && (
            <div className="text-center py-12 text-ink-400">
              <p>暂无年代数据</p>
              <p className="text-sm mt-1">点击"添加年代"开始录入</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
