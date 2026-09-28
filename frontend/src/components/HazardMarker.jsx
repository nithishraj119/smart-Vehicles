import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Generate modern SVG icon badges for Leaflet markers
function createHazardIcon(type, severity) {
  let color = '#f59e0b';
  let symbol = '⚠️';

  const t = (type || '').toLowerCase();
  const s = (severity || '').toLowerCase();

  if (s === 'critical') color = '#ef4444';
  else if (s === 'high') color = '#f97316';
  else if (s === 'moderate') color = '#eab308';
  else color = '#3b82f6';

  if (t.includes('accident')) symbol = '💥';
  else if (t.includes('pothole')) symbol = '🕳️';
  else if (t.includes('flood')) symbol = '🌊';
  else if (t.includes('block')) symbol = '🚫';
  else if (t.includes('construction')) symbol = '🚧';
  else if (t.includes('jam')) symbol = '🚗';
  else if (t.includes('signal')) symbol = '🚦';

  return L.divIcon({
    className: 'custom-hazard-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${color}99;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

export default function HazardMarker({ hazard }) {
  if (!hazard || !hazard.latitude || !hazard.longitude) return null;

  const lat = parseFloat(hazard.latitude);
  const lng = parseFloat(hazard.longitude);
  const icon = createHazardIcon(hazard.hazard_type, hazard.severity);

  const getSeverityBadgeClass = (sev) => {
    const s = (sev || '').toLowerCase();
    if (s === 'critical') return 'badge-critical';
    if (s === 'high') return 'badge-high';
    if (s === 'moderate') return 'badge-moderate';
    return 'badge-low';
  };

  return (
    <Marker position={[lat, lng]} icon={icon}>
      <Popup>
        <div style={{ minWidth: '200px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '0.95rem', color: '#67e8f9' }}>
              {hazard.hazard_type || 'Road Hazard'}
            </strong>
            <span className={`badge ${getSeverityBadgeClass(hazard.severity)}`}>
              {hazard.severity || 'Moderate'}
            </span>
          </div>
          <p style={{ color: '#cbd5e1', marginBottom: '8px', lineHeight: '1.4' }}>
            {hazard.description || 'Reported hazard on travel lane.'}
          </p>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px' }}>
            <div><strong>Reported by:</strong> {hazard.reported_by || 'Commuter Patrol'}</div>
            {hazard.created_at && (
              <div><strong>Time:</strong> {new Date(hazard.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            )}
            <div><strong>Status:</strong> <span style={{ color: '#10b981' }}>Active Notice</span></div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
