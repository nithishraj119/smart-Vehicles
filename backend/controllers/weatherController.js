const db = require('../config/database');

// Get current weather records
exports.getWeatherData = async (req, res) => {
  try {
    const { location } = req.query;

    let query = 'SELECT * FROM weather_data ORDER BY recorded_at DESC';
    let params = [];

    if (location) {
      query = 'SELECT * FROM weather_data WHERE location LIKE ? ORDER BY recorded_at DESC';
      params = [`%${location}%`];
    }

    const [rows] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      message: 'Weather data retrieved successfully',
      data: {
        weather: rows || []
      }
    });
  } catch (error) {
    console.error('Weather data error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve weather data: ' + error.message
    });
  }
};

// Add or update weather record
exports.updateWeatherData = async (req, res) => {
  try {
    const { location, temperature, humidity, rainfall, visibility, wind_speed } = req.body;

    if (!location || temperature === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Location and temperature are required.'
      });
    }

    const [result] = await db.query(
      `INSERT INTO weather_data (location, temperature, humidity, rainfall, visibility, wind_speed) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        location,
        parseFloat(temperature) || 28.0,
        parseFloat(humidity) || 60.0,
        parseFloat(rainfall) || 0.0,
        parseFloat(visibility) || 10.0,
        parseFloat(wind_speed) || 10.0
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Weather data logged successfully',
      data: {
        id: result.insertId,
        location,
        temperature,
        humidity,
        rainfall,
        visibility,
        wind_speed
      }
    });
  } catch (error) {
    console.error('Update weather error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to log weather data: ' + error.message
    });
  }
};
