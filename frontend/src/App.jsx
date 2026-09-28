import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RouteAnalysis from './pages/RouteAnalysis';
import History from './pages/History';
import Emergency from './pages/Emergency';
import AdminDashboard from './pages/AdminDashboard';
import DeviceIntegration from './pages/DeviceIntegration';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/route-analysis" element={<RouteAnalysis />} />
            <Route path="/history" element={<History />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/devices" element={<DeviceIntegration />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(7, 11, 20, 0.95)',
            padding: '2.5rem 1.5rem',
            marginTop: 'auto'
          }}
        >
          <div
            style={{
              maxWidth: '1360px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                SMART-COMMUTE <span style={{ color: 'var(--cyan-primary)' }}>AI</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '450px' }}>
                Intelligent Transportation Safety & Route Management System. Built for Student Innovation & Hackathon Demonstration.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>Stack</strong>
                <div>React + Vite + Leaflet</div>
                <div>Node.js + Express.js</div>
                <div>MySQL (mysql2/promise)</div>
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>Security</strong>
                <div>JWT Authentication</div>
                <div>Bcrypt Password Hashing</div>
                <div>CORS & Input Validation</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            © {new Date().getFullYear()} SMART-COMMUTE AI. All real-time telemetry simulated for demonstration purposes.
          </div>
        </footer>
      </div>
    </Router>
  );
}
