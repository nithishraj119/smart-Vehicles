import React from 'react';
import { CloudRain, Wind, Eye, Droplets, ThermometerSun, Sun } from 'lucide-react';

export default function WeatherCard({ weatherData, routeAnalysis }) {
  const weather = routeAnalysis?.weather_summary || weatherData?.[0] || {
    location: 'Central Transit Hub',
    temperature: 28.5,
    humidity: 68.0,
    rainfall: 15.0,
    visibility: 8.5,
    wind_speed: 14.0
  };

  const isRainy = parseFloat(weather.rainfall) > 10;
  const isLowVisibility = parseFloat(weather.visibility) < 5;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isRainy ? <CloudRain size={20} color="#38bdf8" /> : <Sun size={20} color="#facc15" />}
          <h3 style={{ fontSize: '1.15rem' }}>Environmental Conditions</h3>
        </div>
        <span className="badge badge-low" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
          {weather.location || 'Regional Weather'}
        </span>
      </div>

      {/* Grid of Weather Factors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Temperature */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <ThermometerSun size={14} /> Temp
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.temperature}°C</div>
        </div>

        {/* Rainfall */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <CloudRain size={14} /> Rainfall
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.rainfall} mm</div>
        </div>

        {/* Humidity */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#67e8f9', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Droplets size={14} /> Humidity
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.humidity}%</div>
        </div>

        {/* Visibility */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#a78bfa', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Eye size={14} /> Visibility
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.visibility} km</div>
        </div>

        {/* Wind */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Wind size={14} /> Wind
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.wind_speed} km/h</div>
        </div>
      </div>

      {/* Weather Safety Notice */}
      <div style={{
        fontSize: '0.8rem',
        padding: '0.65rem 0.85rem',
        borderRadius: '8px',
        background: isRainy ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        color: isRainy ? '#7dd3fc' : '#6ee7b7',
        border: `1px solid ${isRainy ? 'rgba(56, 189, 248, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
      }}>
        {isRainy
          ? '🌧️ Wet road conditions: Allow additional braking distance and activate headlights.'
          : '☀️ Clear driving weather: Optimal pavement traction and visibility along corridor.'}
      </div>
    </div>
  );
}
