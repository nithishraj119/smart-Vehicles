const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply authMiddleware and adminMiddleware to all admin endpoints
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/users
router.get('/users', adminController.getAdminUsers);

// GET /api/admin/statistics
router.get('/statistics', adminController.getAdminStatistics);

// GET /api/admin/reports
router.get('/reports', adminController.getAdminReports);

module.exports = router;
