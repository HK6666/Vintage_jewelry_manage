import { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import { defaultCategories, type CategoryItem } from '../data/collections'

export default function CategoryManagePage() {
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', nameEn: '', description: '' })

  const resetForm = () => {
    setForm({ name: '', nameEn: '', description: '' })
    setEditingId(null)
    setShowAdd(false)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingId !== null) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, ...form } : c))
    } else {
      const newId = Math.max(...categories.map(c => c.id), 0) + 1
      setCategories([...categories, { id: newId, ...form, count: 0 }])
    }
    resetForm()
  }

  const handleEdit = (cat: CategoryItem) => {
    setForm({ name: cat.name, nameEn: cat.nameEn, description: cat.description })
    setEditingId(cat.id)
    setShowAdd(true)
  }

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id))
  }

  const totalCount = categories.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink-800">品类管理</h2>
            <p className="text-ink-400 mt-1 text-sm">管理首饰品类分类信息</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAdd(true) }}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer flex items-center gap-2 self-start"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            添加品类
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 md:px-8 grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">品类总数</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">{categories.length}</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">藏品总量</p>
          <p className="text-2xl font-bold text-primary-600 font-heading mt-1">{totalCount.toLocaleString()}</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center hidden lg:block">
          <p className="text-sm text-ink-400">平均每类</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">{categories.length ? Math.round(totalCount / categories.length) : 0}</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showAdd && (
        <div className="px-6 md:px-8 mb-6">
          <GlassCard>
            <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">
              {editingId !== null ? '编辑品类' : '添加品类'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">中文名称 <span className="text-accent-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="如：戒指"
                  className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">英文名称</label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={e => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="如：Ring"
                  className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">描述</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="品类包含的细分类型"
                  className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-xl text-sm font-medium cursor-pointer">
                {editingId !== null ? '保存修改' : '确认添加'}
              </button>
              <button onClick={resetForm} className="btn-secondary px-6 py-2 rounded-xl text-sm font-medium cursor-pointer">取消</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Cards Grid */}
      <div className="px-6 md:px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <GlassCard key={cat.id} className="!p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-heading text-lg font-semibold text-ink-800">{cat.name}</h4>
                  <p className="text-xs text-ink-400 mt-0.5">{cat.nameEn}</p>
                </div>
                <span className="tag bg-primary-50 text-primary-600 text-base font-semibold">{cat.count}</span>
              </div>
              <p className="text-sm text-ink-400 mb-4 line-clamp-2">{cat.description}</p>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-xs text-ink-400 hover:text-primary-500 cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs text-ink-400 hover:text-accent-500 cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  删除
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="text-center py-12 text-ink-400">
            <p>暂无品类数据</p>
            <p className="text-sm mt-1">点击"添加品类"开始录入</p>
          </div>
        )}
      </div>
    </div>
  )
}
