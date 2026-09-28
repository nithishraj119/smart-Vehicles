import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, MapPin, Search, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { routeService } from '../services/api';

export default function History() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await routeService.getHistory();
      setRoutes(response.data?.routes || []);
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getRiskBadge = (lvl) => {
    const l = (lvl || '').toUpperCase();
    if (l === 'CRITICAL') return 'badge-critical';
    if (l === 'HIGH') return 'badge-high';
    if (l === 'MODERATE') return 'badge-moderate';
    return 'badge-low';
  };

  const filteredRoutes = routes.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      (r.recommended_route || '').toLowerCase().includes(term) ||
      (r.risk_level || '').toLowerCase().includes(term) ||
      String(r.risk_score).includes(term) ||
      (r.user_name || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            COMMUTER ARCHIVE
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Route Analysis History</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Audit log of previously evaluated corridors, computed risk indexes, and recommendations.
          </p>
        </div>

        <button onClick={fetchHistory} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="form-input"
          placeholder="Search by risk level, recommendation keyword, or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: 'transparent', border: 'none', padding: '0.25rem' }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* History Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading route history logs...
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No previous route analyses found matching your query.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID & Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Start Coordinates</th>
                <th style={{ padding: '0.75rem 1rem' }}>Destination</th>
                <th style={{ padding: '0.75rem 1rem' }}>Risk Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Risk Level</th>
                <th style={{ padding: '0.75rem 1rem' }}>AI Recommendation</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr
                  key={route.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>#{route.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {route.created_at ? new Date(route.created_at).toLocaleDateString() : 'Today'}
                    </div>
                  </td>

                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ color: '#34d399', fontWeight: 500 }}>
                      {parseFloat(route.start_latitude).toFixed(4)}, {parseFloat(route.start_longitude).toFixed(4)}
                    </div>
                  </td>

                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ color: '#f87171', fontWeight: 500 }}>
                      {parseFloat(route.destination_latitude).toFixed(4)}, {parseFloat(route.destination_longitude).toFixed(4)}
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: route.risk_score > 60 ? '#f87171' : (route.risk_score > 30 ? '#fbbf24' : '#34d399') }}>
                      {route.risk_score}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/100</span>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${getRiskBadge(route.risk_level)}`}>
                      {route.risk_level}
                    </span>
                  </td>

                  <td style={{ padding: '1rem', maxWidth: '380px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4', margin: 0 }}>
                      {route.recommended_route}
                    </p>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => navigate('/route-analysis')}
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                      title="Inspect Corridor on Map"
                    >
                      <ExternalLink size={14} />
                      <span>View Map</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
