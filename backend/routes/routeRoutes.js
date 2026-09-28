const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

// POST /api/routes/analyze
router.post('/analyze', optionalAuthMiddleware, routeController.analyzeRoute);

// GET /api/routes/history
router.get('/history', optionalAuthMiddleware, routeController.getRouteHistory);

// GET /api/routes/:id
router.get('/:id', routeController.getRouteById);

module.exports = router;
