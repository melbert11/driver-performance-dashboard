'use client';

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeeklyChart({ data, title, datasets, height = 340 }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const labels = data.map(r =>
    new Date(r.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 16 } },
      title: { display: true, text: title, font: { size: 13, weight: '600' }, color: '#555' },
    },
    scales: {
      y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}