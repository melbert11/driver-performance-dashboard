'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import KpiCards from './components/KpiCards';
import DonutCharts from './components/DonutCharts';
import DriverRankList from './components/DriverRankList';
import ShiftChart from './components/ShiftChart';
import WeeklyChart from './components/WeeklyChart';
import DriverInfo from './components/DriverInfo';

const fetcher = url => axios.get(url).then(r => r.data);
const FILTER_STORAGE_KEY = 'driver-performance-dashboard-filters';
const PALETTE = {
  blue: '#2563eb',
  yellow: '#f59e0b',
  teal: '#14b8a6',
};

export default function Dashboard() {
  const [start, setStart] = useState('2025-01-01');
  const [end, setEnd] = useState('2025-03-31');
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FILTER_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (parsed.start) setStart(parsed.start);
      if (parsed.end) setEnd(parsed.end);
      if (parsed.selectedDriver) setSelectedDriver(parsed.selectedDriver);
    } catch {
      // Keep default state.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify({ start, end, selectedDriver })
      );
    } catch {
      // Keep default state.
    }
  }, [start, end, selectedDriver]);

  // API calls
  const swrOptions = {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

  const { data: weekly, error: weeklyError } = useSWR(`/api/proxy/metrics/weekly?start=${start}&end=${end}`, fetcher, swrOptions);
  const { data: shift, error: shiftError } = useSWR(`/api/proxy/metrics/shift?start=${start}&end=${end}`, fetcher, swrOptions);
  const { data: drivers, error: driversError } = useSWR(`/api/proxy/drivers`, fetcher, swrOptions);
  const { data: driverProfiles, error: driverProfilesError } = useSWR(`/api/proxy/metrics/drivers?start=${start}&end=${end}`, fetcher, swrOptions);
  const { data: driverDetail, error: driverDetailError } = useSWR(
    selectedDriver ? `/api/proxy/metrics/drivers/${selectedDriver}?start=${start}&end=${end}` : null,
    fetcher,
    swrOptions
  );

  const isDriverSelected = !!selectedDriver;
  const weeklyRows = Array.isArray(weekly) ? weekly : weekly?.data ?? [];
  const shiftRows = Array.isArray(shift) ? shift : shift?.data ?? [];
  const driverRows = Array.isArray(drivers) ? drivers : drivers?.data ?? [];
  const driverProfileRows = Array.isArray(driverProfiles) ? driverProfiles : driverProfiles?.data ?? [];
  const driverDetailRows = Array.isArray(driverDetail) ? driverDetail : driverDetail?.data ?? [];
  const driverOptions = driverRows.length ? driverRows : driverProfileRows;
  const apiErrors = [weeklyError, shiftError, driversError, driverProfilesError, driverDetailError].filter(Boolean);
  const hasData = weeklyRows.length > 0 || shiftRows.length > 0 || driverRows.length > 0 || driverProfileRows.length > 0 || driverDetailRows.length > 0;

  // Weekly chart datasets — all drivers view
  const weeklyAllDatasets = weeklyRows.length ? [
    {
      label: 'Trip Count',
      data: weeklyRows.map(r => Number(r.trip_count)),
      borderColor: PALETTE.blue,
      backgroundColor: 'rgba(37,99,235,0.08)',
      tension: 0.4, yAxisID: 'y',
    },
    {
      label: 'Incidents',
      data: weeklyRows.map(r => Number(r.total_aggressive_incidents)),
      borderColor: PALETTE.yellow,
      backgroundColor: 'rgba(245,158,11,0.08)',
      tension: 0.4, yAxisID: 'y',
    },
    {
      label: 'Violations',
      data: weeklyRows.map(r => Number(r.total_violations)),
      borderColor: PALETTE.teal,
      backgroundColor: 'rgba(20,184,166,0.08)',
      tension: 0.4, yAxisID: 'y',
    },
  ] : [];

  // Weekly delays + rating datasets
  const weeklyDelayDatasets = weeklyRows.length ? [
    {
      label: 'Total Delays (min)',
      data: weeklyRows.map(r => Number(r.total_delays)),
      borderColor: PALETTE.yellow,
      backgroundColor: 'rgba(245,158,11,0.08)',
      tension: 0.4, yAxisID: 'y1',
    },
    {
      label: 'Avg Rating',
      data: weeklyRows.map(r => Number(r.avg_rating).toFixed(2)),
      borderColor: PALETTE.blue,
      backgroundColor: 'rgba(37,99,235,0.08)',
      tension: 0.4, yAxisID: 'y2',
    },
  ] : [];

  // Driver detail weekly datasets
  const driverWeeklyData = driverDetailRows.length ? (() => {
    const grouped = {};
    driverDetailRows.forEach(r => {
      const week = new Date(r.date);
      week.setDate(week.getDate() - week.getDay());
      const key = week.toISOString().split('T')[0];
      if (!grouped[key]) grouped[key] = { week: key, trips: 0, incidents: 0, violations: 0, delays: 0, ratings: [] };
      grouped[key].trips++;
      grouped[key].incidents += Number(r.accidents_count ?? r.aggressive_incidents_count ?? 0);
      grouped[key].violations += Number(r.violations_count);
      grouped[key].delays += Number(r.delays_minutes);
      grouped[key].ratings.push(Number(r.rating));
    });
    return Object.values(grouped).sort((a, b) => a.week.localeCompare(b.week));
  })() : [];

  const driverWeeklyDatasets = driverWeeklyData.length ? [
    {
      label: 'Trip Count',
      data: driverWeeklyData.map(r => r.trips),
      borderColor: PALETTE.blue,
      backgroundColor: 'rgba(37,99,235,0.08)',
      tension: 0.4,
    },
    {
      label: 'Incidents',
      data: driverWeeklyData.map(r => r.incidents),
      borderColor: PALETTE.yellow,
      backgroundColor: 'rgba(245,158,11,0.08)',
      tension: 0.4,
    },
    {
      label: 'Violations',
      data: driverWeeklyData.map(r => r.violations),
      borderColor: PALETTE.teal,
      backgroundColor: 'rgba(20,184,166,0.08)',
      tension: 0.4,
    },
  ] : [];

  const driverDelayDatasets = driverWeeklyData.length ? [
    {
      label: 'Total Delays (min)',
      data: driverWeeklyData.map(r => r.delays),
      borderColor: PALETTE.yellow,
      backgroundColor: 'rgba(245,158,11,0.08)',
      tension: 0.4,
    },
    {
      label: 'Avg Rating',
      data: driverWeeklyData.map(r => (r.ratings.reduce((a, b) => a + b, 0) / r.ratings.length).toFixed(2)),
      borderColor: PALETTE.blue,
      backgroundColor: 'rgba(37,99,235,0.08)',
      tension: 0.4,
    },
  ] : [];

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', background: '#f5f6fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111' }}>Driver Performance Dashboard</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginTop: '4px' }}>Exploratory Data Analysis on Driver Performance</p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
        gap: '16px', background: 'white', borderRadius: '16px',
        padding: '20px 24px', marginBottom: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <div>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Start date</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>End date</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Driver</label>
          <select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
            <option value=''>All drivers</option>
            {driverOptions.map(d => (
              <option key={d.driver_id} value={d.driver_id}>{d.driver_name}</option>
            ))}
          </select>
        </div>
        {selectedDriver && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={() => setSelectedDriver('')}
              style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#888' }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {(apiErrors.length > 0 || !hasData) && (
        <div style={{
          marginBottom: '24px',
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid #fde68a',
          background: '#fffbeb',
          color: '#92400e',
          fontSize: '14px',
        }}>
          {apiErrors.length > 0
            ? 'Some dashboard data could not be loaded. Check the API responses for the weekly, shift, or driver endpoints.'
            : 'No dashboard data is available for the selected date range.'}
        </div>
      )}

      {/* KPI Cards */}
      <KpiCards
        weeklyData={weeklyRows}
        driverData={driverDetailRows}
        selectedDriver={selectedDriver}
      />

      {/* ALL DRIVERS VIEW */}
      {!isDriverSelected && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '16px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DonutCharts shiftData={shiftRows} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <WeeklyChart
                  data={weeklyRows}
                  title="Weekly Trip Count, Incidents & Violations"
                  height={360}
                  datasets={weeklyAllDatasets}
                />
                <WeeklyChart
                  data={weeklyRows}
                  title="Weekly Delays & Average Rating"
                  height={360}
                  datasets={weeklyDelayDatasets}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DriverRankList driverProfiles={driverProfileRows} />
              <ShiftChart data={shiftRows} />
            </div>
          </div>
        </>
      )}

      {/* SINGLE DRIVER VIEW */}
      {isDriverSelected && driverDetailRows.length > 0 && (
        <>
          {/* Row 2: Weekly trip chart + Driver Info */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <WeeklyChart
                data={driverWeeklyData.map(r => ({ week: r.week }))}
                title="Weekly Trip Count, Incidents & Violations"
                datasets={driverWeeklyDatasets}
              />
            </div>
            <DriverInfo driverData={driverDetailRows} driverId={selectedDriver} />
          </div>

          {/* Row 3: Weekly delay chart */}
          <WeeklyChart
            data={driverWeeklyData.map(r => ({ week: r.week }))}
            title="Weekly Delays & Average Rating"
            datasets={driverDelayDatasets}
          />
        </>
      )}

    </main>
  );
}