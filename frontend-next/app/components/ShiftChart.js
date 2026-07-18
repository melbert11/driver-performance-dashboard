'use client';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PALETTE = {
  blue: '#2563eb',
  yellow: '#f59e0b',
};

export default function ShiftChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const labels = data.map(r => r.shift);
  const delays = data.map(r => Number(r.avg_delay));
  const ratings = data.map(r => Number(r.avg_rating));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Avg Delay (min)',
        data: delays,
        backgroundColor: 'rgba(245,158,11,0.78)',
        borderRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Avg Rating',
        data: ratings,
        backgroundColor: 'rgba(37,99,235,0.78)',
        borderRadius: 8,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 16 } },
      title: { display: true, text: 'Average Delay vs Rating by Shift', font: { size: 13, weight: '600' }, color: '#555' },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { position: 'left', grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } }, title: { display: true, text: 'Avg Delay (min)' } },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 11 } },
        title: { display: true, text: 'Avg Rating' },
      },
    },
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '320px' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}