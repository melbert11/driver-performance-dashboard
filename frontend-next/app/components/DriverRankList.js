'use client';

export default function DriverRankList({ driverProfiles }) {
  if (!Array.isArray(driverProfiles) || driverProfiles.length === 0) return null;

  const sorted = [...driverProfiles].sort((a, b) => Number(b.avg_rating) - Number(a.avg_rating));
  const safest = sorted.slice(0, 5);
  const riskiest = [...driverProfiles]
    .sort((a, b) => Number(a.avg_rating) - Number(b.avg_rating))
    .slice(0, 5);

  const colors = {
    rating: '#2563eb',
    incidents: '#f59e0b',
    violations: '#14b8a6',
    text: '#334155',
    muted: '#64748b',
  };

  const Row = ({ driver, rank }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <span style={{ fontSize: '13px', color: colors.muted, width: '20px', flexShrink: 0 }}>{rank}</span>
      <div style={{ display: 'inline', flex: 1 }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
          {driver.driver_name}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: colors.rating }}>
            {Number(driver.avg_rating).toFixed(2)}
          </span>
          <span style={{ fontSize: '12px', color: colors.incidents }}>
            {driver.total_aggressive_incidents} incidents
          </span>
          <span style={{ fontSize: '12px', color: colors.violations }}>
            {driver.total_violations} violations
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', minWidth: '260px'
    }}>
      {/* Safest */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: colors.rating, marginBottom: '8px' }}>
          Top 5 Safest
        </p>
        {safest.map((d, i) => <Row key={d.driver_id} driver={d} rank={i + 1} />)}
      </div>

      {/* Riskiest */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: '700', color: colors.incidents, marginBottom: '8px' }}>
          Top 5 Riskiest
        </p>
        {riskiest.map((d, i) => <Row key={d.driver_id} driver={d} rank={i + 1} />)}
      </div>
    </div>
  );
}
