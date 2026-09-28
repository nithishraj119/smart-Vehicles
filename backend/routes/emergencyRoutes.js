const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { optionalAuthMiddleware, authMiddleware } = require('../middleware/authMiddleware');

// POST /api/emergency
router.post('/', optionalAuthMiddleware, emergencyController.createEmergency);

// GET /api/emergency
router.get('/', emergencyController.getAllEmergencies);

// PUT /api/emergency/:id
router.put('/:id', emergencyController.updateEmergencyStatus);

module.exports = router;
