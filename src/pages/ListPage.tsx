import { useState, useCallback, useRef } from 'react'
import { useFetch } from '../api/hooks'
import { collectionsApi, categoriesApi, erasApi, materialsApi, brandsApi, colorsApi } from '../api/services'
import type { CollectionItem } from '../api/types'
import GlassCard from '../components/ui/GlassCard'

interface ListPageProps {
  onNavigate: (page: string) => void
}

const statusColorMap: Record<string, string> = {
  '完好': 'bg-green-50 text-green-700',
  '良好': 'bg-primary-50 text-primary-600',
  '一般': 'bg-yellow-50 text-yellow-700',
  '需修复': 'bg-accent-50 text-accent-600',
}

const selectArrowBg = "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B5B4A%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_1rem]"

export default function ListPage({ onNavigate }: ListPageProps) {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeCat, setActiveCat] = useState('全部')
  const pageSize = 10

  // Edit modal state
  const [editItem, setEditItem] = useState<CollectionItem | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const editFormRef = useRef<HTMLFormElement>(null)
  const [editTags, setEditTags] = useState<string[]>([])
  const [editTagInput, setEditTagInput] = useState('')

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { data: categories } = useFetch(() => categoriesApi.list())
  const { data: eras } = useFetch(() => erasApi.list())
  const { data: materials } = useFetch(() => materialsApi.list())
  const { data: brands } = useFetch(() => brandsApi.list())
  const { data: colors } = useFetch(() => colorsApi.list())

  const filterCategories = ['全部', ...(categories?.map(c => c.name) || [])]

  const fetchCollections = useCallback(() => {
    const params: Record<string, string | number> = { page, pageSize }
    if (keyword) params.keyword = keyword
    if (activeCat !== '全部') params.cat = activeCat
    return collectionsApi.list(params)
  }, [page, keyword, activeCat])

  const { data, loading, refetch } = useFetch(fetchCollections, [page, keyword, activeCat])

  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 0

  const handleSearch = () => {
    setKeyword(searchInput)
    setPage(1)
  }

  const handleCatFilter = (cat: string) => {
    setActiveCat(cat)
    setPage(1)
  }

  // Edit handlers
  const openEdit = (item: CollectionItem) => {
    setEditItem(item)
    setEditTags(item.tags || [])
    setEditTagInput('')
    setEditMessage(null)
  }

  const closeEdit = () => {
    setEditItem(null)
    setEditMessage(null)
  }

  const handleEditSubmit = async () => {
    const form = editFormRef.current
    if (!form || !editItem) return
    const fd = new FormData(form)
    const name = fd.get('name') as string
    if (!name?.trim()) {
      setEditMessage({ type: 'error', text: '请输入藏品名称' })
      return
    }

    setEditSaving(true)
    setEditMessage(null)
    try {
      await collectionsApi.update(editItem.id, {
        name: name.trim(),
        era: fd.get('era') || '',
        cat: fd.get('cat') || '',
        material: fd.get('material') || '',
        brand: fd.get('brand') || '',
        colorScheme: fd.get('colorScheme') || '',
        purchasePrice: Number(fd.get('purchasePrice')) || 0,
        estimatedValue: Number(fd.get('estimatedValue')) || 0,
        status: fd.get('status') || '完好',
        source: fd.get('source') || '',
        date: fd.get('date') || '',
        description: fd.get('description') || '',
        tags: editTags,
      })
      setEditMessage({ type: 'success', text: '更新成功' })
      refetch()
      setTimeout(closeEdit, 800)
    } catch (err) {
      setEditMessage({ type: 'error', text: err instanceof Error ? err.message : '更新失败' })
    } finally {
      setEditSaving(false)
    }
  }

  // Delete handlers
  const handleDelete = async () => {
    if (deleteId === null) return
    setDeleting(true)
    try {
      await collectionsApi.remove(deleteId)
      setDeleteId(null)
      refetch()
    } catch {
      // keep dialog open on error
    } finally {
      setDeleting(false)
    }
  }

  // Image handlers for edit modal
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleDeleteImage = async (imageId: number) => {
    if (!editItem) return
    try {
      await collectionsApi.deleteImage(editItem.id, imageId)
      setEditItem({ ...editItem, images: editItem.images.filter(img => img.id !== imageId) })
    } catch {
      setEditMessage({ type: 'error', text: '删除图片失败' })
    }
  }

  const handleEditFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !editItem) return
    try {
      const result = await collectionsApi.uploadImages(editItem.id, Array.from(files))
      setEditItem({ ...editItem, images: [...editItem.images, ...result.images] })
    } catch {
      setEditMessage({ type: 'error', text: '上传图片失败' })
    }
    e.target.value = ''
  }

  const renderPageButtons = () => {
    const buttons: JSX.Element[] = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)

    if (start > 1) {
      buttons.push(
        <button key={1} onClick={() => setPage(1)} className="px-3 py-1.5 rounded-lg text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer">1</button>
      )
      if (start > 2) buttons.push(<span key="el" className="text-ink-300 px-1">...</span>)
    }
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${i === page ? 'bg-primary-500 text-white' : 'text-ink-500 hover:bg-ivory-100'}`}
        >
          {i}
        </button>
      )
    }
    if (end < totalPages) {
      if (end < totalPages - 1) buttons.push(<span key="er" className="text-ink-300 px-1">...</span>)
      buttons.push(
        <button key={totalPages} onClick={() => setPage(totalPages)} className="px-3 py-1.5 rounded-lg text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer">{totalPages}</button>
      )
    }
    return buttons
  }

  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink-800">藏品列表</h2>
            <p className="text-ink-400 mt-1 text-sm">共 {total.toLocaleString()} 件藏品</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 text-ink-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="搜索藏品..."
                className="input-field rounded-xl pl-10 pr-4 py-2.5 text-sm w-64"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn-secondary p-2.5 rounded-xl cursor-pointer" title="搜索">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('entry')}
              className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              录入
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="px-6 md:px-8 flex flex-wrap gap-2 mb-6">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCatFilter(cat)}
            className={`tag cursor-pointer ${
              activeCat === cat
                ? 'bg-primary-500 text-white'
                : 'bg-white text-ink-500 border border-ivory-300 hover:border-primary-400 hover:text-primary-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="px-6 md:px-8 pb-10">
        <GlassCard className="!p-0 overflow-hidden">
          {loading && (
            <div className="text-center py-8 text-ink-400">加载中...</div>
          )}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ivory-200/60">
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">藏品</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">年代</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">品类</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">材质</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">品牌</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">色系</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">购入价格</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">预估价值</th>
                    <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">状态</th>
                    <th className="text-right px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="table-row border-b border-ivory-100/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.images?.length > 0 ? (
                            <img src={item.images[0].url} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-ivory-200 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                            </div>
                          )}
                          <span className="font-medium text-ink-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-500">{item.era}</td>
                      <td className="px-6 py-4">
                        <span className="tag bg-ivory-100 text-ink-600">{item.cat}</span>
                      </td>
                      <td className="px-6 py-4 text-ink-500">{item.material}</td>
                      <td className="px-6 py-4 text-ink-500">{item.brand || '—'}</td>
                      <td className="px-6 py-4">
                        {item.colorScheme ? <span className="tag bg-ivory-100 text-ink-600">{item.colorScheme}</span> : '—'}
                      </td>
                      <td className="px-6 py-4 font-medium text-ink-700">¥{typeof item.purchasePrice === 'number' ? item.purchasePrice.toLocaleString() : item.purchasePrice}</td>
                      <td className="px-6 py-4 font-medium text-ink-700">¥{typeof item.estimatedValue === 'number' ? item.estimatedValue.toLocaleString() : item.estimatedValue}</td>
                      <td className="px-6 py-4">
                        <span className={`tag ${statusColorMap[item.status] || 'bg-ivory-100 text-ink-600'}`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button onClick={() => openEdit(item)} className="text-ink-400 hover:text-primary-500 cursor-pointer p-1" title="编辑">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="text-ink-400 hover:text-accent-500 cursor-pointer p-1 ml-1" title="删除">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-ink-400">暂无藏品数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-ivory-200/60">
              <span className="text-sm text-ink-400">
                显示 {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} 共 {total.toLocaleString()} 条
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm text-ink-400 hover:bg-ivory-100 cursor-pointer disabled:opacity-40"
                >
                  上一页
                </button>
                {renderPageButtons()}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm text-ink-400 hover:bg-ivory-100 cursor-pointer disabled:opacity-40"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => !deleting && setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-ink-800 mb-2">确认删除</h3>
            <p className="text-sm text-ink-500 mb-6">确定要删除这件藏品吗？删除后可由管理员恢复。</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 cursor-pointer disabled:opacity-50"
              >
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => !editSaving && closeEdit()} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-ink-800">编辑藏品</h3>
              <button onClick={closeEdit} className="text-ink-400 hover:text-ink-600 cursor-pointer p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editMessage && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${editMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-accent-50 text-accent-600'}`}>
                {editMessage.text}
              </div>
            )}

            {/* Image section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink-600 mb-2">藏品图片</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {editItem.images?.map(img => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-ivory-100">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleDeleteImage(img.id)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <input ref={editFileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleEditFiles} />
              <button type="button" onClick={() => editFileInputRef.current?.click()} className="mt-3 btn-secondary px-4 py-2 rounded-xl text-sm cursor-pointer flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                添加图片
              </button>
            </div>

            <form ref={editFormRef} className="space-y-5" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">藏品名称 <span className="text-accent-500">*</span></label>
                  <input name="name" type="text" defaultValue={editItem.name} className="input-field w-full rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">年代</label>
                  <select name="era" defaultValue={editItem.era} className={`input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                    <option value="">请选择年代</option>
                    {(eras || []).map(era => (
                      <option key={era.id} value={era.nameEn}>{era.name} ({era.period})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">品类</label>
                  <select name="cat" defaultValue={editItem.cat} className={`input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                    <option value="">请选择品类</option>
                    {(categories || []).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">材质</label>
                  <select name="material" defaultValue={editItem.material} className={`input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                    <option value="">请选择材质</option>
                    {(materials || []).map(mat => (
                      <option key={mat.id} value={mat.name}>{mat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">品牌</label>
                  <select name="brand" defaultValue={editItem.brand} className={`input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                    <option value="">请选择品牌</option>
                    {(brands || []).map(brand => (
                      <option key={brand.id} value={brand.nameEn}>{brand.name} ({brand.nameEn})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">色系</label>
                  <select name="colorScheme" defaultValue={editItem.colorScheme} className={`input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                    <option value="">请选择色系</option>
                    {(colors || []).map(color => (
                      <option key={color.id} value={color.name}>{color.name} ({color.nameEn})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">保存状态</label>
                  <select name="status" defaultValue={editItem.status} className={`input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                    <option>完好</option>
                    <option>良好</option>
                    <option>一般</option>
                    <option>需修复</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">购入价格 (¥)</label>
                  <input name="purchasePrice" type="number" defaultValue={editItem.purchasePrice} className="input-field w-full rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">预估价值 (¥)</label>
                  <input name="estimatedValue" type="number" defaultValue={editItem.estimatedValue} className="input-field w-full rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">入手渠道</label>
                  <input name="source" type="text" defaultValue={editItem.source} className="input-field w-full rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 mb-1.5">入手日期</label>
                  <input name="date" type="date" defaultValue={editItem.date} className="input-field w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">藏品描述</label>
                <textarea name="description" rows={3} defaultValue={editItem.description} className="input-field w-full rounded-xl px-4 py-2.5 text-sm resize-none" />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map(tag => (
                    <span key={tag} className="tag bg-primary-50 text-primary-600 cursor-pointer hover:bg-primary-100" onClick={() => setEditTags(editTags.filter(t => t !== tag))}>
                      {tag}
                      <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="输入标签后按回车添加"
                  className="input-field w-full rounded-xl px-4 py-2.5 text-sm"
                  value={editTagInput}
                  onChange={e => setEditTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && editTagInput.trim()) {
                      e.preventDefault()
                      if (!editTags.includes(editTagInput.trim())) {
                        setEditTags([...editTags, editTagInput.trim()])
                      }
                      setEditTagInput('')
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeEdit} disabled={editSaving} className="px-5 py-2.5 rounded-xl text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer disabled:opacity-50">
                  取消
                </button>
                <button type="button" onClick={handleEditSubmit} disabled={editSaving} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50">
                  {editSaving ? '保存中...' : '保存修改'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
