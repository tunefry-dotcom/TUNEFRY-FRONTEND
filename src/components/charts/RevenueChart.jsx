import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DATA = [1200, 1900, 1600, 2400, 2100, 2800, 3200, 2900, 3600, 3400, 3900, 4200]

const options = {
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
        label: (ctx) => ` $${ctx.raw.toLocaleString()}`,
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
      ticks: { color: '#555', font: { size: 12 }, callback: (v) => `$${v}` },
      border: { display: false },
    },
  },
  elements: {
    point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: '#F26522' },
    line: { tension: 0.4 },
  },
}

export default function RevenueChart() {
  const data = {
    labels: LABELS,
    datasets: [
      {
        data: DATA,
        borderColor: '#F26522',
        borderWidth: 2.5,
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'transparent'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(242,101,34,0.22)')
          gradient.addColorStop(1, 'rgba(242,101,34,0.01)')
          return gradient
        },
      },
    ],
  }

  return (
    <div className="chart-card glass-card animate-in animate-in-delay-3">
      <div className="chart-header">
        <div>
          <p className="chart-title">Revenue</p>
          <p className="chart-subtitle">Monthly earnings in USD</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#F26522', display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: '#8A8A8A' }}>2024</span>
        </div>
      </div>
      <div className="chart-canvas-wrap">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
