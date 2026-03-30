const express = require('express');
const router = express.Router();
const { getMetrics, getAdminHeatmap } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/metrics')
  .get(protect, admin, getMetrics);

router.route('/heatmap')
  .get(getAdminHeatmap);

module.exports = router;
