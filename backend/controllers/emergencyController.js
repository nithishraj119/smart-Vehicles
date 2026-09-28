const db = require('../config/database');

// Submit an emergency report
exports.createEmergency = async (req, res) => {
  try {
    const { latitude, longitude, emergency_type, description } = req.body;

    if (!latitude || !longitude || !emergency_type) {
      return res.status(400).json({
        success: false,
        message: 'latitude, longitude, and emergency_type are required.'
      });
    }

    const userId = req.user ? req.user.id : null;

    const [result] = await db.query(
      `INSERT INTO emergency_reports (user_id, latitude, longitude, emergency_type, description, status) 
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [
        userId,
        parseFloat(latitude),
        parseFloat(longitude),
        emergency_type,
        description || 'Urgent roadside assistance requested.'
      ]
    );

    return res.status(201).json({
      success: true,
      message: '🚨 Emergency alert broadcasted successfully. Emergency responders notified.',
      data: {
        id: result.insertId,
        latitude,
        longitude,
        emergency_type,
        description,
        status: 'Pending',
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Create emergency error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to report emergency: ' + error.message
    });
  }
};

// Get all emergency reports
exports.getAllEmergencies = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, u.name as user_name, u.phone as user_phone, u.email as user_email
      FROM emergency_reports e
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: 'Emergency reports retrieved successfully',
      data: {
        emergencies: rows || []
      }
    });
  } catch (error) {
    console.error('Get emergency error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve emergency reports: ' + error.message
    });
  }
};

// Update emergency status (e.g., Pending -> Dispatched -> Resolved)
exports.updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }

    await db.query(
      'UPDATE emergency_reports SET status = ? WHERE id = ?',
      [status, id]
    );

    return res.status(200).json({
      success: true,
      message: `Emergency status updated to ${status}`
    });
  } catch (error) {
    console.error('Update emergency error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update emergency status: ' + error.message
    });
  }
};
