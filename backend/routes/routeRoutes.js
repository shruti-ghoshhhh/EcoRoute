const express = require('express');
const router = express.Router();
const { logRoute, getAllRoutes } = require('../controllers/routeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, logRoute); // Users searching routes

router.route('/all')
  .get(protect, admin, getAllRoutes); // Admins retrieving all history

module.exports = router;
