import GlassCard from '../components/ui/GlassCard'
import ForceGraph from '../components/graphs/ForceGraph'
import {
  knowledgeNodes,
  knowledgeLinks,
  knowledgeGroupColors,
  knowledgeGroupLabels,
} from '../data/graphData'

const legendItems = [
  { label: '藏品', color: '#C4872E' },
  { label: '年代', color: '#8B2240' },
  { label: '材质', color: '#4A7C59' },
  { label: '工艺', color: '#5B6ABF' },
  { label: '品类', color: '#B8860B' },
]

export default function KnowledgePage() {
  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink-800">知识图谱</h2>
            <p className="text-ink-400 mt-1 text-sm">可视化藏品间的多维知识网络</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-zoom="in"
              className="btn-secondary px-4 py-2 rounded-xl text-sm cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              放大
            </button>
            <button
              data-zoom="out"
              className="btn-secondary px-4 py-2 rounded-xl text-sm cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
              </svg>
              缩小
            </button>
            <button
              data-zoom="reset"
              className="btn-secondary px-4 py-2 rounded-xl text-sm cursor-pointer"
            >
              重置视图
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 md:px-8 flex flex-wrap gap-4 mb-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-ink-500">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Knowledge Graph */}
      <div className="px-6 md:px-8 pb-10">
        <GlassCard className="!p-0 overflow-hidden">
          <ForceGraph
            nodes={knowledgeNodes}
            links={knowledgeLinks}
            groupColors={knowledgeGroupColors}
            height={600}
            linkDistance={100}
            chargeStrength={-200}
            showZoomControls={true}
            groupLabels={knowledgeGroupLabels}
            variant="knowledge"
          />
        </GlassCard>
      </div>
    </div>
  )
}
