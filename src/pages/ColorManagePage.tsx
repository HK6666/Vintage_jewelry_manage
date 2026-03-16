import { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import ErrorBanner from '../components/ui/ErrorBanner'
import { useFetch } from '../api/hooks'
import { colorsApi } from '../api/services'
import type { ColorItem } from '../api/types'

export default function ColorManagePage() {
  const { data: colors, error, refetch } = useFetch(() => colorsApi.list())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', nameEn: '', hex: '#D4A853', description: '' })

  const items = colors || []

  const resetForm = () => { setForm({ name: '', nameEn: '', hex: '#D4A853', description: '' }); setEditingId(null); setShowAdd(false) }

  const handleSave = async () => {
    if (!form.name.trim()) return
    try {
      if (editingId !== null) { await colorsApi.update(editingId, form) } else { await colorsApi.create(form) }
      resetForm(); refetch()
    } catch { /* ignore */ }
  }

  const handleEdit = (color: ColorItem) => {
    setForm({ name: color.name, nameEn: color.nameEn, hex: color.hex, description: color.description })
    setEditingId(color.id); setShowAdd(true); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => { if (!window.confirm('确定要删除吗？')) return; try { await colorsApi.remove(id); refetch() } catch { /* ignore */ } }

  const isGradient = (hex: string) => hex.startsWith('linear-gradient')

  return (
    <div className="fade-in">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink-800">色系管理</h2>
            <p className="text-ink-400 mt-1 text-sm">管理藏品的色彩分类体系</p>
          </div>
          <button onClick={() => { resetForm(); setShowAdd(true) }} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
            添加色系
          </button>
        </div>
      </div>

      <ErrorBanner message={error} />

      {showAdd && (
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <GlassCard>
            <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">{editingId !== null ? '编辑色系' : '添加色系'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">中文名称 <span className="text-accent-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="如：金色系" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">英文名称</label>
                <input type="text" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} placeholder="如：Gold" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">代表色值</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.hex.startsWith('#') ? form.hex : '#D4A853'} onChange={e => setForm({ ...form, hex: e.target.value })} className="w-10 h-10 rounded-lg border border-ivory-200 cursor-pointer flex-shrink-0" />
                  <input type="text" value={form.hex} onChange={e => setForm({ ...form, hex: e.target.value })} placeholder="#D4A853" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">描述</label>
                <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="色系特征简述" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button onClick={handleSave} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">{editingId !== null ? '保存修改' : '确认添加'}</button>
              <button onClick={resetForm} className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">取消</button>
            </div>
          </GlassCard>
        </div>
      )}

      <div className="px-4 sm:px-6 md:px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(color => (
            <GlassCard key={color.id} className="!p-0 overflow-hidden">
              <div className="h-20 w-full" style={{ background: color.hex, ...(color.hex === '#F5F5F5' ? { border: '1px solid #e5e5e5', borderBottom: 'none' } : {}) }} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-3">
                    <h4 className="font-heading text-base font-semibold text-ink-800">{color.name}</h4>
                    <p className="text-sm text-ink-500 mt-0.5">{color.nameEn}</p>
                  </div>
                  <span className="tag bg-primary-50 text-primary-600 flex-shrink-0">{color.count} 件</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {!isGradient(color.hex) && <span className="text-xs text-ink-400 font-mono">{color.hex}</span>}
                </div>
                <p className="text-sm text-ink-400 mb-3 line-clamp-2">{color.description}</p>
                <div className="flex items-center gap-4 pt-2 border-t border-ivory-200/60">
                  <button onClick={() => handleEdit(color)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-ink-500 hover:text-primary-500 hover:bg-primary-50/50 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    编辑
                  </button>
                  <div className="w-px h-5 bg-ivory-200" />
                  <button onClick={() => handleDelete(color.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-ink-500 hover:text-accent-500 hover:bg-accent-50/50 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    删除
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        {items.length === 0 && <div className="text-center py-12 text-ink-400"><p>暂无色系数据</p><p className="text-sm mt-1">点击"添加色系"开始录入</p></div>}
      </div>
    </div>
  )
}
