import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Crosshair, 
  ShieldCheck, 
  Gauge, 
  Clock, 
  Navigation,
  Eye,
  EyeOff
} from 'lucide-react';
import HazardMarker from './HazardMarker';

// =======================================================
// MAP BASEMAP CONFIGURATIONS (100% Free, NO API KEY, Zero Watermarks)
// =======================================================
const MAP_THEMES = {
  street: {
    id: 'street',
    name: 'Realistic Street',
    icon: '🛣️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; OpenStreetMap, TomTom, DeLorme',
    maxZoom: 19,
    cssClass: ''
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Photoreal',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
    maxZoom: 18,
    cssClass: ''
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Dark HUD',
    icon: '🌙',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Smart-Commute Cyber Filter',
    maxZoom: 19,
    cssClass: 'map-cyber-tiles'
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    icon: '🌐',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    cssClass: ''
  }
};

// Start and Destination custom pins
const startIcon = L.divIcon({
  className: 'custom-start-marker',
  html: `
    <div style="
      background: #10b981;
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #ffffff;
      box-shadow: 0 0 18px rgba(16, 185, 129, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="transform: rotate(45deg); color: #ffffff; font-weight: 800; font-size: 14px;">A</div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34]
});

const destIcon = L.divIcon({
  className: 'custom-dest-marker',
  html: `
    <div style="
      background: #ef4444;
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #ffffff;
      box-shadow: 0 0 18px rgba(239, 68, 68, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="transform: rotate(45deg); color: #ffffff; font-weight: 800; font-size: 14px;">B</div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34]
});

