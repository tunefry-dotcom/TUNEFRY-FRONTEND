import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const DUMMY_PLATFORMS = [
  { name: 'Spotify', value: 42, color: '#1DB954' },
  { name: 'Apple Music', value: 28, color: '#FC3C44' },
  { name: 'YouTube Music', value: 15, color: '#FF0000' },
  { name: 'Amazon Music', value: 10, color: '#00A8E0' },
  { name: 'Others', value: 5, color: '#555555' },
]

export const PLATFORM_COLORS = {
  'Spotify': '#1DB954',
  'Apple Music': '#FC3C44',
  'YouTube': '#FF0000',
  'YouTube Music': '#FF0000',
  'JioSaavn': '#007AFF',
  'Gaana': '#E72929',
  'Amazon': '#00A8E0',
  'Amazon Music': '#00A8E0',
  'Facebook': '#1877F2',
  'Meta': '#1877F2',
  'Facebook/Meta': '#1877F2',
  'TikTok': '#69C9D0',
  'Other': '#555555',
}

const CHART_OPTIONS = {
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
        label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`,
      },
    },
  },
  cutout: '72%',
  elements: {
    arc: { borderWidth: 0, hoverOffset: 6 },
  },
}

export default function PlatformChart({ platforms, hideList }) {
  const isReal = Array.isArray(platforms) && platforms.length > 0

  let chartItems
  if (isReal) {
    const totalStreams = platforms.reduce((s, p) => s + (Number(p.streams) || 0), 0) || 1
    chartItems = platforms.map((p) => ({
      name: p.platform_group,
      value: Math.round((Number(p.streams) / totalStreams) * 100),
      color: PLATFORM_COLORS[p.platform_group] ?? '#555555',
    }))
  } else {
    chartItems = DUMMY_PLATFORMS
  }

  const chartData = {
    labels: chartItems.map((p) => p.name),
    datasets: [
      {
        data: chartItems.map((p) => p.value),
        backgroundColor: chartItems.map((p) => p.color),
        hoverBackgroundColor: chartItems.map((p) => p.color),
      },
    ],
  }

  if (hideList) {
    return <Doughnut data={chartData} options={CHART_OPTIONS} />
  }

  return (
    <div className="chart-card glass-card animate-in animate-in-delay-3">
      <div className="chart-header">
        <div>
          <p className="chart-title">Platform Breakdown</p>
          <p className="chart-subtitle">Streams by platform</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'center' }}>
        <div className="chart-canvas-wrap" style={{ height: 160 }}>
          <Doughnut data={chartData} options={CHART_OPTIONS} />
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chartItems.map((p) => (
            <li key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, color: '#8A8A8A' }}>{p.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{p.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
