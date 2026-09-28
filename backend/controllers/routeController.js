const db = require('../config/database');
const { calculateRouteRisk } = require('../utils/riskCalculator');

// Analyze Route
exports.analyzeRoute = async (req, res) => {
  try {
    const { start, destination } = req.body;

    if (!start || !destination || 
        start.latitude === undefined || start.longitude === undefined ||
        destination.latitude === undefined || destination.longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Please provide valid start and destination coordinates { latitude, longitude }.'
      });
    }

    const startLat = parseFloat(start.latitude);
    const startLon = parseFloat(start.longitude);
    const destLat = parseFloat(destination.latitude);
    const destLon = parseFloat(destination.longitude);

    if (isNaN(startLat) || isNaN(startLon) || isNaN(destLat) || isNaN(destLon)) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates must be valid floating point numbers.'
      });
    }

    // Fetch dynamic context from database
    const [trafficRows] = await db.query('SELECT * FROM traffic_data ORDER BY recorded_at DESC LIMIT 50');
    const [hazardRows] = await db.query('SELECT * FROM hazards ORDER BY created_at DESC LIMIT 50');
    const [weatherRows] = await db.query('SELECT * FROM weather_data ORDER BY recorded_at DESC LIMIT 10');

    // Execute Multi-Factor Risk Calculation Engine
    const analysis = calculateRouteRisk(
      { latitude: startLat, longitude: startLon },
      { latitude: destLat, longitude: destLon },
      trafficRows || [],
      hazardRows || [],
      weatherRows || []
    );

    // Save route analysis record to database
    const userId = req.user ? req.user.id : null;
    let savedRouteId = null;

    try {
      const [insertResult] = await db.query(
        `INSERT INTO routes 
          (user_id, start_latitude, start_longitude, destination_latitude, destination_longitude, risk_score, risk_level, recommended_route)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          startLat,
          startLon,
          destLat,
          destLon,
          analysis.risk_score,
          analysis.risk_level,
          analysis.recommended_route
        ]
      );
      savedRouteId = insertResult.insertId;
    } catch (dbErr) {
      console.warn('Note: Could not persist route analysis record to history:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Route analyzed successfully',
      data: {
        route_id: savedRouteId,
        start: { latitude: startLat, longitude: startLon },
        destination: { latitude: destLat, longitude: destLon },
        ...analysis
      }
    });
  } catch (error) {
    console.error('Route analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze route: ' + error.message
    });
  }
};

// Get Route Analysis History
exports.getRouteHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let routes = [];
    if (req.user && req.user.role === 'admin') {
      // Admin can view all routes with user details
      const [rows] = await db.query(`
        SELECT r.*, u.name as user_name, u.email as user_email 
        FROM routes r
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
        LIMIT 100
      `);
      routes = rows;
    } else if (userId) {
      // User views their own routes
      const [rows] = await db.query(
        'SELECT * FROM routes WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      routes = rows;
    } else {
      // Guest or fallback demo history
      const [rows] = await db.query(
        'SELECT * FROM routes ORDER BY created_at DESC LIMIT 20'
      );
      routes = rows;
    }

    return res.status(200).json({
      success: true,
      data: {
        routes: routes || []
      }
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve route history: ' + error.message
    });
  }
};

// Get Route by ID
exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM routes WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        route: rows[0]
      }
    });
  } catch (error) {
    console.error('Get route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving route: ' + error.message
    });
  }
};
