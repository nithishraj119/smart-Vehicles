import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  RotateCcw, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import MapView from '../components/MapView';
import RiskCard from '../components/RiskCard';
import TrafficCard from '../components/TrafficCard';
import WeatherCard from '../components/WeatherCard';
import Sidebar from '../components/Sidebar';
import { routeService, trafficService, hazardService, weatherService } from '../services/api';

export default function RouteAnalysis() {
  const [start, setStart] = useState({ latitude: 12.9716, longitude: 77.5946 });
  const [destination, setDestination] = useState({ latitude: 12.9352, longitude: 77.6245 });
  const [clickStep, setClickStep] = useState(0); // 0 = next click sets start, 1 = next click sets destination
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activePreset, setActivePreset] = useState('');

  // Environmental layers from backend
  const [hazards, setHazards] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [weatherList, setWeatherList] = useState([]);

  // Load contextual spatial data
  useEffect(() => {
    async function loadLayers() {
      try {
        const [hRes, tRes, wRes] = await Promise.all([
          hazardService.getAll().catch(() => ({ data: { hazards: [] } })),
          trafficService.getAll().catch(() => ({ data: { traffic: [] } })),
          weatherService.getWeather().catch(() => ({ data: { weather: [] } }))
        ]);
        setHazards(hRes.data?.hazards || []);
        setTraffic(tRes.data?.traffic || []);
        setWeatherList(wRes.data?.weather || []);
      } catch (e) {
        console.warn('Layer load notice:', e.message);
      }
    }
    loadLayers();
  }, []);

  // Handle map clicks to set start or destination
  const handleMapClick = (coords) => {
    if (clickStep === 0) {
      setStart(coords);
      setClickStep(1);
      setActivePreset('');
    } else {
      setDestination(coords);
      setClickStep(0);
      setActivePreset('');
    }
  };

  // Select Preset Corridor from Sidebar
  const handleSelectPreset = (preset) => {
    setStart(preset.start);
    setDestination(preset.destination);
    setActivePreset(preset.name);
    setClickStep(0);
  };

  // Reset Route
  const handleReset = () => {
    setStart(null);
    setDestination(null);
    setClickStep(0);
    setAnalysisResult(null);
    setErrorMsg('');
    setActivePreset('');
  };

  // Execute Route Analysis via REST API
  const handleAnalyze = async () => {
    if (!start || !destination) {
      setErrorMsg('Please select both a Start location and Destination on the map.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    try {
      const response = await routeService.analyzeRoute({
        start: { latitude: start.latitude, longitude: start.longitude },
        destination: { latitude: destination.latitude, longitude: destination.longitude }
      });

      if (response.success && response.data) {
        setAnalysisResult(response.data);
      } else {
        setErrorMsg(response.message || 'Unable to compute route risk.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to route analysis service.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--cyan-primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            INTELLIGENT ROUTE MANAGEMENT
          </span>
          <h1 style={{ fontSize: '1.85rem', marginTop: '0.2rem' }}>
            Spatial Route Risk Analyzer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Click anywhere on the map to set Start (Point A) and Destination (Point B) or pick from preset corridors.
          </p>
        </div>

        {/* Quick Selection Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: 'rgba(7, 11, 20, 0.7)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: clickStep === 0 ? '#10b981' : '#ef4444' }} />
            Next Map Click Sets: <strong style={{ color: clickStep === 0 ? '#34d399' : '#f87171' }}>{clickStep === 0 ? 'Point A (Start)' : 'Point B (Destination)'}</strong>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Main Workspace Grid: Sidebar Presets (Left) + Interactive Map (Center/Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Left Sidebar */}
        <div>
          <Sidebar
            onSelectPreset={handleSelectPreset}
            activePreset={activePreset}
          />
        </div>

        {/* Center Map & Route Controls */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Coordinates Bar & Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              background: 'rgba(7, 11, 20, 0.6)',
              padding: '0.85rem 1rem',
              borderRadius: '10px'
            }}
          >
            {/* Start Pin Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>START (A)</span>
                <strong>{start ? `${start.latitude}, ${start.longitude}` : 'Click map to select'}</strong>
              </div>
            </div>

            <ChevronRight size={18} color="var(--text-dim)" />

            {/* Destination Pin Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>DESTINATION (B)</span>
                <strong>{destination ? `${destination.latitude}, ${destination.longitude}` : 'Click map to select'}</strong>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
              <button
                onClick={handleReset}
                className="btn-secondary"
                style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}
                title="Reset Selected Points"
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !start || !destination}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                <Sparkles size={16} />
                <span>{analyzing ? 'Evaluating Risk Model...' : 'Analyze Route'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Map */}
          <div style={{ minHeight: '520px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapView
              start={start}
              destination={destination}
              onMapClick={handleMapClick}
              routeAnalysis={analysisResult}
              hazards={hazards}
              traffic={traffic}
              height="520px"
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* Analysis Results Display (when analyzed) */}
      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Risk Card */}
          <RiskCard analysis={analysisResult} />

          {/* Environmental & Traffic Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <TrafficCard trafficData={traffic} routeAnalysis={analysisResult} />
            <WeatherCard weatherData={weatherList} routeAnalysis={analysisResult} />
          </div>

          {/* Localized Hazards Detected along Corridor */}
          {analysisResult.hazards_detected && analysisResult.hazards_detected.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.2rem' }}>
                  Reported Physical Hazards Along This Corridor ({analysisResult.hazards_detected.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {analysisResult.hazards_detected.map((h, i) => (
                  <div
                    key={h.id || i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '1rem',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${h.severity === 'Critical' ? '#ef4444' : '#f59e0b'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <strong>{h.hazard_type}</strong>
                      <span className={`badge ${h.severity === 'Critical' ? 'badge-critical' : 'badge-high'}`}>
                        {h.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {h.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          div[style*="gridTemplateColumns: 290px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
