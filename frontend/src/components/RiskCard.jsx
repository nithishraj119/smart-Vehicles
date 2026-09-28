import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

export default function RiskCard({ analysis }) {
  if (!analysis) {
    return (
      <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
        <ShieldCheck size={48} color="#06b6d4" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
        <h3 style={{ marginBottom: '0.5rem' }}>Route Safety Analysis</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select your starting point and destination on the map, then click "Analyze Route" to generate real-time AI risk insights.
        </p>
      </div>
    );
  }

  const {
    risk_score = 0,
    risk_level = 'LOW',
    recommendation_title = 'LOW-RISK ROUTE',
    recommended_route = '',
    ai_explanation = '',
    contributing_factors = {},
    distance_km = 0,
    estimated_time_mins = 0
  } = analysis;

  const getScoreColor = (score) => {
    if (score <= 30) return '#10b981';
    if (score <= 60) return '#06b6d4';
    if (score <= 80) return '#f59e0b';
    return '#ef4444';
  };

  const getBadgeClass = (lvl) => {
    const l = (lvl || '').toUpperCase();
    if (l === 'CRITICAL') return 'badge-critical';
    if (l === 'HIGH') return 'badge-high';
    if (l === 'MODERATE') return 'badge-moderate';
    return 'badge-low';
  };

  const scoreColor = getScoreColor(risk_score);

  const factorItems = [
    { label: 'Traffic Congestion', key: 'traffic', weight: '25%', factor: contributing_factors.traffic },
    { label: 'Road Hazards', key: 'hazard', weight: '20%', factor: contributing_factors.hazard },
    { label: 'Accident Probability', key: 'accident', weight: '20%', factor: contributing_factors.accident },
    { label: 'Weather Conditions', key: 'weather', weight: '15%', factor: contributing_factors.weather },
    { label: 'Road Surface Condition', key: 'road_condition', weight: '20%', factor: contributing_factors.road_condition }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyan-primary)' }}>
            AI Safety Engine
          </span>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>{recommendation_title}</h2>
        </div>
        <span className={`badge ${getBadgeClass(risk_level)}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.9rem' }}>
          {risk_level} RISK
        </span>
      </div>

      {/* Main Score Display & Meta Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1rem',
        background: 'rgba(7, 11, 20, 0.6)',
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Score Metric */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>RISK SCORE</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
            {risk_score}
            <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 500 }}>/100</span>
          </div>
        </div>

        {/* Distance */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DISTANCE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {distance_km} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>km</span>
          </div>
        </div>

        {/* Est. Duration */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>EST. TRAVEL TIME</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--cyan-light)' }}>
            {estimated_time_mins} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>min</span>
          </div>
        </div>
      </div>

      {/* Recommendation Quote */}
      <div style={{
        background: `rgba(${risk_score > 60 ? '239, 68, 68' : '6, 182, 212'}, 0.08)`,
        borderLeft: `4px solid ${scoreColor}`,
        padding: '1rem',
        borderRadius: '0 8px 8px 0',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: scoreColor, marginBottom: '0.25rem' }}>
          RECOMMENDATION:
        </div>
        <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.5' }}>
          "{recommended_route}"
        </p>
      </div>

      {/* AI Explanation Paragraph */}
      {ai_explanation && (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--cyan-primary)', marginBottom: '0.4rem' }}>
            <Info size={14} />
            <strong>AI DECISION RATIONALE</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {ai_explanation}
          </p>
        </div>
      )}

      {/* Factor Breakdown Bars */}
      <div>
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Risk Contributing Factors
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {factorItems.map((item) => {
            const fScore = item.factor?.score !== undefined ? item.factor.score : 30;
            const fColor = getScoreColor(fScore);
            return (
              <div key={item.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                    {item.label} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({item.weight})</span>
                  </span>
                  <span style={{ color: fColor, fontWeight: 700 }}>
                    {item.factor?.level || (fScore > 60 ? 'High' : 'Moderate')} ({fScore}/100)
                  </span>
                </div>
                {/* Progress track */}
                <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${fScore}%`,
                    height: '100%',
                    background: fColor,
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