// Helper: Calculate bearing between two GPS coordinates (degrees)
function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const toDeg = rad => (rad * 180) / Math.PI;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Generate animated commuter vehicle icon with heading
function createVehicleIcon(bearing = 0) {
  return L.divIcon({
    className: 'commuter-sim-vehicle',
    html: `
      <div style="transform: rotate(${bearing}deg); position: relative; width: 34px; height: 34px;">
        <div class="sim-radar-ripple"></div>
        <div class="sim-headlight-beam"></div>
        <div class="sim-vehicle-body">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

// Component to handle map clicks for route selection
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          latitude: parseFloat(e.latlng.lat.toFixed(5)),
          longitude: parseFloat(e.latlng.lng.toFixed(5))
        });
      }
    }
  });
  return null;
}

// Map Auto-Fitter for route boundaries
function MapBoundsUpdater({ start, destination, waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints && waypoints.length > 1) {
      const bounds = L.latLngBounds(waypoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (start && destination) {
      const bounds = L.latLngBounds(
        [start.latitude, start.longitude],
        [destination.latitude, destination.longitude]
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (start) {
      map.setView([start.latitude, start.longitude], 13);
    }
  }, [start, destination, waypoints, map]);

  return null;
}

// Controller component to center map on user location
function MapCenterController({ centerTrigger }) {
  const map = useMap();
  useEffect(() => {
    if (centerTrigger) {
      map.flyTo([centerTrigger.latitude, centerTrigger.longitude], centerTrigger.zoom || 14, {
        duration: 1.2
      });
    }
  }, [centerTrigger, map]);
  return null;
}

export default function MapView({
  start,
  destination,
  onMapClick,
  routeAnalysis,
  hazards = [],
  traffic = [],
  height = '520px',
  interactive = true,
  center = [12.9716, 77.5946],
  zoom = 12
}) {
  // Theme state: 'street', 'satellite', 'cyber', 'osm'
  const [currentTheme, setCurrentTheme] = useState('street');
  
  // Real OSRM Road Snap Geometries & Telemetry
  const [snappedRoute, setSnappedRoute] = useState([]);
  const [roadMetrics, setRoadMetrics] = useState({ distanceKm: null, durationMin: null });
  const [snappingActive, setSnappingActive] = useState(false);

  // Commuter Trip Simulator state
  const [simActive, setSimActive] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 4x
  const simTimerRef = useRef(null);

  // Layer Visibility Toggles
  const [showTraffic, setShowTraffic] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [centerTrigger, setCenterTrigger] = useState(null);

  // Determine route stroke color according to risk score
  let routeColor = '#06b6d4';
  if (routeAnalysis?.risk_score !== undefined) {
    const score = routeAnalysis.risk_score;
    if (score <= 30) routeColor = '#10b981';
    else if (score <= 60) routeColor = '#06b6d4';
    else if (score <= 80) routeColor = '#f59e0b';
    else routeColor = '#ef4444';
  }

  // Fetch real road snapping coordinates from free public OSRM engine
  useEffect(() => {
    if (!start || !destination) {
      setSnappedRoute([]);
      setRoadMetrics({ distanceKm: null, durationMin: null });
      setSimActive(false);
      setSimIndex(0);
      return;
    }

    let isSubscribed = true;
    async function fetchRealRoadRoute() {
      setSnappingActive(true);
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM routing query error');
        const data = await res.json();

        if (isSubscribed && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setSnappedRoute(coords);
          setRoadMetrics({
            distanceKm: (data.routes[0].distance / 1000).toFixed(1),
            durationMin: Math.ceil(data.routes[0].duration / 60)
          });
        }
      } catch (err) {
        // Graceful fallback to backend waypoints or direct line
        console.warn('Real road geometry fallback:', err.message);
        if (isSubscribed) {
          const fallback = routeAnalysis?.waypoints || [
            [start.latitude, start.longitude],
            [destination.latitude, destination.longitude]
          ];
          setSnappedRoute(fallback);
        }
      } finally {
        if (isSubscribed) setSnappingActive(false);
      }
    }

    fetchRealRoadRoute();
    return () => {
      isSubscribed = false;
    };
  }, [start?.latitude, start?.longitude, destination?.latitude, destination?.longitude, routeAnalysis?.waypoints]);

  // Primary active polyline waypoints (Snapped road geometry prioritized)
  const activeWaypoints = snappedRoute.length > 1 ? snappedRoute : (
    routeAnalysis?.waypoints || (
      start && destination ? [
        [start.latitude, start.longitude],
        [destination.latitude, destination.longitude]
      ] : []
    )
  );

  // Commuter Trip Simulation Controller
  useEffect(() => {
    if (simActive && activeWaypoints.length > 2) {
      const intervalMs = Math.max(30, Math.floor(180 / simSpeed));
      simTimerRef.current = setInterval(() => {
        setSimIndex((prev) => {
          if (prev >= activeWaypoints.length - 1) {
            setSimActive(false);
            return activeWaypoints.length - 1;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [simActive, activeWaypoints, simSpeed]);

  // Reset simulation when route changes
  useEffect(() => {
    setSimIndex(0);
    setSimActive(false);
  }, [start, destination]);

  // Compute vehicle current position & heading angle
  const currentPos = activeWaypoints[simIndex] || activeWaypoints[0];
  const nextPos = activeWaypoints[Math.min(simIndex + 1, activeWaypoints.length - 1)];
  const currentBearing = (currentPos && nextPos) 
    ? calculateBearing(currentPos[0], currentPos[1], nextPos[0], nextPos[1])
    : 0;

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(5));
          const lng = parseFloat(pos.coords.longitude.toFixed(5));
          setCenterTrigger({ latitude: lat, longitude: lng, zoom: 15 });
          if (onMapClick && !start) {
            onMapClick({ latitude: lat, longitude: lng });
          }
        },
        () => {
          // Default to Bangalore City Hub if GPS denied
          setCenterTrigger({ latitude: 12.9716, longitude: 77.5946, zoom: 14 });
        }
      );
    } else {
      setCenterTrigger({ latitude: 12.9716, longitude: 77.5946, zoom: 14 });
    }
  };

  const selectedThemeObj = MAP_THEMES[currentTheme] || MAP_THEMES.street;

  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
      
      {/* =======================================================
          TOP-RIGHT: INNOVATIVE MAP STYLE SWITCHER (NO CARTO / ZERO WATERMARK)
          ======================================================= */}
      <div 
        className="map-hud-control"
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 1000,
          display: 'flex',
          gap: '4px',
          padding: '4px'
        }}
      >
        {Object.values(MAP_THEMES).map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`map-hud-btn ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => setCurrentTheme(theme.id)}
            title={theme.name}
          >
            <span>{theme.icon}</span>
            <span className="hide-on-mobile">{theme.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* =======================================================
          TOP-LEFT: LIVE ROAD TELEMETRY HUD
          ======================================================= */}
      {start && destination && (
        <div
          className="map-hud-control"
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 1000,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '0.8rem',
            color: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} color="var(--cyan-primary)" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ROAD DISTANCE</div>
              <strong style={{ color: '#ffffff' }}>
                {roadMetrics.distanceKm ? `${roadMetrics.distanceKm} km` : (routeAnalysis?.distance_km ? `${routeAnalysis.distance_km} km` : 'Calculating...')}
              </strong>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ESTIMATED TIME</div>
              <strong style={{ color: '#ffffff' }}>
                {roadMetrics.durationMin ? `${roadMetrics.durationMin} mins` : (routeAnalysis?.estimated_time_mins ? `${routeAnalysis.estimated_time_mins} mins` : '18 mins')}
              </strong>
            </div>
          </div>

          {routeAnalysis?.risk_score !== undefined && (
            <>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color={routeColor} />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RISK INDEX</div>
                  <strong style={{ color: routeColor }}>
                    {routeAnalysis.risk_score}/100 ({routeAnalysis.risk_level})
                  </strong>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* =======================================================
          SIMULATION CONTROLLER BAR (WHEN ROUTE READY)
          ======================================================= */}
      {activeWaypoints.length > 2 && (
        <div
          className="map-hud-control"
          style={{
            position: 'absolute',
            bottom: '68px',
            left: '14px',
            zIndex: 1000,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button
            type="button"
            className="map-hud-btn active"
            onClick={() => setSimActive(!simActive)}
            style={{ padding: '6px 12px' }}
          >
            {simActive ? <Pause size={14} /> : <Play size={14} />}
            <span>{simActive ? 'Pause Sim' : 'Simulate Trip'}</span>
          </button>

          <button
            type="button"
            className="map-hud-btn"
            onClick={() => {
              setSimActive(false);
              setSimIndex(0);
            }}
            title="Reset Simulation"
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            className="map-hud-btn"
            onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
            title="Simulation Speed"
          >
            <span>{simSpeed}x</span>
          </button>

          {simActive && (
            <div style={{ fontSize: '0.74rem', color: 'var(--cyan-light)', marginLeft: '4px' }}>
              🚗 Moving: {Math.round((simIndex / (activeWaypoints.length - 1)) * 100)}%
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          BOTTOM-LEFT: QUICK ACTION TOOLBAR
          ======================================================= */}
      <div
        className="map-hud-control"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '14px',
          zIndex: 1000,
          display: 'flex',
          gap: '4px',
          padding: '4px'
        }}
      >
        <button
          type="button"
          className="map-hud-btn"
          onClick={handleLocateMe}
          title="Quick GPS Focus"
        >
          <Crosshair size={14} color="var(--cyan-primary)" />
          <span className="hide-on-mobile">Locate Me</span>
        </button>

        <button
          type="button"
          className={`map-hud-btn ${showTraffic ? 'active' : ''}`}
          onClick={() => setShowTraffic(!showTraffic)}
          title="Toggle Traffic Rings"
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>Traffic</span>
        </button>

        <button
          type="button"
          className={`map-hud-btn ${showHazards ? 'active' : ''}`}
          onClick={() => setShowHazards(!showHazards)}
          title="Toggle Hazards"
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          <span>Hazards</span>
        </button>
      </div>

      {/* =======================================================
          REACT-LEAFLET CORE MAP
          ======================================================= */}
      <div className={selectedThemeObj.cssClass} style={{ height: '100%', width: '100%' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={interactive}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Realistic Clean Basemap (No API key, No watermarks) */}
          <TileLayer
            key={selectedThemeObj.id}
            attribution={selectedThemeObj.attribution}
            url={selectedThemeObj.url}
            maxZoom={selectedThemeObj.maxZoom}
          />

          {interactive && <MapClickHandler onMapClick={onMapClick} />}
          <MapBoundsUpdater start={start} destination={destination} waypoints={activeWaypoints} />
          <MapCenterController centerTrigger={centerTrigger} />

          {/* Start Origin Marker */}
          {start && (
            <Marker position={[start.latitude, start.longitude]} icon={startIcon}>
              <Popup>
                <div style={{ padding: '2px' }}>
                  <strong style={{ color: '#10b981' }}>Origin Point A</strong>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                    {start.latitude}, {start.longitude}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker position={[destination.latitude, destination.longitude]} icon={destIcon}>
              <Popup>
                <div style={{ padding: '2px' }}>
                  <strong style={{ color: '#ef4444' }}>Destination Point B</strong>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                    {destination.latitude}, {destination.longitude}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Glowing Aura Polyline Underneath */}
          {activeWaypoints.length > 1 && (
            <Polyline
              positions={activeWaypoints}
              pathOptions={{
                color: routeColor,
                weight: 12,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}

          {/* Primary Route Polyline (Snapped to real roads) */}
          {activeWaypoints.length > 1 && (
            <Polyline
              positions={activeWaypoints}
              pathOptions={{
                color: routeColor,
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}

          {/* Recommended Alternative Detour Polyline (if detour recommended) */}
          {routeAnalysis?.alternative_route?.waypoints?.length > 1 && (
            <Polyline
              positions={routeAnalysis.alternative_route.waypoints}
              pathOptions={{
                color: '#10b981',
                weight: 4,
                dashArray: '8, 8',
                opacity: 0.85
              }}
            />
          )}

          {/* Commuter Simulated Vehicle Marker */}
          {currentPos && (simActive || simIndex > 0) && (
            <Marker position={currentPos} icon={createVehicleIcon(currentBearing)}>
              <Popup>
                <div style={{ fontSize: '0.82rem' }}>
                  <strong style={{ color: 'var(--cyan-primary)' }}>Active Commuter Vehicle</strong>
                  <div>Speed: {42 * simSpeed} km/h</div>
                  <div>Progress: {Math.round((simIndex / (activeWaypoints.length - 1)) * 100)}%</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Traffic Congestion Intensity Rings */}
          {showTraffic && traffic.map((t) => {
            let ringColor = '#10b981';
            const lvl = (t.congestion_level || '').toLowerCase();
            if (lvl === 'critical') ringColor = '#ef4444';
            else if (lvl === 'heavy') ringColor = '#f97316';
            else if (lvl === 'moderate') ringColor = '#eab308';

            return (
              <Circle
                key={`traffic-${t.id || Math.random()}`}
                center={[parseFloat(t.latitude), parseFloat(t.longitude)]}
                radius={750}
                pathOptions={{
                  color: ringColor,
                  fillColor: ringColor,
                  fillOpacity: 0.22,
                  weight: 1.5
                }}
              >
                <Popup>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: ringColor }}>{t.congestion_level} Congestion</strong>
                    <div>Speed: {t.average_speed} km/h</div>
                    <div>Vehicles: {t.vehicle_count}</div>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Hazards Pins */}
          {showHazards && hazards.map((h) => (
            <HazardMarker key={`hazard-${h.id || Math.random()}`} hazard={h} />
          ))}
        </MapContainer>
      </div>

      {/* =======================================================
          BOTTOM-RIGHT: COMPACT FLOATING MAP LEGEND
          ======================================================= */}
      <div
        className="map-hud-control"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          padding: '8px 12px',
          fontSize: '0.74rem',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          Point A
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          Point B
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '3px', background: routeColor }} />
          Road Route
        </span>
        {routeAnalysis?.alternative_route?.recommended && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '2px', borderTop: '2px dashed #10b981' }} />
            Safe Detour
          </span>
        )}
      </div>
    </div>
  );
}
