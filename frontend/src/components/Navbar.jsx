import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Navigation, 
  ShieldAlert, 
  LayoutDashboard, 
  History as HistoryIcon, 
  Cpu, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  Radio
} from 'lucide-react';
import EmergencyButton from './EmergencyButton';
import { authService } from '../services/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Route Analysis', path: '/route-analysis' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Safety & SOS', path: '/emergency' },
    { name: 'History', path: '/history' },
    { name: 'IoT Devices', path: '/devices' },
    ...(currentUser?.role === 'admin' ? [{ name: 'Admin Control', path: '/admin' }] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(7, 11, 20, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.5rem'
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Navigation size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                SMART-COMMUTE <span style={{ color: 'var(--cyan-primary)' }}>AI</span>
              </span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
              Intelligent Transportation Safety & Route Management
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: isActive(link.path) ? 'var(--cyan-primary)' : 'var(--text-muted)',
                background: isActive(link.path) ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                border: isActive(link.path) ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
                transition: 'var(--transition)'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Controls & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Quick SOS Alert Button */}
          <EmergencyButton />

          {/* User Authentication Status */}
          {currentUser ? (
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: currentUser.role === 'admin' ? '#ef4444' : 'var(--cyan-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>{currentUser.name?.split(' ')[0]}</span>
                  {currentUser.role === 'admin' && (
                    <span style={{ fontSize: '0.68rem', color: '#f87171', marginLeft: '4px' }}>[ADMIN]</span>
                  )}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: 'none',
                  padding: '0.4rem',
                  cursor: 'pointer'
                }}
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: 'var(--text-main)',
              display: 'none'
            }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                color: isActive(link.path) ? 'var(--cyan-primary)' : 'var(--text-main)',
                background: isActive(link.path) ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                fontWeight: 500
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign Out ({currentUser.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary"
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hide-on-mobile { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
