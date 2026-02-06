import { Bar, Doughnut, PolarArea, Line } from 'react-chartjs-2'
import { chartColors, defaultScales } from '../data/chartConfig'
import GlassCard from '../components/ui/GlassCard'
import ChartWrapper from '../components/charts/ChartWrapper'

export default function AnalyticsPage() {
  const eras = ['Victorian', 'Art Nouveau', 'Edwardian', 'Art Deco', 'Retro', 'Mid-Century']
  const cats = ['戒指', '项链', '手链', '胸针', '耳饰', '吊坠']
  const hmData = [
    [12, 8, 5, 18, 45, 15],
    [8, 15, 3, 22, 38, 12],
    [10, 6, 4, 14, 28, 8],
    [6, 12, 8, 20, 32, 18],
    [15, 10, 6, 28, 42, 14],
    [8, 18, 5, 25, 35, 10],
  ]
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
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">$67K</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">最高估值</p>
          <p className="text-2xl font-bold text-accent-500 font-heading mt-1">$2.8M</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">材质种类</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">28</p>
        </div>
        <div className="stat-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-400">品牌覆盖</p>
          <p className="text-2xl font-bold text-ink-800 font-heading mt-1">24</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <h3 className="font-heading text-lg font-semibold text-ink-800 mb-4">估值分布 (按材质)</h3>
          <ChartWrapper height={280}>
            <Bar
              data={{
                labels: ['钻石', '红宝石', '蓝宝石', '祖母绿', '珍珠', '黄金', '铂金', '纯银'],
                datasets: [
                  {
                    label: '平均估值 (千$)',
                    data: [85, 62, 48, 55, 18, 32, 45, 8],
                    backgroundColor: 'rgba(196,135,46,0.75)',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                  },
                  {
                    label: '最高估值 (千$)',
                    data: [1200, 450, 320, 280, 85, 160, 380, 42],
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
                labels: eras,
                datasets: cats.map((cat, ci) => ({
                  label: cat,
                  data: hmData[ci],
                  backgroundColor: hmColors[ci] + 'AA',
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
                labels: ['完好', '良好', '一般', '需修复'],
                datasets: [{
                  data: [420, 510, 248, 106],
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
                labels: ["Christie's/Sotheby's", '古董商', '遗产拍卖', '私人藏家', '线上平台'],
                datasets: [{
                  data: [380, 310, 265, 185, 144],
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
                labels: ['3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月'],
                datasets: [{
                  label: '总估值 (百万$)',
                  data: [6.2, 6.5, 6.8, 7.0, 7.3, 7.5, 7.8, 8.0, 8.2, 8.3, 8.5, 8.6],
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
