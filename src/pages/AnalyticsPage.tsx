import { Bar, Doughnut, PolarArea, Line } from 'react-chartjs-2'
import { chartColors, defaultScales } from '../data/chartConfig'
import { useFetch } from '../api/hooks'
import { analyticsApi } from '../api/services'
import GlassCard from '../components/ui/GlassCard'
import ChartWrapper from '../components/charts/ChartWrapper'

function formatValue(val: number): string {
  if (val >= 1_000_000) return `¥${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `¥${(val / 1_000).toFixed(0)}K`
  return `¥${val}`
}

export default function AnalyticsPage() {
  const { data: summary } = useFetch(() => analyticsApi.getSummary())
  const { data: valueMat } = useFetch(() => analyticsApi.getValueByMaterial())
  const { data: heatmap } = useFetch(() => analyticsApi.getEraCategoryHeatmap())
  const { data: statusDist } = useFetch(() => analyticsApi.getStatusDistribution())
  const { data: sourceDist } = useFetch(() => analyticsApi.getSourceDistribution())
  const { data: valueTrend } = useFetch(() => analyticsApi.getValueTrend(12))

  const hmColors = [chartColors.gold, chartColors.wine, chartColors.goldLight, chartColors.green, chartColors.blue, chartColors.amber]

  return (
    <div className="fade-in">
      <div className="px-6 md:px-8 pt-8 pb-4">
        <h2 className="font-heading text-3xl font-bold text-ink-800">数据分析</h2>
        <p className="text-ink-400 mt-1 text-sm">深度洞察您的藏品数据</p>
      </div>

      {/* Summary stats */}
      <div className="px-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">平均估值</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">{summary ? formatValue(summary.avgValue) : '—'}</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">最高估值</p>
          <p className="text-2xl font-bold text-accent-500 font-heading mt-1">{summary ? formatValue(summary.maxValue) : '—'}</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">材质种类</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">{summary?.materialTypeCount ?? '—'}</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">品牌覆盖</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">{summary?.brandCount ?? '—'}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">估值分布 (按材质)</h3>
          <ChartWrapper height={280}>
            <Bar
              data={{
                labels: valueMat?.map(v => v.material) || [],
                datasets: [
                  {
                    label: '平均估值 (¥)',
                    data: valueMat?.map(v => v.avgValue) || [],
                    backgroundColor: 'rgba(196,135,46,0.75)',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                  },
                  {
                    label: '最高估值 (¥)',
                    data: valueMat?.map(v => v.maxValue) || [],
                    backgroundColor: 'rgba(139,34,64,0.55)',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  ...defaultScales,
                  y: { ...defaultScales.y, beginAtZero: true },
                },
              }}
            />
          </ChartWrapper>
        </GlassCard>

        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">年代 × 品类 热力图</h3>
          <ChartWrapper height={280}>
            <Bar
              data={{
                labels: heatmap?.eras || [],
                datasets: (heatmap?.categories || []).map((cat, ci) => ({
                  label: cat,
                  data: heatmap?.matrix.map(row => row[ci]) || [],
                  backgroundColor: (hmColors[ci % hmColors.length]) + 'AA',
                  borderRadius: 4,
                  borderSkipped: false,
                })),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  ...defaultScales,
                  x: { ...defaultScales.x, stacked: true },
                  y: { ...defaultScales.y, stacked: true, beginAtZero: true },
                },
                plugins: {
                  legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 8 } },
                },
              }}
            />
          </ChartWrapper>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">保存状态</h3>
          <ChartWrapper height={240}>
            <Doughnut
              data={{
                labels: statusDist?.map(s => s.status) || [],
                datasets: [{
                  data: statusDist?.map(s => s.count) || [],
                  backgroundColor: ['#4A7C59', chartColors.gold, chartColors.amber, chartColors.wine],
                  borderWidth: 0,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </ChartWrapper>
        </GlassCard>

        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">入手渠道</h3>
          <ChartWrapper height={240}>
            <PolarArea
              data={{
                labels: sourceDist?.map(s => s.source) || [],
                datasets: [{
                  data: sourceDist?.map(s => s.count) || [],
                  backgroundColor: [
                    'rgba(196,135,46,0.7)', 'rgba(139,34,64,0.6)', 'rgba(74,124,89,0.6)',
                    'rgba(91,106,191,0.6)', 'rgba(184,134,11,0.6)',
                  ],
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } },
              }}
            />
          </ChartWrapper>
        </GlassCard>

        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">估值趋势 (近12月)</h3>
          <ChartWrapper height={240}>
            <Line
              data={{
                labels: valueTrend?.labels || [],
                datasets: [{
                  label: '总估值 (¥)',
                  data: valueTrend?.values || [],
                  borderColor: chartColors.gold,
                  backgroundColor: chartColors.goldBg,
                  fill: true,
                  tension: 0.4,
                  borderWidth: 2,
                  pointRadius: 3,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: chartColors.gold,
                  pointBorderWidth: 2,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: defaultScales,
              }}
            />
          </ChartWrapper>
        </GlassCard>
      </div>
    </div>
  )
}
