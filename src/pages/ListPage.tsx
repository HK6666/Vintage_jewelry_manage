import { collectionItems, filterCategories } from '../data/collections'
import GlassCard from '../components/ui/GlassCard'

interface ListPageProps {
  onNavigate: (page: string) => void
}

export default function ListPage({ onNavigate }: ListPageProps) {
  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink-800">藏品列表</h2>
            <p className="text-ink-400 mt-1 text-sm">共 1,284 件藏品</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 text-ink-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input type="text" placeholder="搜索藏品..." className="input-field rounded-xl pl-10 pr-4 py-2.5 text-sm w-64" />
            </div>
            <button className="btn-secondary p-2.5 rounded-xl cursor-pointer" title="筛选">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
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
        {filterCategories.map((cat, i) => (
          <button
            key={cat}
            className={`tag cursor-pointer ${
              i === 0
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ivory-200/60">
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">藏品</th>
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">年代</th>
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">品类</th>
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">材质</th>
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">购入价格</th>
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">预估价值</th>
                  <th className="text-left px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">状态</th>
                  <th className="text-right px-6 py-4 text-ink-400 font-medium text-xs uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                {collectionItems.map((item) => (
                  <tr key={item.name} className="table-row border-b border-ivory-100/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-ivory-200 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                        </div>
                        <span className="font-medium text-ink-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-500">{item.era}</td>
                    <td className="px-6 py-4">
                      <span className="tag bg-ivory-100 text-ink-600">{item.cat}</span>
                    </td>
                    <td className="px-6 py-4 text-ink-500">{item.material}</td>
                    <td className="px-6 py-4 font-medium text-ink-700">{item.purchasePrice}</td>
                    <td className="px-6 py-4 font-medium text-ink-700">{item.estimatedValue}</td>
                    <td className="px-6 py-4">
                      <span className={`tag ${item.statusColor}`}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-ink-400 hover:text-primary-500 cursor-pointer p-1" title="查看详情">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button className="text-ink-400 hover:text-primary-500 cursor-pointer p-1 ml-1" title="编辑">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-ivory-200/60">
            <span className="text-sm text-ink-400">显示 1-10 共 1,284 条</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-lg text-sm text-ink-400 hover:bg-ivory-100 cursor-pointer">上一页</button>
              <button className="px-3 py-1.5 rounded-lg text-sm bg-primary-500 text-white cursor-pointer">1</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer">2</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer">3</button>
              <span className="text-ink-300 px-1">...</span>
              <button className="px-3 py-1.5 rounded-lg text-sm text-ink-500 hover:bg-ivory-100 cursor-pointer">129</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-ink-400 hover:bg-ivory-100 cursor-pointer">下一页</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
