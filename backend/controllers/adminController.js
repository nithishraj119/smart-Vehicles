const db = require('../config/database');

// Get all registered users (excluding password)
exports.getAdminUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      data: {
        users: rows || []
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users: ' + error.message
    });
  }
};

// Get aggregated platform statistics & chart metrics
exports.getAdminStatistics = async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [routes] = await db.query('SELECT COUNT(*) as count, AVG(risk_score) as avg_risk FROM routes');
    const [hazards] = await db.query('SELECT COUNT(*) as count FROM hazards');
    const [emergencies] = await db.query('SELECT COUNT(*) as count FROM emergency_reports');
    const [pendingEmergencies] = await db.query("SELECT COUNT(*) as count FROM emergency_reports WHERE status = 'Pending'");
    const [trafficPoints] = await db.query('SELECT COUNT(*) as count FROM traffic_data');

    const totalUsers = users && users[0] ? (users[0].count || users.length) : 0;
    const totalRoutes = routes && routes[0] ? (routes[0].count || routes.length) : 0;
    const avgRisk = routes && routes[0] && routes[0].avg_risk ? Math.round(routes[0].avg_risk) : 48;
    const totalHazards = hazards && hazards[0] ? (hazards[0].count || hazards.length) : 0;
    const totalEmergencies = emergencies && emergencies[0] ? (emergencies[0].count || emergencies.length) : 0;
    const pendingCount = pendingEmergencies && pendingEmergencies[0] ? (pendingEmergencies[0].count || 0) : 0;
    const trafficCount = trafficPoints && trafficPoints[0] ? (trafficPoints[0].count || trafficPoints.length) : 0;

    // Detailed risk level breakdown
    const [allRoutes] = await db.query('SELECT risk_level, risk_score FROM routes');
    const riskLevels = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
    (allRoutes || []).forEach(r => {
      const lvl = (r.risk_level || 'LOW').toUpperCase();
      if (riskLevels[lvl] !== undefined) riskLevels[lvl]++;
      else riskLevels.LOW++;
    });

    // Hazards by type breakdown
    const [allHazards] = await db.query('SELECT hazard_type FROM hazards');
    const hazardBreakdown = {};
    (allHazards || []).forEach(h => {
      const type = h.hazard_type || 'Other';
      hazardBreakdown[type] = (hazardBreakdown[type] || 0) + 1;
    });

    // Simulated Daily route trend for chart
    const dailyRoutes = [
      { day: 'Mon', count: Math.max(12, Math.round(totalRoutes * 0.15)) },
      { day: 'Tue', count: Math.max(18, Math.round(totalRoutes * 0.22)) },
      { day: 'Wed', count: Math.max(22, Math.round(totalRoutes * 0.28)) },
      { day: 'Thu', count: Math.max(16, Math.round(totalRoutes * 0.20)) },
      { day: 'Fri', count: Math.max(28, Math.round(totalRoutes * 0.35)) },
      { day: 'Sat', count: Math.max(34, Math.round(totalRoutes * 0.42)) },
      { day: 'Sun', count: Math.max(20, Math.round(totalRoutes * 0.25)) }
    ];

    return res.status(200).json({
      success: true,
      data: {
        total_users: Number(totalUsers),
        total_routes: Number(totalRoutes),
        active_hazards: Number(totalHazards),
        emergency_reports: Number(totalEmergencies),
        pending_emergencies: Number(pendingCount),
        average_risk_score: Number(avgRisk),
        traffic_monitoring_points: Number(trafficCount),
        risk_level_distribution: [
          { name: 'Low Risk', value: riskLevels.LOW, color: '#10b981' },
          { name: 'Moderate Risk', value: riskLevels.MODERATE, color: '#06b6d4' },
          { name: 'High Risk', value: riskLevels.HIGH, color: '#f59e0b' },
          { name: 'Critical Risk', value: riskLevels.CRITICAL, color: '#ef4444' }
        ],
        daily_routes: dailyRoutes,
        hazard_types: Object.entries(hazardBreakdown).map(([name, count]) => ({ name, count }))
      }
    });
  } catch (error) {
    console.error('Admin statistics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute admin statistics: ' + error.message
    });
  }
};

// Get combined reports (Hazards + Emergencies)
exports.getAdminReports = async (req, res) => {
  try {
    const [hazards] = await db.query('SELECT * FROM hazards ORDER BY created_at DESC LIMIT 50');
    const [emergencies] = await db.query(`
      SELECT e.*, u.name as user_name, u.phone as user_phone, u.email as user_email
      FROM emergency_reports e
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.created_at DESC
      LIMIT 50
    `);

    return res.status(200).json({
      success: true,
      data: {
        hazards: hazards || [],
        emergencies: emergencies || []
      }
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin reports: ' + error.message
    });
  }
};
