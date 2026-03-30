const express = require('express');
const router = express.Router();
const { createPickup, getUserPickups, getAllPickups, updatePickupStatus } = require('../controllers/pickupController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPickup)
  .get(protect, getUserPickups);

router.route('/all')
  .get(protect, admin, getAllPickups);

router.route('/:id/status')
  .put(protect, admin, updatePickupStatus);

module.exports = router;
