import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const DUMMY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DUMMY_DATA = [1200, 1900, 1600, 2400, 2100, 2800, 3200, 2900, 3600, 3400, 3900, 4200]
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildOptions(isReal) {
  return {
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
          label: isReal
            ? (ctx) => ` ₹${ctx.raw.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : (ctx) => ` $${ctx.raw.toLocaleString()}`,
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
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#555',
          font: { size: 12 },
          callback: isReal ? (v) => `₹${v.toLocaleString('en-IN')}` : (v) => `$${v}`,
        },
        border: { display: false },
      },
    },
    elements: {
      point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: '#F26522' },
      line: { tension: 0.4 },
    },
  }
}

const gradientFill = (ctx) => {
  const chart = ctx.chart
  const { ctx: c, chartArea } = chart
  if (!chartArea) return 'transparent'
  const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  gradient.addColorStop(0, 'rgba(242,101,34,0.22)')
  gradient.addColorStop(1, 'rgba(242,101,34,0.01)')
  return gradient
}

export default function RevenueChart({ monthly }) {
  const isReal = Array.isArray(monthly) && monthly.length > 0

  let labels, chartData
  if (isReal) {
    const sorted = [...monthly].sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    labels = sorted.map((m) => `${MONTH_NAMES[m.month - 1]} ${m.year}`)
    chartData = sorted.map((m) => Number(m.revenue) || 0)
  } else {
    labels = DUMMY_LABELS
    chartData = DUMMY_DATA
  }

  const data = {
    labels,
    datasets: [
      {
        data: chartData,
        borderColor: '#F26522',
        borderWidth: 2.5,
        fill: true,
        backgroundColor: gradientFill,
      },
    ],
  }

  return (
    <div className="chart-card glass-card animate-in animate-in-delay-3">
      <div className="chart-header">
        <div>
          <p className="chart-title">Revenue</p>
          <p className="chart-subtitle">{isReal ? 'Monthly earnings in ₹' : 'Monthly earnings in USD'}</p>
        </div>
        {!isReal && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#F26522', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: '#8A8A8A' }}>2024</span>
          </div>
        )}
      </div>
      <div className="chart-canvas-wrap">
        <Line data={data} options={buildOptions(isReal)} />
      </div>
    </div>
  )
}
