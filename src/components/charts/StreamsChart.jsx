import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DUMMY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DUMMY_DATA = [45000, 62000, 55000, 78000, 69000, 88000, 95000, 82000, 105000, 98000, 115000, 128000]

// period_month in the DB is a full name string ("January", "February", …)
const MONTH_ORDER = {
  January:1, February:2, March:3, April:4, May:5, June:6,
  July:7, August:8, September:9, October:10, November:11, December:12,
}
const MONTH_SHORT = {
  January:'Jan', February:'Feb', March:'Mar', April:'Apr', May:'May', June:'Jun',
  July:'Jul', August:'Aug', September:'Sep', October:'Oct', November:'Nov', December:'Dec',
}

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(18,15,12,0.95)',
      borderColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: '#8A8A8A',
      padding: 12,
      callbacks: {
        label: (ctx) => ` ${(ctx.raw / 1000).toFixed(1)}K streams`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#555', font: { size: 12 } },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#555', font: { size: 12 }, callback: (v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}` },
      border: { display: false },
    },
  },
  elements: {
    bar: { borderRadius: 6, borderSkipped: false },
  },
}

const gradientFill = (ctx) => {
  const chart = ctx.chart
  const { ctx: c, chartArea } = chart
  if (!chartArea) return 'rgba(242,101,34,0.5)'
  const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  gradient.addColorStop(0, 'rgba(242,101,34,0.8)')
  gradient.addColorStop(1, 'rgba(242,101,34,0.25)')
  return gradient
}

export default function StreamsChart({ monthly }) {
  const isReal = Array.isArray(monthly) && monthly.length > 0

  let labels, chartData
  if (isReal) {
    const sorted = [...monthly].sort((a, b) =>
      a.year !== b.year ? a.year - b.year : (MONTH_ORDER[a.month] || 0) - (MONTH_ORDER[b.month] || 0)
    )
    labels = sorted.map((m) => `${MONTH_SHORT[m.month] || m.month} ${m.year}`)
    chartData = sorted.map((m) => Number(m.streams) || 0)
  } else {
    labels = DUMMY_LABELS
    chartData = DUMMY_DATA
  }

  const data = {
    labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: gradientFill,
        hoverBackgroundColor: '#F26522',
        barPercentage: 0.6,
      },
    ],
  }

  return (
    <div className="chart-card glass-card animate-in animate-in-delay-2">
      <div className="chart-header">
        <div>
          <p className="chart-title">Monthly Streams</p>
          <p className="chart-subtitle">Stream volume over time</p>
        </div>
      </div>
      <div className="chart-canvas-wrap">
        <Bar data={data} options={BASE_OPTIONS} />
      </div>
    </div>
  )
}
