import React, { useState } from 'react';
import { Cpu, Wifi, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { iotService } from '../services/api';

export default function IoTDeviceCard({ onTelemetrySent }) {
  const [loading, setLoading] = useState(false);
  const [lastAck, setLastAck] = useState(null);

  const [devicePayload, setDevicePayload] = useState({
    device_id: 'IOT-ESP32-NODE-04',
    latitude: 12.9716,
    longitude: 77.5946,
    speed: 38.5,
    vehicle_count: 145,
    temperature: 28.5,
    rainfall: 12.0,
    hazard_detected: false
  });

  const handleSimulatePing = async () => {
    setLoading(true);
    try {
      const response = await iotService.sendSensorData(devicePayload);
      setLastAck(response.data);
      if (onTelemetrySent) onTelemetrySent();
    } catch (err) {
      console.error('Failed to send sensor ping:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <Cpu size={20} color="var(--cyan-primary)" />
          <h3 style={{ fontSize: '1.15rem' }}>Edge IoT Sensor Node</h3>
        </div>
        <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Wifi size={12} /> ESP32-MESH ONLINE
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Roadside microcontroller nodes transmit real-time telemetry into the SMART-COMMUTE backend via REST APIs to dynamically adjust safety risk scores.
      </p>

      {/* Sensor Input Simulator Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Speed (km/h)</label>
          <input
            type="number"
            className="form-input"
            value={devicePayload.speed}
            onChange={(e) => setDevicePayload({ ...devicePayload, speed: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vehicle Count</label>
          <input
            type="number"
            className="form-input"
            value={devicePayload.vehicle_count}
            onChange={(e) => setDevicePayload({ ...devicePayload, vehicle_count: parseInt(e.target.value, 10) })}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Rainfall (mm)</label>
          <input
            type="number"
            className="form-input"
            value={devicePayload.rainfall}
            onChange={(e) => setDevicePayload({ ...devicePayload, rainfall: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Hazard Flag</label>
          <button
            type="button"
            onClick={() => setDevicePayload({ ...devicePayload, hazard_detected: !devicePayload.hazard_detected })}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              background: devicePayload.hazard_detected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: devicePayload.hazard_detected ? '#f87171' : '#34d399',
              border: `1px solid ${devicePayload.hazard_detected ? '#ef4444' : '#10b981'}`,
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            {devicePayload.hazard_detected ? '⚠️ Hazard Detected' : '✅ Clear Corridor'}
          </button>
        </div>
      </div>

      <button
        onClick={handleSimulatePing}
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Activity size={16} />
        <span>{loading ? 'Transmitting Telemetry...' : 'Send Simulated Hardware Telemetry Ping'}</span>
      </button>

      {lastAck && (
        <div style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600, marginBottom: '0.3rem' }}>
            <CheckCircle2 size={15} /> Telemetry Ingested by Backend
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Node: <strong>{lastAck.device_id}</strong> | Congestion computed: <strong style={{ color: '#67e8f9' }}>{lastAck.congestion_computed}</strong> | Record ID: #{lastAck.record_id}
          </div>
        </div>
      )}
    </div>
  );
}
