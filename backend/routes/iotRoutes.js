const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// POST /api/iot/sensor-data
router.post('/sensor-data', iotController.recordSensorData);

// GET /api/iot/sensor-data
router.get('/sensor-data', iotController.getSensorData);

module.exports = router;
