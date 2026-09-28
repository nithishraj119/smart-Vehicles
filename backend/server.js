const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./config/database');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const routeRoutes = require('./routes/routeRoutes');
const trafficRoutes = require('./routes/trafficRoutes');
const hazardRoutes = require('./routes/hazardRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const iotRoutes = require('./routes/iotRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Info Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SMART-COMMUTE AI REST API is operational',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      routes: '/api/routes',
      traffic: '/api/traffic',
      hazards: '/api/hazards',
      weather: '/api/weather',
      emergency: '/api/emergency',
      admin: '/api/admin',
      iot: '/api/iot'
    }
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/iot', iotRoutes);

// Catch-all 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Server Initialization
async function startServer() {
  try {
    // 1. Verify Database Connection
    await db.verifyConnection();

    // 2. Start Express HTTP Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
