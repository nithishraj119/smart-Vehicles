import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Gauge, 
  AlertTriangle, 
  CloudRain, 
  Navigation, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Plus
} from 'lucide-react';
import MapView from '../components/MapView';
import { trafficService, hazardService, weatherService, authService } from '../services/api';

export default function Dashboard() {
  const [traffic, setTraffic] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [tRes, hRes, wRes] = await Promise.all([
        trafficService.getAll().catch(() => ({ data: { traffic: [] } })),
        hazardService.getAll().catch(() => ({ data: { hazards: [] } })),
        weatherService.getWeather().catch(() => ({ data: { weather: [] } }))
      ]);

      setTraffic(tRes.data?.traffic || []);
      setHazards(hRes.data?.hazards || []);
      setWeather(wRes.data?.weather?.[0] || null);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const criticalHazards = hazards.filter(h => (h.severity || '').toLowerCase() === 'critical' || (h.severity || '').toLowerCase() === 'high');

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Top Welcome & Quick Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            COMMUTER COMMAND CENTER
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>
            Hello, {currentUser?.name || 'Commuter'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live corridor safety telemetry, regional traffic volume, and hazard detection.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadDashboardData} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Sync Live Feeds</span>
          </button>
          <Link to="/route-analysis" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            <Navigation size={16} />
            <span>Plan New Route</span>
          </Link>
        </div>
      </div>

      {/* KPI Status Cards (Section 9) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {/* Card 1: Route Risk Level */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REGIONAL STATUS</span>
            <ShieldAlert size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan-light)', marginBottom: '0.2rem' }}>
            MODERATE
          </div>
          <span className="badge badge-moderate" style={{ fontSize: '0.7rem' }}>
            Usable With Caution
          </span>
        </div>

        {/* Card 2: Risk Score */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RISK INDEX</span>
            <Activity size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginBottom: '0.2rem' }}>
            48 <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 500 }}>/100</span>
          </div>
          <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
            Safe Transit Window
          </span>
        </div>

        {/* Card 3: Traffic */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NETWORK TRAFFIC</span>
            <Gauge size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.2rem' }}>
            Moderate
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Avg Speed: 34 km/h
          </div>
        </div>

        {/* Card 4: Hazards */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROAD HAZARDS</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171', marginBottom: '0.2rem' }}>
            {hazards.length} Active
          </div>
          <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
            {criticalHazards.length} High Severity
          </span>
        </div>

        {/* Card 5: Weather */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WEATHER ADVISORY</span>
            <CloudRain size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7dd3fc', marginBottom: '0.2rem' }}>
            {weather ? `${weather.temperature}°C` : '28°C'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Visibility: {weather ? `${weather.visibility} km` : '8.5 km (Good)'}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Snapshot + Alerts Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Map Container */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Live Spatial Safety Network</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                OpenStreetMap real-time layer displaying active hazards and traffic congestion points.
              </p>
            </div>
            <Link to="/route-analysis" style={{ fontSize: '0.85rem', color: 'var(--cyan-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Full Screen Analyzer <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ flex: 1, minHeight: '420px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapView
              interactive={true}
              height="420px"
              hazards={hazards}
              traffic={traffic}
              center={[12.9716, 77.5946]}
              zoom={11}
            />
          </div>
        </div>

        {/* Live Alerts & Recent Hazards Stream */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Active Road Notices</h3>
            <span className="badge badge-high">{hazards.length} alerts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
            {hazards.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                No active road hazards reported.
              </div>
            ) : (
              hazards.slice(0, 6).map((h) => {
                const isCrit = (h.severity || '').toLowerCase() === 'critical';
                const isHigh = (h.severity || '').toLowerCase() === 'high';
                const borderColor = isCrit ? '#ef4444' : (isHigh ? '#f59e0b' : 'rgba(255,255,255,0.1)');

                return (
                  <div
                    key={h.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: `3px solid ${borderColor}`,
                      padding: '0.85rem',
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{h.hazard_type}</strong>
                      <span className={`badge ${isCrit ? 'badge-critical' : (isHigh ? 'badge-high' : 'badge-low')}`} style={{ fontSize: '0.65rem' }}>
                        {h.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.4rem' }}>
                      {h.description}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Reported by: {h.reported_by}</span>
                      <span>{h.created_at ? new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
