'use client';

export default function DriverInfo({ driverData, driverId }) {
  if (!Array.isArray(driverData) || driverData.length === 0) return null;

  const totalTrips      = driverData.length;
  const avgRating       = (driverData.reduce((s, r) => s + Number(r.rating), 0) / totalTrips).toFixed(2);
  const totalViolations = driverData.reduce((s, r) => s + Number(r.violations_count), 0);
  const totalIncidents  = driverData.reduce((s, r) => s + Number(r.accidents_count ?? r.aggressive_incidents_count ?? 0), 0);
  const totalDelays     = driverData.reduce((s, r) => s + Number(r.delays_minutes), 0);
  const name            = driverData[0]?.driver_name ?? driverId;
  const rows = [
    { label: 'Driver ID',        value: driverId },
    { label: 'Name',             value: name },
    { label: 'Total Trips',      value: totalTrips },
    { label: 'Avg Rating',       value: `${avgRating}` },
    { label: 'Total Delays',     value: `${totalDelays} mins` },
    { label: 'Total Violations', value: `${totalViolations}` },
    { label: 'Total Incidents',  value: `${totalIncidents}` },
  ];

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', minWidth: '220px'
    }}>
      <p style={{ fontSize: '13px', fontWeight: '700', color: '#333', marginBottom: '16px' }}>
        Driver Info
      </p>
      {rows.map(r => (
        <div key={r.label} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px'
        }}>
          <span style={{ color: '#aaa' }}>{r.label}</span>
          <span style={{ color: '#333', fontWeight: '600' }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
