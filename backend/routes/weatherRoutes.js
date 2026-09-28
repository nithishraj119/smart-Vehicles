const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather
router.get('/', weatherController.getWeatherData);

// POST /api/weather
router.post('/', weatherController.updateWeatherData);

module.exports = router;
