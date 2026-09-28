const db = require('../config/database');
const { calculateDistanceKm } = require('../utils/riskCalculator');

// Get all traffic records
exports.getAllTraffic = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM traffic_data ORDER BY recorded_at DESC LIMIT 100');
    return res.status(200).json({
      success: true,
      message: 'Traffic data retrieved successfully',
      data: {
        traffic: rows || []
      }
    });
  } catch (error) {
    console.error('Get traffic error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve traffic data: ' + error.message
    });
  }
};

// Get nearby traffic by coordinates and radius
exports.getNearbyTraffic = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates (lat, lng) are required.'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radKm = parseFloat(radius);

    const [rows] = await db.query('SELECT * FROM traffic_data ORDER BY recorded_at DESC');

    const nearby = (rows || []).filter(item => {
      const dist = calculateDistanceKm(latitude, longitude, parseFloat(item.latitude), parseFloat(item.longitude));
      return dist <= radKm;
    });

    return res.status(200).json({
      success: true,
      data: {
        traffic: nearby
      }
    });
  } catch (error) {
    console.error('Nearby traffic error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve nearby traffic: ' + error.message
    });
  }
};

// Create a new traffic record (e.g. from IoT sensor or admin monitoring)
exports.createTrafficRecord = async (req, res) => {
  try {
    const { latitude, longitude, congestion_level, average_speed, vehicle_count } = req.body;

    if (!latitude || !longitude || !congestion_level) {
      return res.status(400).json({
        success: false,
        message: 'latitude, longitude, and congestion_level are required fields.'
      });
    }

    const [result] = await db.query(
      `INSERT INTO traffic_data (latitude, longitude, congestion_level, average_speed, vehicle_count) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        parseFloat(latitude),
        parseFloat(longitude),
        congestion_level,
        parseFloat(average_speed) || 0,
        parseInt(vehicle_count, 10) || 0
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Traffic record logged successfully',
      data: {
        id: result.insertId,
        latitude,
        longitude,
        congestion_level,
        average_speed,
        vehicle_count
      }
    });
  } catch (error) {
    console.error('Create traffic error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create traffic record: ' + error.message
    });
  }
};
