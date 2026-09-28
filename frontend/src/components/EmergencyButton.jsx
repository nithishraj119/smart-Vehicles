import React, { useState } from 'react';
import { AlertCircle, X, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { emergencyService } from '../services/api';

export default function EmergencyButton({ defaultLocation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    emergency_type: 'Accident',
    latitude: defaultLocation?.latitude || 12.9716,
    longitude: defaultLocation?.longitude || 77.5946,
    description: ''
  });

  const handleOpen = () => {
    // Attempt HTML5 Geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(pos.coords.latitude.toFixed(5)),
            longitude: parseFloat(pos.coords.longitude.toFixed(5))
          }));
        },
        () => {
          // If denied, fallback to default or current route
          if (defaultLocation) {
            setFormData((prev) => ({
              ...prev,
              latitude: defaultLocation.latitude,
              longitude: defaultLocation.longitude
            }));
          }
        }
      );
    }
    setSuccessMsg('');
    setErrorMsg('');
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await emergencyService.reportEmergency(formData);
      setSuccessMsg('🚨 Emergency alert transmitted! First responders & traffic control have been notified.');
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg('');
        setFormData({
          emergency_type: 'Accident',
          latitude: defaultLocation?.latitude || 12.9716,
          longitude: defaultLocation?.longitude || 77.5946,
          description: ''
        });
      }, 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch emergency alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="btn-emergency" title="Trigger Instant Road Emergency Alert">
        <AlertCircle size={18} />
        <span>EMERGENCY SOS</span>
      </button>

      {/* Emergency Modal Dialog */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              border: '2px solid #ef4444',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.45)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🚨</span>
                <div>
                  <h3 style={{ color: '#f87171', fontSize: '1.35rem' }}>Report Road Emergency</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Immediate response will be dispatched to these GPS coordinates
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ color: '#34d399', marginBottom: '0.5rem' }}>Alert Dispatched</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMsg && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                {/* Emergency Type */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Emergency Category
                  </label>
                  <select
                    className="form-select"
                    value={formData.emergency_type}
                    onChange={(e) => setFormData({ ...formData, emergency_type: e.target.value })}
                    required
                  >
                    <option value="Accident">💥 Collision / Road Accident</option>
                    <option value="Medical Emergency">🚑 Medical Emergency</option>
                    <option value="Vehicle Breakdown">🚗 Vehicle Breakdown / Stalled</option>
                    <option value="Road Block">🚫 Dangerous Road Obstacle / Block</option>
                    <option value="Flood">🌊 Severe Flash Flood / Waterlogging</option>
                    <option value="Other">⚠️ Other Urgent Hazard</option>
                  </select>
                </div>

                {/* Coordinates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
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
                    Situation Description (Vehicles involved, injuries, lane status)
                  </label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Describe the incident so emergency teams arrive prepared..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-emergency"
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    <Send size={16} />
                    <span>{loading ? 'Transmitting...' : 'Dispatch SOS Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
