import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const PLATFORMS = [
  { name: 'Spotify', value: 42, color: '#1DB954' },
  { name: 'Apple Music', value: 28, color: '#FC3C44' },
  { name: 'YouTube Music', value: 15, color: '#FF0000' },
  { name: 'Amazon Music', value: 10, color: '#00A8E0' },
  { name: 'Others', value: 5, color: '#555555' },
]

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
        label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`,
      },
    },
  },
  cutout: '72%',
  elements: {
    arc: { borderWidth: 0, hoverOffset: 6 },
  },
}

export default function PlatformChart() {
  const data = {
    labels: PLATFORMS.map((p) => p.name),
    datasets: [
      {
        data: PLATFORMS.map((p) => p.value),
        backgroundColor: PLATFORMS.map((p) => p.color),
        hoverBackgroundColor: PLATFORMS.map((p) => p.color),
      },
    ],
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
          <Doughnut data={data} options={options} />
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLATFORMS.map((p) => (
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
