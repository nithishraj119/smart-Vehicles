# 🚀 SMART-COMMUTE AI

### Intelligent Transportation Safety & Route Management System

> A full-stack student innovation project that analyzes routes, real-time traffic, road hazards, and environmental conditions using a weighted AI risk model to help commuters make safer travel decisions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Demo Credentials](#demo-credentials)
- [How to Run](#how-to-run)
- [Future Improvements](#future-improvements)

---

## Overview

SMART-COMMUTE AI is an intelligent transportation platform built for the **Student Innovation – Creating Intelligent Devices to Improve the Transportation/Commutation Sector** problem statement.

The platform allows commuters to:
1. Select start and destination points on an interactive OpenStreetMap
2. Receive a **weighted multi-factor AI risk score** (0–100)
3. View contributing risk factors (traffic, hazards, weather, accidents, road condition)
4. Get plain-English route safety recommendations
5. Report road emergencies with instant GPS dispatch
6. Simulate IoT edge hardware sensor telemetry

---

## Features

| Feature | Description |
|---|---|
| **Realistic Multi-Basemap HUD** | Zero watermarks & zero API keys: Esri World Street, Esri Photorealistic Satellite, Cyber Dark HUD, and OpenStreetMap |
| **Real-World Road Snapping (OSRM)** | Physical highway and street alignment with actual turns, flyovers, real driving distance (km), and ETA |
| **Live Commuter Trip Simulator** | Dynamic vehicle simulation with animated headlights, radar sweep, heading rotation, and progress telemetry |
| **5-Factor AI Risk Engine** | Traffic (25%) + Hazards (20%) + Accidents (20%) + Weather (15%) + Road Condition (20%) |
| **Risk Level Classification** | LOW (0–30), MODERATE (31–60), HIGH (61–80), CRITICAL (81–100) |
| **Alternative Route Detour** | When risk > 50, the system generates a safer alternative corridor |
| **Real-Time Hazard Detection** | 8 hazard categories: Accident, Pothole, Road Block, Flood, Construction, Traffic Jam, Broken Signal, Other |
| **Weather Environmental Monitoring** | Temperature, humidity, rainfall, visibility, wind speed |
| **Emergency SOS System** | 1-click GPS-tagged emergency dispatch with incident queue tracker |
| **IoT Sensor Integration** | REST endpoint for ESP32/Raspberry Pi hardware with auto-ingestion into traffic + hazard tables |
| **Route History Archive** | Searchable table of all past analyses with risk scores and recommendations |
| **Admin Command Portal** | KPI cards, analytical bar charts, hazard CRUD management, emergency status dispatch |
| **JWT Authentication** | Secure login/register with bcrypt password hashing |
| **Responsive Design** | Works on desktop, tablet, and mobile with dark neon glassmorphism theme |
| **Demo Seed Data** | Pre-loaded users, traffic, hazards, weather, emergencies, and route history |

---

## Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development builds
- **React Router** for SPA navigation
- **Leaflet + React-Leaflet** for interactive mapping (OpenStreetMap)
- **Axios** for REST API communication
- **Lucide React** for icons
- **Vanilla CSS** with glassmorphism, dark theme, neon accents

### Backend
- **Node.js** runtime
- **Express.js** REST API framework
- **MySQL** relational database via **mysql2/promise** connection pool
- **JWT (jsonwebtoken)** for stateless authentication
- **bcrypt** for password hashing (salt rounds: 10)
- **express-validator** for input validation
- **dotenv** for environment variables
- **cors** for cross-origin requests
- **nodemon** for hot-reload development

### Database
- **MySQL 8.0** with 7 tables and realistic demo seed records

---

## Architecture

```
IoT Road Sensor (ESP32/RPi)
        ↓
   Sensor Data (JSON)
        ↓
  Node.js REST API (Express.js)
        ↓
   MySQL Database (mysql2)
        ↓
  AI Risk Calculation Engine
        ↓
  React Frontend Dashboard
        ↓
  Commuter Safety Recommendation
```

---

## Folder Structure

```
PS2-SIH/
│
├── backend/
│   ├── server.js                  # Express server entry point
│   ├── package.json
│   ├── .env                       # Environment variables
│   ├── .env.example
│   ├── init-db.js                 # Standalone DB initialization script
│   │
│   ├── config/
│   │   └── database.js            # MySQL pool + fallback in-memory store
│   │
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile
│   │   ├── routeController.js     # Route analysis, history, detail
│   │   ├── hazardController.js    # Hazard CRUD
│   │   ├── trafficController.js   # Traffic monitoring
│   │   ├── weatherController.js   # Weather data
│   │   ├── emergencyController.js # Emergency SOS reports
│   │   ├── adminController.js     # Admin statistics, users, reports
│   │   └── iotController.js       # IoT sensor telemetry ingestion
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── hazardRoutes.js
│   │   ├── trafficRoutes.js
│   │   ├── weatherRoutes.js
│   │   ├── emergencyRoutes.js
│   │   ├── adminRoutes.js
│   │   └── iotRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── adminMiddleware.js     # Admin role authorization
│   │
│   ├── utils/
│   │   └── riskCalculator.js      # 5-factor weighted risk model
│   │
│   └── database/
│       └── schema.sql             # Full DDL + seed data
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css              # Global design system
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── MapView.jsx
│       │   ├── RiskCard.jsx
│       │   ├── TrafficCard.jsx
│       │   ├── WeatherCard.jsx
│       │   ├── HazardMarker.jsx
│       │   ├── EmergencyButton.jsx
│       │   └── IoTDeviceCard.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── RouteAnalysis.jsx
│       │   ├── History.jsx
│       │   ├── Emergency.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── DeviceIntegration.jsx
│       │
│       └── services/
│           └── api.js             # Centralized Axios client
│
├── test-e2e.js                    # Automated backend verification
└── README.md
```

---

## Installation

### Prerequisites
- **Node.js** v18+ and npm
- **MySQL Server** 8.0 running locally

### Step 1: Clone / Navigate to Project
```bash
cd PS2-SIH
```

### Step 2: Setup MySQL Database

**Option A — Automatic (recommended):**
```bash
cd backend
# Edit .env to set your MySQL root password
npm run init-db
```

**Option B — Manual:**
```bash
mysql -u root -p < backend/database/schema.sql
```

### Step 3: Configure Environment Variables
Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=smart_commute_ai
JWT_SECRET=smart_commute_ai_super_secret_jwt_key_2026_innovation
NODE_ENV=development
```

### Step 4: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 5: Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

## How to Run

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Expected output:
```
Database connected successfully
Server running on port 5000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE ready
➜  Local:   http://localhost:5173/
```

### Open in Browser
Navigate to **http://localhost:5173**

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@smartcommute.ai | password123 |
| **Commuter** | commuter@smartcommute.ai | password123 |
| **User** | priya.sharma@example.com | password123 |

> The Login page includes one-click "Demo User" and "Demo Admin" quick-fill buttons.

---

## API Documentation

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/profile` | JWT | Get current user profile |

### Route Analysis
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/routes/analyze` | Optional | Analyze route risk score |
| GET | `/api/routes/history` | Optional | Get route analysis archive |
| GET | `/api/routes/:id` | No | Get specific route by ID |

### Traffic
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/traffic` | All traffic monitoring points |
| GET | `/api/traffic/nearby?lat=X&lng=Y&radius=Z` | Nearby traffic within radius |
| POST | `/api/traffic` | Log new traffic observation |

### Hazards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hazards` | All active road hazards |
| GET | `/api/hazards/nearby?lat=X&lng=Y` | Nearby hazards |
| POST | `/api/hazards` | Report new hazard |
| PUT | `/api/hazards/:id` | Update hazard severity |
| DELETE | `/api/hazards/:id` | Remove resolved hazard |

### Weather
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/weather` | Current weather data |
| POST | `/api/weather` | Log new weather reading |

### Emergency
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/emergency` | Submit emergency SOS report |
| GET | `/api/emergency` | List all emergency tickets |
| PUT | `/api/emergency/:id` | Update dispatch status |

### Admin (JWT + Admin Role Required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | All registered users |
| GET | `/api/admin/statistics` | Platform KPIs and chart data |
| GET | `/api/admin/reports` | Combined hazard + emergency reports |

### IoT Sensor Integration
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/iot/sensor-data` | Receive hardware sensor telemetry |
| GET | `/api/iot/sensor-data` | Recent telemetry ingestion log |

---

## Risk Calculation Model

```
Risk Score = (Traffic × 0.25) + (Hazard × 0.20) + (Accident × 0.20) + (Weather × 0.15) + (Road × 0.20)

Normalized: 0 – 100

  0–30  → LOW       → "Route is suitable for travel"
 31–60  → MODERATE  → "Remain alert to changing conditions"
 61–80  → HIGH      → "Consider an alternative route"
 81–100 → CRITICAL  → "Avoid this route if possible"
```

Each factor is computed from real database records along the selected corridor using Haversine distance filtering.

---

## Database Tables

| Table | Purpose |
|---|---|
| `users` | Registered commuters and admins (bcrypt passwords) |
| `routes` | Saved route analysis records with risk scores |
| `traffic_data` | Spatial traffic congestion readings |
| `hazards` | Road obstacle and incident notices |
| `weather_data` | Environmental monitoring metrics |
| `emergency_reports` | SOS incident dispatch tickets |
| `iot_sensor_data` | Raw hardware sensor telemetry |

---

## Future Improvements

- **Live External APIs**: Integrate Google Maps Directions API, OpenWeatherMap, TomTom Traffic for real-time data
- **Machine Learning**: Train predictive accident models using historical data
- **Hardware Deployment**: Flash ESP32 firmware to physical roadside sensor nodes
- **Push Notifications**: WebSocket/FCM alerts for corridor condition changes
- **Voice Assistant**: Hands-free route querying for drivers
- **Multi-Language**: Hindi, Tamil, Kannada translations
- **Mobile App**: React Native companion application for commuters
- **Blockchain**: Tamper-proof accident evidence logging

---

## Notes

- All traffic, weather, and hazard data is **simulated/demo data** for demonstration purposes
- The system is designed to accept **real sensor data** through the IoT REST endpoint when hardware is deployed
- Passwords are **never stored in plain text** — all credentials use bcrypt with 10 salt rounds
- The database auto-initializes with seed data on first backend startup

---

## License

MIT — Built for Student Innovation & Hackathon Demonstration

---

*SMART-COMMUTE AI — Travel Smarter. Travel Safer.*
