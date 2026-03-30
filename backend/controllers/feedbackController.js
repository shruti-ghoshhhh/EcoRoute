const Feedback = require('../models/Feedback');

// @desc    User Submits General Feedback
// @route   POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user: req.user.id,
      message: req.body.message
    });
    res.status(201).json({ message: "Thanks! The administration team has received your communication." });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload feedback string into Database." });
  }
};

// @desc    Admin Retrieves All Globale Feedback Operations
// @route   GET /api/feedback/all
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch Global Feedback ledgers." });
  }
};

// @desc    Resolve/Mark Handling of a Single Form by ID
// @route   PUT /api/feedback/:id/resolve
exports.resolveFeedback = async (req, res) => {
  try {
    const issue = await Feedback.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Report ID missing." });

    issue.status = issue.status === 'Resolved' ? 'Pending' : 'Resolved';
    const saved = await issue.save();
    
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: "Resolution mechanics completely failed." });
  }
};
