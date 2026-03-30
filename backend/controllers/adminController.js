const User = require('../models/User');
const Pickup = require('../models/Pickup');
const RouteLog = require('../models/RouteLog');

// @desc    Get Key Platform Metrics
// @route   GET /api/admin/metrics
exports.getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activePickups = await Pickup.countDocuments({ status: { $ne: 'Completed' } });
    
    // Aggregation pipeline to sum emissionsSaved globally
    const emissionsData = await RouteLog.aggregate([
      { $group: { _id: null, totalCO2: { $sum: "$emissionsSaved" }, totalSearches: { $sum: 1 } } }
    ]);
    
    // Calculate Active Users Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await User.countDocuments({ updatedAt: { $gte: today } });

    res.json({
      totalUsers,
      activePickups,
      totalCO2Saved: emissionsData[0] ? emissionsData[0].totalCO2.toFixed(2) : 0,
      totalRoutesSearched: emissionsData[0] ? emissionsData[0].totalSearches : 0,
      activeUsersToday: activeToday
    });
  } catch (error) {
    console.error("Failed calculating dashboard metrics:", error);
    res.status(500).json({ message: 'Server error retrieving administration KPIs' });
  }
};

// @desc    Get Heatmap Coordinates
// @route   GET /api/admin/heatmap
exports.getAdminHeatmap = async (req, res) => {
  try {
    const pickups = await Pickup.find({}, 'position');
    const heatmapPoints = pickups.map(p => [p.position.lat, p.position.lng, 1]); // Simple intensity of 1 per point
    res.json(heatmapPoints);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch heatmap data" });
  }
};
