import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Trash2, 
  Edit, 
  Plus, 
  CheckCircle2, 
  RefreshCw,
  BarChart3,
  Clock
} from 'lucide-react';
import { adminService, hazardService, emergencyService } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hazards' | 'emergencies' | 'users'

  // Hazard Add Modal
  const [newHazard, setNewHazard] = useState({
    hazard_type: 'Pothole',
    severity: 'Moderate',
    latitude: 12.9716,
    longitude: 77.5946,
    description: ''
  });
  const [showAddHazard, setShowAddHazard] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        adminService.getStatistics().catch(() => ({ data: null })),
        adminService.getUsers().catch(() => ({ data: { users: [] } })),
        adminService.getReports().catch(() => ({ data: { hazards: [], emergencies: [] } }))
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data?.users || []);
      setHazards(reportsRes.data?.hazards || []);
      setEmergencies(reportsRes.data?.emergencies || []);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Hazard CRUD Handlers
  const handleAddHazard = async (e) => {
    e.preventDefault();
    try {
      await hazardService.create(newHazard);
      setShowAddHazard(false);
      setNewHazard({
        hazard_type: 'Pothole',
        severity: 'Moderate',
        latitude: 12.9716,
        longitude: 77.5946,
        description: ''
      });
      fetchAdminData();
    } catch (err) {
      alert('Failed to add hazard: ' + err.message);
    }
  };

  const handleDeleteHazard = async (id) => {
    if (!window.confirm('Are you sure you want to remove this road hazard notice?')) return;
    try {
      await hazardService.delete(id);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete hazard: ' + err.message);
    }
  };

  const handleUpdateSeverity = async (id, currentSeverity) => {
    const nextSeverity = currentSeverity === 'Moderate' ? 'High' : (currentSeverity === 'High' ? 'Critical' : 'Moderate');
    try {
      await hazardService.update(id, { severity: nextSeverity });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update severity: ' + err.message);
    }
  };

  // Emergency Status Update Handler
  const handleUpdateEmergencyStatus = async (id, status) => {
    try {
      await emergencyService.updateStatus(id, status);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update emergency status: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#f87171', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            ADMINISTRATOR PRIVILEGES ACTIVE
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Traffic Authority Command Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive regional metrics, hazard lifecycles, user access control, and emergency incident dispatch.
          </p>
        </div>

        <button onClick={fetchAdminData} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh System Data</span>
        </button>
      </div>

      {/* KPI Cards (Section 20) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Total Users */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REGISTERED USERS</span>
            <Users size={18} color="var(--cyan-primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cyan-light)' }}>
            {stats?.total_users || users.length || 3}
          </div>
        </div>

        {/* Total Routes */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EVALUATED ROUTES</span>
            <MapPin size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>
            {stats?.total_routes || 12}
          </div>
        </div>

        {/* Active Hazards */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE HAZARDS</span>
            <AlertTriangle size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>
            {stats?.active_hazards || hazards.length || 7}
          </div>
        </div>

        {/* Emergency Reports */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EMERGENCY ALERTS</span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171' }}>
            {stats?.emergency_reports || emergencies.length || 3}
          </div>
        </div>

        {/* Average Risk Score */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVG RISK INDEX</span>
            <Activity size={18} color="var(--cyan-light)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cyan-primary)' }}>
            {stats?.average_risk_score || 48} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 500 }}>/100</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'overview', label: '📊 Analytical Charts' },
          { key: 'hazards', label: `⚠️ Manage Hazards (${hazards.length})` },
          { key: 'emergencies', label: `🚨 Incident Dispatch (${emergencies.length})` },
          { key: 'users', label: `👥 User Directory (${users.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: activeTab === tab.key ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === tab.key ? 'var(--cyan-light)' : 'var(--text-muted)',
              border: activeTab === tab.key ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Analytical Charts */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Chart 1: Daily Routes Bar Visualization */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Daily Routes Evaluated</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Traffic volume trend across the week.
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px' }}>
              {(stats?.daily_routes || [
                { day: 'Mon', count: 14 },
                { day: 'Tue', count: 22 },
                { day: 'Wed', count: 28 },
                { day: 'Thu', count: 19 },
                { day: 'Fri', count: 35 },
                { day: 'Sat', count: 42 },
                { day: 'Sun', count: 25 }
              ]).map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>{d.count}</div>
                  <div
                    style={{
                      width: '60%',
                      height: `${Math.max(15, (d.count / 45) * 140)}px`,
                      background: 'linear-gradient(180deg, var(--cyan-primary) 0%, rgba(6, 182, 212, 0.2) 100%)',
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Risk Levels Breakdown */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Risk Level Distribution</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Categorization of commuter trips analyzed.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(stats?.risk_level_distribution || [
                { name: 'Low Risk', value: 4, color: '#10b981' },
                { name: 'Moderate Risk', value: 5, color: '#06b6d4' },
                { name: 'High Risk', value: 3, color: '#f59e0b' },
                { name: 'Critical Risk', value: 1, color: '#ef4444' }
              ]).map((item, i) => {
                const total = 13;
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>{item.value} trips ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(8, pct)}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Hazard Types Breakdown */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Active Hazard Types</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              Distribution by physical road hazard category.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {(stats?.hazard_types || [
                { name: 'Pothole', count: 2 },
                { name: 'Accident', count: 1 },
                { name: 'Road Block', count: 1 },
                { name: 'Flood', count: 1 },
                { name: 'Traffic Jam', count: 1 },
                { name: 'Broken Signal', count: 1 }
              ]).map((h, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <span style={{ color: 'var(--cyan-light)', fontWeight: 600 }}>{h.name}:</span>
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>{h.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Hazards */}
      {activeTab === 'hazards' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Regional Hazard Management</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Add new obstacle notices, toggle severity classifications, or clear resolved hazards.
              </p>
            </div>
            <button
              onClick={() => setShowAddHazard(!showAddHazard)}
              className="btn-primary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>{showAddHazard ? 'Close Form' : 'Publish New Hazard'}</span>
            </button>
          </div>

          {/* Add Hazard Form */}
          {showAddHazard && (
            <form onSubmit={handleAddHazard} style={{ background: 'rgba(7, 11, 20, 0.7)', border: '1px solid var(--border-subtle)', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--cyan-light)' }}>Publish Road Hazard Notice</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Hazard Type</label>
                  <select
                    className="form-select"
                    value={newHazard.hazard_type}
                    onChange={(e) => setNewHazard({ ...newHazard, hazard_type: e.target.value })}
                  >
                    <option value="Pothole">Pothole</option>
                    <option value="Accident">Accident</option>
                    <option value="Road Block">Road Block</option>
                    <option value="Flood">Flood</option>
                    <option value="Construction">Construction</option>
                    <option value="Traffic Jam">Traffic Jam</option>
                    <option value="Broken Signal">Broken Signal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Severity</label>
                  <select
                    className="form-select"
                    value={newHazard.severity}
                    onChange={(e) => setNewHazard({ ...newHazard, severity: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={newHazard.latitude}
                    onChange={(e) => setNewHazard({ ...newHazard, latitude: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={newHazard.longitude}
                    onChange={(e) => setNewHazard({ ...newHazard, longitude: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Left lane closed for flyover maintenance"
                  value={newHazard.description}
                  onChange={(e) => setNewHazard({ ...newHazard, description: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                Save & Broadcast Hazard
              </button>
            </form>
          )}

          {/* Hazards Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Hazard Type</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Severity</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Coordinates</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reported By</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hazards.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{h.hazard_type}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${h.severity === 'Critical' ? 'badge-critical' : (h.severity === 'High' ? 'badge-high' : 'badge-moderate')}`}>
                        {h.severity}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {parseFloat(h.latitude).toFixed(3)}, {parseFloat(h.longitude).toFixed(3)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '300px', color: 'var(--text-muted)' }}>
                      {h.description}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {h.reported_by}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => handleUpdateSeverity(h.id, h.severity)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginRight: '6px' }}
                        title="Cycle Severity Level"
                      >
                        Adjust Severity
                      </button>
                      <button
                        onClick={() => handleDeleteHazard(h.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Hazard"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Incident Dispatch Management */}
      {activeTab === 'emergencies' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Emergency Tickets Dispatch Queue</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Update dispatch status as emergency first responders arrive and clear incidents.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Ticket</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Incident Notes</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reporter Phone</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {emergencies.map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#{e.id}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#f87171', fontWeight: 600 }}>{e.emergency_type}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${e.status === 'Resolved' ? 'badge-low' : (e.status === 'Dispatched' ? 'badge-moderate' : 'badge-critical')}`}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '300px', color: 'var(--text-muted)' }}>{e.description}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>{e.user_phone || 'N/A'}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => handleUpdateEmergencyStatus(e.id, 'Dispatched')}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginRight: '6px' }}
                      >
                        Dispatch
                      </button>
                      <button
                        onClick={() => handleUpdateEmergencyStatus(e.id, 'Resolved')}
                        style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Users Directory */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Registered Commuter Profiles</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            User identities authenticated via JWT and secure bcrypt storage in MySQL.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--cyan-light)' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-critical' : 'badge-low'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
