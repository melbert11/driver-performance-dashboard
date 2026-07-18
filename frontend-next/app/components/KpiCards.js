'use client';

export default function KpiCards({ weeklyData, driverData, selectedDriver }) {
  const data = selectedDriver && driverData ? driverData : weeklyData;

  if (!Array.isArray(data) || data.length === 0) return null;

  const totalDelays     = data.reduce((sum, r) => sum + Number(r.total_delays ?? r.delays_minutes ?? 0), 0);
  const totalViolations = data.reduce((sum, r) => sum + Number(r.total_violations ?? r.violations_count ?? 0), 0);
  const totalIncidents  = data.reduce((sum, r) => sum + Number(r.total_aggressive_incidents ?? r.aggressive_incidents_count ?? r.accidents_count ?? 0), 0);
  const avgRating       = (data.reduce((sum, r) => sum + Number(r.avg_rating ?? r.rating ?? 0), 0) / data.length).toFixed(2);

  const cards = [
    { label: 'Total Delays (mins)', value: totalDelays.toLocaleString(),     color: '#f59e0b' },
    { label: 'Total Violations',    value: totalViolations.toLocaleString(), color: '#f59e0b' },
    { label: 'Total Incidents',     value: totalIncidents.toLocaleString(),  color: '#f59e0b' },
    { label: 'Average Rating',      value: avgRating,                        color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card) => (
        <div key={card.label} style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px' }}>{card.label}</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: card.color }}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
