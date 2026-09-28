const db = require('../config/database');

// Receive sensor payload from IoT hardware nodes
exports.recordSensorData = async (req, res) => {
  try {
    const {
      device_id,
      latitude,
      longitude,
      speed,
      vehicle_count,
      temperature,
      rainfall,
      hazard_detected
    } = req.body;

    if (!device_id || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'device_id, latitude, and longitude are required.'
      });
    }

    // 1. Record raw sensor reading in iot_sensor_data table
    const [result] = await db.query(
      `INSERT INTO iot_sensor_data 
        (device_id, latitude, longitude, speed, vehicle_count, temperature, rainfall, hazard_detected)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        device_id,
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(speed) || 0,
        parseInt(vehicle_count, 10) || 0,
        parseFloat(temperature) || 28.0,
        parseFloat(rainfall) || 0.0,
        Boolean(hazard_detected)
      ]
    );

    // 2. Automatically feed into live traffic_data
    let congestion = 'Low';
    const vCount = parseInt(vehicle_count, 10) || 0;
    const avgSpd = parseFloat(speed) || 45;
    if (vCount > 180 || avgSpd < 15) congestion = 'Critical';
    else if (vCount > 120 || avgSpd < 25) congestion = 'Heavy';
    else if (vCount > 60 || avgSpd < 40) congestion = 'Moderate';

    await db.query(
      `INSERT INTO traffic_data (latitude, longitude, congestion_level, average_speed, vehicle_count)
       VALUES (?, ?, ?, ?, ?)`,
      [parseFloat(latitude), parseFloat(longitude), congestion, avgSpd, vCount]
    );

    // 3. If hazard detected by IoT accelerometer/camera sensor, automatically log into hazards table
    if (hazard_detected) {
      await db.query(
        `INSERT INTO hazards (latitude, longitude, hazard_type, severity, description, reported_by)
         VALUES (?, ?, 'Accident', 'High', 'Automated anomaly detected by IoT roadside sensor node', ?)`,
        [parseFloat(latitude), parseFloat(longitude), `Device: ${device_id}`]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'IoT sensor telemetry received, ingested, and processed into real-time safety network.',
      data: {
        record_id: result.insertId,
        device_id,
        latitude,
        longitude,
        speed,
        vehicle_count,
        congestion_computed: congestion,
        hazard_flag: Boolean(hazard_detected),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('IoT sensor data error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record IoT sensor data: ' + error.message
    });
  }
};

// Retrieve recent IoT device telemetry feeds
exports.getSensorData = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM iot_sensor_data ORDER BY recorded_at DESC LIMIT 30'
    );

    return res.status(200).json({
      success: true,
      data: {
        telemetry: rows || []
      }
    });
  } catch (error) {
    console.error('Get sensor data error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve sensor data: ' + error.message
    });
  }
};
