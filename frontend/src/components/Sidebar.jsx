import React from 'react';
import { Compass, AlertTriangle, ShieldCheck, MapPin, Activity, Zap } from 'lucide-react';

export default function Sidebar({ onSelectPreset, activePreset, stats }) {
  const presets = [
    {
      name: 'Bengaluru Tech Corridor',
      subtitle: 'MG Road → Electronic City Phase 1',
      start: { latitude: 12.9716, longitude: 77.5946 },
      destination: { latitude: 12.8399, longitude: 77.6770 }
    },
    {
      name: 'Outer Ring Road Expressway',
      subtitle: 'Hebbal Flyover → Silk Board',
      start: { latitude: 13.0358, longitude: 77.5970 },
      destination: { latitude: 12.9166, longitude: 77.6101 }
    },
    {
      name: 'Inter-City Transit Highway',
      subtitle: 'Bengaluru Central → Chennai Port',
      start: { latitude: 12.9716, longitude: 77.5946 },
      destination: { latitude: 13.0827, longitude: 80.2707 }
    },
    {
      name: 'Chennai Coastal OMR',
      subtitle: 'T. Nagar → Siruseri SIPCOT Hub',
      start: { latitude: 13.0405, longitude: 80.2337 },
      destination: { latitude: 12.8258, longitude: 80.2195 }
    }
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        height: '100%'
      }}
    >
      {/* Live System Operational State */}
      <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Safety Network
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> ACTIVE
          </span>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cyan-light)' }}>
          Real-Time Sensor Telemetry
        </div>
      </div>

      {/* Preset Route Shortcuts */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
          <Compass size={16} color="var(--cyan-primary)" />
          <span>POPULAR COMMUTE CORRIDORS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {presets.map((preset, idx) => {
            const isSelected = activePreset === preset.name;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPreset && onSelectPreset(preset)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'var(--cyan-light)' : 'var(--text-main)', marginBottom: '2px' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {preset.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Advisory Widget */}
      <div style={{ marginTop: 'auto', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '0.85rem', borderRadius: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          <AlertTriangle size={15} />
          <span>COMMUTER SAFETY TIP</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          During sudden rainfall bursts, route risk weights automatically increase by 25% due to reduced road friction and higher collision probabilities.
        </p>
      </div>
    </aside>
  );
}
