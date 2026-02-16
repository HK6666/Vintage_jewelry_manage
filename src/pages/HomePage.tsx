import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { chartColors, defaultScales } from '../data/chartConfig'
import { useFetch } from '../api/hooks'
import { dashboardApi, collectionsApi } from '../api/services'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import ChartWrapper from '../components/charts/ChartWrapper'

interface HomePageProps {
  onNavigate: (page: string) => void
}

const sparkleIcon = (
  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)

const heartIcon = (
  <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
)

const sunIcon = (
  <svg className="w-6 h-6 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
)

const recentIconCycle = [
  { icon: sparkleIcon, gradientFrom: 'from-primary-200', gradientTo: 'to-primary-100', tagClass: 'bg-primary-50 text-primary-600' },
  { icon: heartIcon, gradientFrom: 'from-accent-100', gradientTo: 'to-accent-50', tagClass: 'bg-accent-50 text-accent-600' },
  { icon: sunIcon, gradientFrom: 'from-ivory-300', gradientTo: 'to-ivory-200', tagClass: 'bg-ivory-200 text-ink-600' },
]

const trendUp = (text: string) => (
  <p className="text-xs text-primary-500 flex items-center gap-1">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
    {text}
  </p>
)

function formatValue(val: number): string {
  if (val >= 1_000_000) return `¥${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `¥${(val / 1_000).toFixed(0)}K`
  return `¥${val}`
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: stats } = useFetch(() => dashboardApi.getStats())
  const { data: trend } = useFetch(() => dashboardApi.getIntakeTrend())
  const { data: catDist } = useFetch(() => dashboardApi.getCategoryDistribution())
  const { data: eraDist } = useFetch(() => dashboardApi.getEraDistribution())
  const { data: recentItems } = useFetch(() => collectionsApi.getRecent(4))

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink-800">首页概览</h2>
            <p className="text-ink-400 mt-1 text-sm">欢迎回来，这里是您的欧美中古珠宝世界</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="藏品总量"
          value={stats ? stats.totalCount.toLocaleString() : '—'}
          iconBg="bg-primary-50"
          icon={
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
          trend={stats ? trendUp(`较上月 ${stats.totalCountChange >= 0 ? '+' : ''}${stats.totalCountChange}`) : null}
        />
        <StatCard
          label="估值总额"
          value={stats ? formatValue(stats.totalValue) : '—'}
          iconBg="bg-accent-50"
          icon={
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={stats ? trendUp(`估值增长 ${stats.totalValueChangePercent}%`) : null}
        />
        <StatCard
          label="年代跨度"
          value={stats ? String(stats.eraCount) : '—'}
          iconBg="bg-ivory-200"
          icon={
            <svg className="w-5 h-5 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={stats ? <p className="text-xs text-ink-400">{stats.eraNames.join(' · ')}</p> : null}
        />
        <StatCard
          label="本月新增"
          value={stats ? String(stats.monthlyNew) : '—'}
          iconBg="bg-primary-50"
          icon={
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
          trend={stats ? trendUp(`较上月 ${stats.monthlyNewChange >= 0 ? '+' : ''}${stats.monthlyNewChange}`) : null}
        />
      </div>

      {/* Charts Row */}
      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-ink-800">藏品入库趋势</h3>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white cursor-pointer">月度</button>
              <button className="text-xs px-3 py-1.5 rounded-lg text-ink-400 hover:bg-ivory-100 cursor-pointer">季度</button>
            </div>
          </div>
          <ChartWrapper height={220}>
            <Line
              data={{
                labels: trend?.labels || [],
                datasets: [{
                  label: '入库数量',
                  data: trend?.values || [],
                  borderColor: chartColors.gold,
                  backgroundColor: chartColors.goldBg,
                  fill: true,
                  tension: 0.4,
                  borderWidth: 2,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: chartColors.gold,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: defaultScales,
                interaction: { intersect: false, mode: 'index' },
              }}
            />
          </ChartWrapper>
        </GlassCard>

        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-6">品类分布</h3>
          <ChartWrapper height={220}>
            <Doughnut
              data={{
                labels: catDist?.map(c => c.name) || [],
                datasets: [{
                  data: catDist?.map(c => c.count) || [],
                  backgroundColor: [chartColors.gold, chartColors.wine, chartColors.goldLight, chartColors.green, chartColors.blue, chartColors.amber, chartColors.wineLight],
                  borderWidth: 0,
                  hoverOffset: 6,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } } },
              }}
            />
          </ChartWrapper>
        </GlassCard>
      </div>

      {/* Recent & Era Distribution */}
      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* Recent Items */}
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-lg font-semibold text-ink-800">最近录入</h3>
            <button
              onClick={() => onNavigate('list')}
              className="text-xs text-primary-500 hover:text-primary-600 cursor-pointer"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {(recentItems || []).map((item, idx) => {
              const mapping = recentIconCycle[idx % recentIconCycle.length]
              return (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-ivory-50 transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mapping.gradientFrom} ${mapping.gradientTo} flex items-center justify-center flex-shrink-0`}>
                    {mapping.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{item.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{item.era} · {item.material}</p>
                  </div>
                  <span className={`tag ${mapping.tagClass}`}>
                    ¥{typeof item.purchasePrice === 'number' ? item.purchasePrice.toLocaleString() : item.purchasePrice}
                  </span>
                </div>
              )
            })}
            {recentItems && recentItems.length === 0 && (
              <p className="text-sm text-ink-400 text-center py-4">暂无藏品数据</p>
            )}
          </div>
        </GlassCard>

        {/* Era Distribution */}
        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-5">年代藏量分布</h3>
          <ChartWrapper height={260}>
            <Bar
              data={{
                labels: eraDist?.map(e => e.nameEn || e.name) || [],
                datasets: [{
                  label: '藏品数',
                  data: eraDist?.map(e => e.count) || [],
                  backgroundColor: [
                    'rgba(196,135,46,0.7)', 'rgba(139,34,64,0.7)', 'rgba(91,106,191,0.7)',
                    'rgba(74,124,89,0.7)', 'rgba(184,134,11,0.7)', 'rgba(160,107,30,0.7)',
                  ],
                  borderRadius: 8,
                  borderSkipped: false,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  ...defaultScales,
                  y: { ...defaultScales.y, beginAtZero: true },
                },
              }}
            />
          </ChartWrapper>
        </GlassCard>
      </div>
    </div>
  )
}
