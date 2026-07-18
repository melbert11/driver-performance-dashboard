'use client';

import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ['#2563eb', '#f59e0b', '#14b8a6'];

function DonutChart({ title, data, field, colors }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const labels = data.map(r => r.shift);
  const values = data.map(r => Number(r[field]));

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const options = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: { position: 'right', labels: { font: { size: 12 }, padding: 12 } },
      title: { display: false },
    },
  };

  const centerLabelPlugin = {
    id: `centerLabel-${field}`,
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      const firstArc = meta?.data?.[0];

      if (!firstArc) return;

      const { ctx } = chart;
      const x = firstArc.x;
      const y = firstArc.y;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      ctx.font = '700 20px sans-serif';
      ctx.fillText(String(total), x, y - 4);
      ctx.fillStyle = '#aaa';
      ctx.font = '10px sans-serif';
      ctx.fillText('total', x, y + 14);
      ctx.restore();
    },
  };

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1 }}>
      <p style={{ fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '16px' }}>{title}</p>
      <div style={{ maxWidth: '240px', margin: '0 auto' }}>
        <Doughnut data={chartData} options={options} plugins={[centerLabelPlugin]} />
      </div>
    </div>
  );
}

export default function DonutCharts({ shiftData }) {
  return (
    <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
      <DonutChart
        title="Total Incident Share by Shift"
        data={shiftData}
        field="total_aggressive_incidents"
        colors={PALETTE}
      />
      <DonutChart
        title="Total Violations Share by Shift"
        data={shiftData}
        field="total_violations"
        colors={PALETTE}
      />
    </div>
  );
}