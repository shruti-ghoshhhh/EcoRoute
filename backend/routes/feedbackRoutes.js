const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, resolveFeedback } = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/submit')
  .post(protect, submitFeedback);

router.route('/all')
  .get(protect, admin, getAllFeedback);

router.route('/:id/resolve')
  .put(protect, admin, resolveFeedback);

module.exports = router;
