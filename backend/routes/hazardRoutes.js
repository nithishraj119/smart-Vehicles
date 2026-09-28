const express = require('express');
const router = express.Router();
const hazardController = require('../controllers/hazardController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

// GET /api/hazards
router.get('/', hazardController.getAllHazards);

// GET /api/hazards/nearby
router.get('/nearby', hazardController.getNearbyHazards);

// POST /api/hazards
router.post('/', optionalAuthMiddleware, hazardController.createHazard);

// PUT /api/hazards/:id
router.put('/:id', hazardController.updateHazard);

// DELETE /api/hazards/:id
router.delete('/:id', hazardController.deleteHazard);

module.exports = router;
