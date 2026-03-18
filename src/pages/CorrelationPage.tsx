import { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import ForceGraph from '../components/graphs/ForceGraph'
import ErrorBanner from '../components/ui/ErrorBanner'
import { useFetch } from '../api/hooks'
import { correlationsApi } from '../api/services'
import type { GraphNode, GraphLink } from '../data/graphData'

const selectArrowBg = "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B5B4A%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_1rem]"

const dimensionOptions = [
  { label: '材质', value: 'material' },
  { label: '年代', value: 'era' },
  { label: '工艺', value: 'craft' },
  { label: '品牌', value: 'brand' },
]

const eraOptions = ['', 'Victorian', 'Art Nouveau', 'Art Deco', 'Retro']

export default function CorrelationPage() {
  const [dimension, setDimension] = useState('material')
  const [era, setEra] = useState('')

  const { data: graphData, error: graphErr, refetch: refetchGraph } = useFetch(
    () => correlationsApi.getGraph({ dimension, era: era || undefined }),
    [dimension, era]
  )
  const { data: strongPairs, error: pairsErr, refetch: refetchPairs } = useFetch(
    () => correlationsApi.getStrongPairs({ limit: 5, dimension }),
    [dimension]
  )

  const error = graphErr || pairsErr

  const nodes: GraphNode[] = graphData?.nodes || []
  const links: GraphLink[] = graphData?.links || []
  const groupColors = graphData?.groupColors || {}

  const pairColors = ['bg-primary-50/50 border-primary-100', 'bg-accent-50/50 border-accent-100', 'bg-ivory-100/50 border-ivory-200']
  const pairTextColors = ['text-primary-600', 'text-accent-600', 'text-ink-600']
  const pairBarColors = ['bg-primary-400', 'bg-accent-400', 'bg-ink-400']

  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <h2 className="font-heading text-3xl font-bold text-ink-800">藏品关联</h2>
        <p className="text-ink-400 mt-1 text-sm">探索藏品之间的隐秘联系</p>
      </div>

      <ErrorBanner message={error} />

      {/* Filter bar */}
      <div className="px-6 md:px-8 flex flex-wrap gap-3 mb-6">
        <select
          value={dimension}
          onChange={e => setDimension(e.target.value)}
          className={`input-field rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg} pr-10`}
        >
          {dimensionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>关联维度：{opt.label}</option>
          ))}
        </select>
        <select
          value={era}
          onChange={e => setEra(e.target.value)}
          className={`input-field rounded-xl px-4 py-2.5 text-sm cursor-pointer appearance-none ${selectArrowBg} pr-10`}
        >
          {eraOptions.map(e => (
            <option key={e} value={e}>{e ? e : '年代：全部'}</option>
          ))}
        </select>
        <button
          onClick={() => { refetchGraph(); refetchPairs() }}
          className="btn-secondary px-4 py-2.5 rounded-xl text-sm cursor-pointer"
        >
          重新分析
        </button>
      </div>

      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {/* Correlation Graph */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">关联网络图</h3>
          {nodes.length > 0 ? (
            <ForceGraph
              nodes={nodes}
              links={links}
              groupColors={groupColors}
              height={500}
              linkDistance={120}
              chargeStrength={-300}
              variant="correlation"
            />
          ) : (
            <div className="flex items-center justify-center h-[500px] text-ink-400">加载中...</div>
          )}
        </GlassCard>

        {/* Correlation Details */}
        <div className="space-y-5">
          <GlassCard className="!p-5">
            <h4 className="font-heading font-semibold text-ink-800 mb-4">强关联组</h4>
            <div className="space-y-3">
              {(strongPairs || []).slice(0, 3).map((pair, i) => (
                <div key={`${pair.nodeA}-${pair.nodeB}`} className={`p-3 rounded-xl border ${pairColors[i % pairColors.length]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-ink-700">{pair.nodeA} - {pair.nodeB}</span>
                    <span className={`text-xs font-semibold ${pairTextColors[i % pairTextColors.length]}`}>{Math.round(pair.strength * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-ivory-200 rounded-full">
                    <div className={`h-full rounded-full ${pairBarColors[i % pairBarColors.length]}`} style={{ width: `${pair.strength * 100}%` }} />
                  </div>
                  <p className="text-xs text-ink-400 mt-1.5">共 {pair.sharedCount} 件藏品共享此关联</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-5">
            <h4 className="font-heading font-semibold text-ink-800 mb-4">关联洞察</h4>
            <div className="space-y-3">
              {(strongPairs || []).filter(p => p.insight).slice(0, 3).map((pair, i) => (
                <div key={`insight-${pair.nodeA}-${pair.nodeB}`} className="flex gap-3">
                  <div className={`w-1 rounded-full flex-shrink-0 ${pairBarColors[i % pairBarColors.length]}`} />
                  <p className="text-sm text-ink-500">{pair.insight}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
