import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DATA = [45000, 62000, 55000, 78000, 69000, 88000, 95000, 82000, 105000, 98000, 115000, 128000]

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
        label: (ctx) => ` ${(ctx.raw / 1000).toFixed(0)}K streams`,
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
      ticks: { color: '#555', font: { size: 12 }, callback: (v) => `${v / 1000}K` },
      border: { display: false },
    },
  },
  elements: {
    bar: { borderRadius: 6, borderSkipped: false },
  },
}

export default function StreamsChart() {
  const data = {
    labels: LABELS,
    datasets: [
      {
        data: DATA,
        backgroundColor: (ctx) => {
          const chart = ctx.chart
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'rgba(242,101,34,0.5)'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(242,101,34,0.8)')
          gradient.addColorStop(1, 'rgba(242,101,34,0.25)')
          return gradient
        },
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
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
