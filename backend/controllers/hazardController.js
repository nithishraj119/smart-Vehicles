const db = require('../config/database');
const { calculateDistanceKm } = require('../utils/riskCalculator');

// Get all hazards
exports.getAllHazards = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hazards ORDER BY created_at DESC');
    return res.status(200).json({
      success: true,
      message: 'Hazards retrieved successfully',
      data: {
        hazards: rows || []
      }
    });
  } catch (error) {
    console.error('Get hazards error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve hazards: ' + error.message
    });
  }
};

// Get nearby hazards
exports.getNearbyHazards = async (req, res) => {
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

    const [rows] = await db.query('SELECT * FROM hazards ORDER BY created_at DESC');

    const nearby = (rows || []).filter(item => {
      const dist = calculateDistanceKm(latitude, longitude, parseFloat(item.latitude), parseFloat(item.longitude));
      return dist <= radKm;
    });

    return res.status(200).json({
      success: true,
      data: {
        hazards: nearby
      }
    });
  } catch (error) {
    console.error('Nearby hazards error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve nearby hazards: ' + error.message
    });
  }
};

// Create a new hazard
exports.createHazard = async (req, res) => {
  try {
    const { latitude, longitude, hazard_type, severity, description } = req.body;

    if (!latitude || !longitude || !hazard_type || !severity) {
      return res.status(400).json({
        success: false,
        message: 'latitude, longitude, hazard_type, and severity are required.'
      });
    }

    const reporter = req.user ? req.user.name : (req.body.reported_by || 'Commuter Report');

    const [result] = await db.query(
      `INSERT INTO hazards (latitude, longitude, hazard_type, severity, description, reported_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parseFloat(latitude),
        parseFloat(longitude),
        hazard_type,
        severity,
        description || '',
        reporter
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Hazard reported successfully',
      data: {
        id: result.insertId,
        latitude,
        longitude,
        hazard_type,
        severity,
        description,
        reported_by: reporter
      }
    });
  } catch (error) {
    console.error('Create hazard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create hazard: ' + error.message
    });
  }
};

// Update hazard (severity / description)
exports.updateHazard = async (req, res) => {
  try {
    const { id } = req.params;
    const { severity, description } = req.body;

    if (!severity && description === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update. Provide severity or description.'
      });
    }

    if (severity && description !== undefined) {
      await db.query(
        'UPDATE hazards SET severity = ?, description = ? WHERE id = ?',
        [severity, description, id]
      );
    } else if (severity) {
      await db.query('UPDATE hazards SET severity = ? WHERE id = ?', [severity, id]);
    } else {
      await db.query('UPDATE hazards SET description = ? WHERE id = ?', [description, id]);
    }

    return res.status(200).json({
      success: true,
      message: 'Hazard updated successfully'
    });
  } catch (error) {
    console.error('Update hazard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update hazard: ' + error.message
    });
  }
};

// Delete hazard
exports.deleteHazard = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM hazards WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Hazard record removed successfully'
    });
  } catch (error) {
    console.error('Delete hazard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete hazard: ' + error.message
    });
  }
};
