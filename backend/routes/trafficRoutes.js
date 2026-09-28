const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// GET /api/traffic
router.get('/', trafficController.getAllTraffic);

// GET /api/traffic/nearby
router.get('/nearby', trafficController.getNearbyTraffic);

// POST /api/traffic
router.post('/', trafficController.createTrafficRecord);

module.exports = router;
