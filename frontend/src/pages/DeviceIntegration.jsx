import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Wifi, 
  Layers, 
  Zap, 
  Radio, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';
import IoTDeviceCard from '../components/IoTDeviceCard';
import { iotService } from '../services/api';

export default function DeviceIntegration() {
  const [telemetryFeeds, setTelemetryFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await iotService.getSensorData();
      setTelemetryFeeds(res.data?.telemetry || []);
    } catch (err) {
      console.warn('Telemetry fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const deviceTypes = [
    { title: 'GPS Fleet Tracker', protocol: 'NMEA 0183 / MQTT', desc: 'Continuous coordinate tracking & vehicle trajectory validation along active corridors.' },
    { title: 'Radar Doppler Speed Probe', protocol: 'RS485 / REST API', desc: 'Computes accurate vehicle approach velocity and road congestion counts.' },
    { title: 'IoT Roadside Microcontroller (ESP32)', protocol: 'HTTP POST / WiFi-Mesh', desc: 'Edge processing for vibration, waterlogging depth, and collision impact shocks.' },
    { title: 'Ultrasonic Pavement Sensor', protocol: 'I2C / LoRaWAN', desc: 'Identifies new asphalt fissures, potholes, and surface condition deterioration.' },
    { title: 'Environmental Optical Sensor', protocol: 'Modbus / REST', desc: 'Transmits localized precipitation intensity, ambient temperature, and visibility range.' }
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 23, 44, 0.95) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--cyan-primary) 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--cyan-glow)'
            }}
          >
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Smart Transportation Device Integration</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Hardware edge architecture linking microcontrollers, Doppler speed monitors, and IoT road nodes with SMART-COMMUTE AI.
            </p>
          </div>
        </div>
      </div>

      {/* Hardware Ecosystem Flow Diagram (Section 29) */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--cyan-primary)" />
          <span>Intelligent Hardware Ecosystem Pipeline</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Future intelligent road devices connect seamlessly via standardized REST payloads into the backend processing queue.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'rgba(7, 11, 20, 0.7)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <div style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: 'var(--cyan-light)' }}>
              <Cpu size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>IoT Road Node</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ESP32 / Raspberry Pi</span>
          </div>

          <ArrowRight size={20} color="var(--cyan-primary)" className="hide-on-mobile" />

          <div style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#34d399' }}>
              <Radio size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>Sensor Data</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Speed, Vol, Shock</span>
          </div>

          <ArrowRight size={20} color="var(--cyan-primary)" className="hide-on-mobile" />

          <div style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#fbbf24' }}>
              <Zap size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>Node.js REST API</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>/api/iot/sensor-data</span>
          </div>

          <ArrowRight size={20} color="var(--cyan-primary)" className="hide-on-mobile" />

          <div style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#c084fc' }}>
              <Database size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>MySQL Database</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Persistent telemetry</span>
          </div>

          <ArrowRight size={20} color="var(--cyan-primary)" className="hide-on-mobile" />

          <div style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#f87171' }}>
              <Activity size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>AI Risk Engine</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Dynamic Scoring</span>
          </div>
        </div>
      </section>

      {/* Interactive Simulator & Sample Hardware Schema Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Interactive Hardware Simulator Card */}
        <IoTDeviceCard onTelemetrySent={fetchTelemetry} />

        {/* REST API Specification & Curl Example (Section 30) */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Terminal size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '1.15rem' }}>Hardware REST API Spec</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
            Microcontroller firmware sends periodic JSON HTTP POST payloads directly to:
          </p>

          <pre
            style={{
              background: '#040711',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontSize: '0.78rem',
              color: 'var(--cyan-light)',
              overflowX: 'auto',
              lineHeight: '1.5',
              fontFamily: 'Consolas, monospace'
            }}
          >
{`POST /api/iot/sensor-data
Content-Type: application/json

{
  "device_id": "DEVICE001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "speed": 42.0,
  "vehicle_count": 120,
  "temperature": 29.0,
  "rainfall": 10.0,
  "hazard_detected": false
}`}
          </pre>

          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            ✓ Ingests sensor reading into <code style={{ color: '#ffffff' }}>iot_sensor_data</code><br />
            ✓ Automatically updates congestion in <code style={{ color: '#ffffff' }}>traffic_data</code><br />
            ✓ Dynamically triggers road alerts in <code style={{ color: '#ffffff' }}>hazards</code>
          </div>
        </div>
      </div>

      {/* Compatible Edge Hardware Matrix */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Compatible Sensor Peripherals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {deviceTypes.map((d, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.2rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {d.title}
              </div>
              <span className="badge badge-moderate" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>
                {d.protocol}
              </span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Ingested Telemetry Table */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Live Edge Telemetry Ingestion Log</h3>
          <button onClick={fetchTelemetry} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Poll Telemetry</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            Polling sensor readings...
          </div>
        ) : telemetryFeeds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            No hardware pings recorded yet. Use the simulator above to transmit your first reading.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Node ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Speed</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Vehicles</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Temp & Rain</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Anomaly Flag</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Logged Time</th>
                </tr>
              </thead>
              <tbody>
                {telemetryFeeds.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--cyan-light)' }}>{t.device_id}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {parseFloat(t.latitude).toFixed(3)}, {parseFloat(t.longitude).toFixed(3)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>{t.speed} km/h</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{t.vehicle_count}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{t.temperature}°C | {t.rainfall}mm</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${t.hazard_detected ? 'badge-critical' : 'badge-low'}`}>
                        {t.hazard_detected ? 'Hazard Detected' : 'Corridor Clear'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: 'var(--text-dim)' }}>
                      {t.recorded_at ? new Date(t.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
