import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  PhoneCall, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Send, 
  MapPin, 
  Radio, 
  Ambulance, 
  AlertTriangle 
} from 'lucide-react';
import { emergencyService } from '../services/api';

export default function Emergency() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    emergency_type: 'Accident',
    latitude: 12.9716,
    longitude: 77.5946,
    description: ''
  });

  const fetchEmergencies = async () => {
    try {
      const res = await emergencyService.getAll();
      setEmergencies(res.data?.emergencies || []);
    } catch (err) {
      console.warn('Emergency fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await emergencyService.reportEmergency(formData);
      setSuccessMsg('🚨 Emergency report broadcasted! Highway Patrol and Medical Units alerted.');
      setFormData({
        emergency_type: 'Accident',
        latitude: 12.9716,
        longitude: 77.5946,
        description: ''
      });
      fetchEmergencies();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit emergency alert.');
    } finally {
      setSubmitting(false);
    }
  };

  const emergencyContacts = [
    { title: 'National Emergency Helpline', number: '112', desc: 'Integrated police, fire, ambulance service' },
    { title: 'Highway Patrol Emergency', number: '1033', desc: 'National highways roadside assistance & rescue' },
    { title: 'Traffic Police Control Room', number: '103', desc: 'Accident reporting & gridlock clearance' },
    { title: 'Ambulance & Trauma Care', number: '108', desc: 'Emergency medical response & patient transit' }
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return 'badge-low';
    if (s === 'dispatched') return 'badge-moderate';
    return 'badge-critical';
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--crimson-glow)'
            }}
          >
            <AlertCircle size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#f87171' }}>Emergency Response & Roadside SOS</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Instant geolocation dispatch to traffic patrol, medical trauma teams, and municipal towing units.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Form: Submit Emergency Alert */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={20} color="#ef4444" />
            <span>Dispatch Road SOS Alert</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Provide coordinates and incident details. An automated high-priority ticket will be created in the emergency response queue.
          </p>

          {successMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Category */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Incident Classification
              </label>
              <select
                className="form-select"
                value={formData.emergency_type}
                onChange={(e) => setFormData({ ...formData, emergency_type: e.target.value })}
                required
              >
                <option value="Accident">💥 Collision / Road Accident</option>
                <option value="Medical Emergency">🚑 Medical Emergency</option>
                <option value="Road Block">🚫 Road Block / Major Debris</option>
                <option value="Vehicle Breakdown">🚗 Vehicle Breakdown / Stalled Heavy Vehicle</option>
                <option value="Flood">🌊 Flash Flood / Severe Inundation</option>
                <option value="Other">⚠️ Other Critical Danger</option>
              </select>
            </div>

            {/* Coordinates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Incident Description & Severity Notes
              </label>
              <textarea
                rows={4}
                className="form-input"
                placeholder="Specify number of vehicles, injured parties, and blocked lanes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-emergency"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              <Send size={18} />
              <span>{submitting ? 'Transmitting Alert...' : 'Transmit Priority Emergency Dispatch'}</span>
            </button>
          </form>
        </div>

        {/* Directory: Emergency Contacts & Quick Dial */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PhoneCall size={18} color="var(--cyan-primary)" />
              <span>Dedicated Emergency Helplines</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.9rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {contact.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {contact.desc}
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: 'var(--cyan-light)',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    }}
                  >
                    📞 {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Zones Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, marginBottom: '0.4rem' }}>
              <ShieldAlert size={18} />
              <span>Designated Highway Safe Havens</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              If your vehicle is compromised on an expressway, maneuver to the nearest designated 24/7 Toll Plaza or Highway Patrol Outpost equipped with emergency CCTV and medical first-aid stations.
            </p>
          </div>
        </div>
      </div>

      {/* Incident Dispatch Tracker */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Live Emergency Dispatch Tracker</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            Loading active emergency tickets...
          </div>
        ) : emergencies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            No pending emergency reports on file.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {emergencies.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#f87171' }}>{item.emergency_type}</strong>
                  <span className={`badge ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                  {item.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Location: {parseFloat(item.latitude).toFixed(3)}, {parseFloat(item.longitude).toFixed(3)}</span>
                  <span>{item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                </div>
              </div>
            ))}
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
