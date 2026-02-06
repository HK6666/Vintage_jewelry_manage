import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
)

export const chartColors = {
  gold: '#C4872E',
  goldLight: '#E8A44A',
  goldBg: 'rgba(196, 135, 46, 0.1)',
  wine: '#8B2240',
  wineLight: '#D4667A',
  wineBg: 'rgba(139, 34, 64, 0.1)',
  ivory: '#E0D3B3',
  ink: '#2B241D',
  inkLight: '#6B5B4A',
  green: '#4A7C59',
  blue: '#5B6ABF',
  amber: '#B8860B',
  gridColor: 'rgba(237, 227, 204, 0.5)',
}

export const defaultScales = {
  x: {
    grid: { color: chartColors.gridColor, drawBorder: false },
    ticks: { color: chartColors.inkLight, font: { family: 'Montserrat', size: 11 } },
  },
  y: {
    grid: { color: chartColors.gridColor, drawBorder: false },
    ticks: { color: chartColors.inkLight, font: { family: 'Montserrat', size: 11 } },
  },
}

// Set Chart.js global defaults
ChartJS.defaults.font.family = 'Montserrat, Noto Sans SC, sans-serif'
ChartJS.defaults.plugins.legend.labels.usePointStyle = true
ChartJS.defaults.plugins.legend.labels.pointStyle = 'circle'
ChartJS.defaults.plugins.legend.labels.padding = 16
ChartJS.defaults.plugins.legend.labels.color = chartColors.inkLight
