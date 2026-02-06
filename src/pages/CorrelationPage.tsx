import GlassCard from '../components/ui/GlassCard'
import ForceGraph from '../components/graphs/ForceGraph'
import { correlationNodes, correlationLinks, correlationGroupColors } from '../data/graphData'

const selectArrowBg = "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B5B4A%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_1rem]"

export default function CorrelationPage() {
  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <h2 className="font-heading text-3xl font-bold text-ink-800">藏品关联</h2>
        <p className="text-ink-400 mt-1 text-sm">探索藏品之间的隐秘联系</p>
      </div>

      {/* Filter bar */}
      <div className="px-6 md:px-8 flex flex-wrap gap-3 mb-6">
        <select className={`input-field rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg} pr-10`}>
          <option>关联维度：材质</option>
          <option>关联维度：年代</option>
          <option>关联维度：工艺</option>
          <option>关联维度：品牌</option>
        </select>
        <select className={`input-field rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg} pr-10`}>
          <option>年代：全部</option>
          <option>Victorian</option>
          <option>Art Nouveau</option>
          <option>Art Deco</option>
          <option>Retro</option>
        </select>
        <button className="btn-secondary px-4 py-2.5 rounded-xl text-sm cursor-pointer">重新分析</button>
      </div>

      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {/* Correlation Graph */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">关联网络图</h3>
          <ForceGraph
            nodes={correlationNodes}
            links={correlationLinks}
            groupColors={correlationGroupColors}
            height={500}
            linkDistance={120}
            chargeStrength={-300}
            variant="correlation"
          />
        </GlassCard>

        {/* Correlation Details */}
        <div className="space-y-5">
          <GlassCard className="!p-5">
            <h4 className="font-heading font-semibold text-ink-800 mb-4">强关联组</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink-700">钻石 - Art Deco</span>
                  <span className="text-xs font-semibold text-primary-600">92%</span>
                </div>
                <div className="w-full h-1.5 bg-ivory-200 rounded-full">
                  <div className="h-full bg-primary-400 rounded-full" style={{ width: '92%' }} />
                </div>
                <p className="text-xs text-ink-400 mt-1.5">共 168 件藏品共享此关联</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-50/50 border border-accent-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink-700">铂金 - Edwardian</span>
                  <span className="text-xs font-semibold text-accent-600">87%</span>
                </div>
                <div className="w-full h-1.5 bg-ivory-200 rounded-full">
                  <div className="h-full bg-accent-400 rounded-full" style={{ width: '87%' }} />
                </div>
                <p className="text-xs text-ink-400 mt-1.5">共 98 件藏品共享此关联</p>
              </div>
              <div className="p-3 rounded-xl bg-ivory-100/50 border border-ivory-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink-700">珐琅 - Art Nouveau</span>
                  <span className="text-xs font-semibold text-ink-600">78%</span>
                </div>
                <div className="w-full h-1.5 bg-ivory-200 rounded-full">
                  <div className="h-full bg-ink-400 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-xs text-ink-400 mt-1.5">共 72 件藏品共享此关联</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="!p-5">
            <h4 className="font-heading font-semibold text-ink-800 mb-4">关联洞察</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1 rounded-full bg-primary-400 flex-shrink-0" />
                <p className="text-sm text-ink-500">Art Deco 时期大量使用钻石微镶工艺，几何造型为标志性设计语言</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1 rounded-full bg-accent-400 flex-shrink-0" />
                <p className="text-sm text-ink-500">Edwardian 时期铂金首次广泛用于珠宝，搭配珍珠和花丝工艺</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1 rounded-full bg-ink-300 flex-shrink-0" />
                <p className="text-sm text-ink-500">Art Nouveau 珐琅胸针以 Lalique 和 Fouquet 作品为代表，自然主义风格显著</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
