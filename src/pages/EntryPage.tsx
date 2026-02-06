import GlassCard from '../components/ui/GlassCard'

const selectArrowBg = "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B5B4A%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_1rem]"

export default function EntryPage() {
  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <h2 className="font-heading text-3xl font-bold text-ink-800">藏品录入</h2>
        <p className="text-ink-400 mt-1 text-sm">记录每一件珍贵的藏品信息</p>
      </div>

      <div className="px-6 md:px-8 pb-10">
        <GlassCard className="md:p-8 max-w-4xl">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-ivory-200/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">1</div>
              <span className="text-sm font-medium text-ink-700">基本信息</span>
            </div>
            <div className="flex-1 h-px bg-ivory-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-ivory-300 text-ink-500 flex items-center justify-center text-sm font-semibold">2</div>
              <span className="text-sm text-ink-400">详细参数</span>
            </div>
            <div className="flex-1 h-px bg-ivory-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-ivory-300 text-ink-500 flex items-center justify-center text-sm font-semibold">3</div>
              <span className="text-sm text-ink-400">影像资料</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  藏品名称 <span className="text-accent-500">*</span>
                </label>
                <input type="text" placeholder="例：Cartier Art Deco 钻石胸针" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">编号</label>
                <input type="text" placeholder="自动生成或手动输入" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  年代 <span className="text-accent-500">*</span>
                </label>
                <select className={`input-field w-full rounded-xl px-4 py-3 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                  <option value="">请选择年代</option>
                  <option>Georgian (1714-1837)</option>
                  <option>Victorian (1837-1901)</option>
                  <option>Art Nouveau (1890-1910)</option>
                  <option>Edwardian (1901-1915)</option>
                  <option>Art Deco (1920-1935)</option>
                  <option>Retro (1935-1950)</option>
                  <option>Mid-Century (1950-1970)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  品类 <span className="text-accent-500">*</span>
                </label>
                <select className={`input-field w-full rounded-xl px-4 py-3 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                  <option value="">请选择品类</option>
                  <option>戒指</option>
                  <option>项链</option>
                  <option>手链</option>
                  <option>胸针</option>
                  <option>耳饰</option>
                  <option>吊坠</option>
                  <option>冠冕</option>
                  <option>套件</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">主要材质</label>
                <select className={`input-field w-full rounded-xl px-4 py-3 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                  <option value="">请选择材质</option>
                  <option>黄金</option>
                  <option>铂金</option>
                  <option>纯银</option>
                  <option>钻石</option>
                  <option>红宝石</option>
                  <option>蓝宝石</option>
                  <option>祖母绿</option>
                  <option>珍珠</option>
                  <option>蛋白石</option>
                  <option>珐琅</option>
                  <option>其他</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">估值 (¥)</label>
                <input type="number" placeholder="输入估值金额" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">保存状态</label>
                <select className={`input-field w-full rounded-xl px-4 py-3 text-sm cursor-pointer appearance-none ${selectArrowBg}`}>
                  <option value="">请选择</option>
                  <option>完好</option>
                  <option>良好</option>
                  <option>一般</option>
                  <option>需修复</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">入手渠道</label>
                <input type="text" placeholder="例：Christie's、古董商、遗产拍卖" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">入手日期</label>
                <input type="date" className="input-field w-full rounded-xl px-4 py-3 text-sm cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-600 mb-2">藏品描述</label>
              <textarea
                rows={4}
                placeholder="描述藏品的工艺特点、品牌历史、风格流派、宝石参数等详细信息..."
                className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-ink-600 mb-2">藏品图片</label>
              <div className="border-2 border-dashed border-ivory-400 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <svg className="w-10 h-10 text-ink-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM10.5 8.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <p className="text-sm text-ink-400">点击或拖拽上传图片</p>
                <p className="text-xs text-ink-300 mt-1">支持 JPG、PNG 格式，单张不超过 10MB</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-ink-600 mb-2">标签</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="tag bg-primary-50 text-primary-600 cursor-pointer hover:bg-primary-100">
                  宫廷
                  <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span className="tag bg-accent-50 text-accent-600 cursor-pointer hover:bg-accent-100">
                  镶嵌
                  <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </div>
              <input type="text" placeholder="输入标签后按回车添加" className="input-field w-full rounded-xl px-4 py-3 text-sm" />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button type="button" className="btn-primary px-8 py-3 rounded-xl text-sm font-medium cursor-pointer">保存藏品</button>
              <button type="button" className="btn-secondary px-8 py-3 rounded-xl text-sm font-medium cursor-pointer">保存并继续</button>
              <button type="reset" className="text-sm text-ink-400 hover:text-ink-600 cursor-pointer ml-auto">重置表单</button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
