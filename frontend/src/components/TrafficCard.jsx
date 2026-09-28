import React from 'react';
import { Gauge, Car, AlertOctagon, TrendingUp } from 'lucide-react';

export default function TrafficCard({ trafficData, routeAnalysis }) {
  // Use routeAnalysis traffic factor or default representative sample
  const congestionLevel = routeAnalysis?.contributing_factors?.traffic?.congestion_detected || 'Moderate';
  const trafficScore = routeAnalysis?.contributing_factors?.traffic?.score || 45;
  const avgSpeed = trafficScore > 70 ? '18 km/h' : (trafficScore > 50 ? '34 km/h' : '52 km/h');
  const vehicleCount = trafficScore > 70 ? '2,450' : (trafficScore > 50 ? '1,240' : '680');
  const congestionPercent = `${Math.min(98, Math.max(15, trafficScore))}%`;

  const getStatusColor = (lvl) => {
    const l = (lvl || '').toLowerCase();
    if (l === 'critical' || l === 'heavy') return '#ef4444';
    if (l === 'moderate') return '#f59e0b';
    return '#10b981';
  };

  const statusColor = getStatusColor(congestionLevel);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gauge size={20} color="var(--cyan-primary)" />
          <h3 style={{ fontSize: '1.15rem' }}>Traffic Intelligence</h3>
        </div>
        <span
          className="badge"
          style={{
            background: `${statusColor}22`,
            color: statusColor,
            border: `1px solid ${statusColor}55`
          }}
        >
          {congestionLevel}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>AVG SPEED</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{avgSpeed}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>VEHICLES</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cyan-light)' }}>{vehicleCount}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>CONGESTION</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: statusColor }}>{congestionPercent}</div>
        </div>
      </div>

      {/* Congestion Meter Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
          <span>Free Flow</span>
          <span>Moderate Delay</span>
          <span>Gridlock</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: congestionPercent,
              height: '100%',
              background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Advisory hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <TrendingUp size={15} color="var(--cyan-primary)" />
        <span>Peak commuter rush algorithm active across key corridor junctions.</span>
      </div>
    </div>
  );
}
