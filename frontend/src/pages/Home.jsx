import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Activity, 
  CloudRain, 
  Eye, 
  Gauge, 
  MapPin, 
  Radio
} from 'lucide-react';

export default function Home() {
  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Hero Section */}
      <section
        className="glass-panel"
        style={{
          padding: '4rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3.5rem',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          background: 'linear-gradient(135deg, rgba(14, 23, 44, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)'
        }}
      >
        {/* Futuristic glowing backdrop accent circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          {/* Innovation Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--cyan-light)',
              marginBottom: '1.5rem'
            }}
          >
            <Radio size={14} className="pulse-cyan" />
            <span>STUDENT INNOVATION – SMART TRANSPORTATION PLATFORM</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              fontWeight: 900,
              marginBottom: '1.25rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Travel Smarter.<br />Travel Safer.
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '650px'
            }}
          >
            An intelligent transportation platform that analyzes routes, real-time traffic, reported hazards, and environmental conditions to help commuters make safer and more informed travel decisions.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/route-analysis" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 1.8rem' }}>
              <Navigation size={18} />
              <span>Analyze My Route</span>
            </Link>

            <Link to="/dashboard" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.9rem 1.8rem' }}>
              <Activity size={18} />
              <span>View Safety Map</span>
            </Link>
          </div>
        </div>

        {/* Live System Stats Quick Bar */}
        <div
          style={{
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>WEIGHTED RISK MODEL</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cyan-light)' }}>5-Factor AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Traffic, Hazards, Weather & Road</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>CORRIDOR MONITORING</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>Active</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dynamic waypoint hazard scan</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>IOT EDGE READY</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>REST Ingestion</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPS, Radar & Weather sensor feeds</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>SOS INCIDENT DISPATCH</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>Instant 1-Click</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct GPS coordinate broadcast</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Flow (Section 28 & 29) */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            System Architecture
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.3rem' }}>How Smart-Commute AI Operates</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            From edge road sensors to algorithmic risk scoring and commuter recommendations.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* Step 1 */}
          <div className="glass-card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cyan-primary)' }}>
              <Cpu size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: 700, marginBottom: '0.25rem' }}>STEP 01</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>IoT Sensor Telemetry</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Roadside ESP32 microcontrollers, GPS vehicle monitors, and weather probes capture speed, volume, and surface anomalies.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#10b981' }}>
              <Zap size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '0.25rem' }}>STEP 02</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Node.js REST API</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Express backend receives sensor payloads, validates JWT credentials, and writes structured records into MySQL tables.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#f59e0b' }}>
              <Activity size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.25rem' }}>STEP 03</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Weighted AI Risk Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Multi-factor algorithm computes weighted risk (Traffic 25%, Hazards 20%, Accidents 20%, Weather 15%, Road 20%) normalized 0–100.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#a855f7' }}>
              <ShieldCheck size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 700, marginBottom: '0.25rem' }}>STEP 04</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Smart Route Guidance</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Commuters receive plain-English risk advice, alternative detours, hazard pins, and live conditions on interactive maps.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Platform Capabilities
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.3rem' }}>Built for Commuters & Transportation Authorities</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertTriangle size={24} color="#f59e0b" />
              <h3 style={{ fontSize: '1.25rem' }}>Real-Time Hazard Detection</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Displays and categorizes active potholes, construction blocks, flash floods, broken traffic signals, and severe collisions on OpenStreetMap with severity tiers.
            </p>
            <Link to="/route-analysis" style={{ color: 'var(--cyan-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Explore on Interactive Map <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <CloudRain size={24} color="#38bdf8" />
              <h3 style={{ fontSize: '1.25rem' }}>Weather Environmental Risk</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Integrates ambient weather metrics including precipitation rate, wind shear, and visual range to dynamically augment braking distance calculations.
            </p>
            <Link to="/dashboard" style={{ color: 'var(--cyan-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View Weather Snapshot <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Cpu size={24} color="#10b981" />
              <h3 style={{ fontSize: '1.25rem' }}>Intelligent Device Integration</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Designed as a true IoT-ready ecosystem. Test hardware sensor simulation endpoints directly from the interface to observe live risk recalibration.
            </p>
            <Link to="/devices" style={{ color: 'var(--cyan-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Test IoT Simulator <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}
      >
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>Ready to Experience Smarter Commuting?</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
          Select your travel coordinates or choose popular inter-city corridors to view real-time safety risk scores and AI routing recommendations.
        </p>
        <Link to="/route-analysis" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
          <Navigation size={18} />
          <span>Launch Route Analyzer</span>
        </Link>
      </section>
    </div>
  );
}
