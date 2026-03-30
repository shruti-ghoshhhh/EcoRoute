const RouteLog = require('../models/RouteLog');

// @desc    Calculate & Log new User Route
// @route   POST /api/routes
exports.logRoute = async (req, res) => {
  try {
    const { origin, destination, distanceKm, transportMode } = req.body;
    
    // Abstract calculation formula: Cars emit approx 0.192kg CO2 per Km. Transit emits 0.089kg. Walking/Biking is 0.
    const averageCarEmissionsPerKm = 0.192;
    let actualEmissions = 0;
    
    if (transportMode === 'Transit') actualEmissions = distanceKm * 0.089;
    else if (transportMode === 'Carpool') actualEmissions = distanceKm * (0.192/2);
    else if (transportMode === 'Walking' || transportMode === 'Biking') actualEmissions = 0;
    else actualEmissions = distanceKm * averageCarEmissionsPerKm; // Default fallback

    const emissionsSaved = Math.max(0, (distanceKm * averageCarEmissionsPerKm) - actualEmissions);

    const route = await RouteLog.create({
      user: req.user.id,
      origin,
      destination,
      distanceKm,
      transportMode,
      emissionsSaved
    });
    
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error archiving routing data.' });
  }
};

// @desc    Get ALL searched routes globally for Admin Panel
// @route   GET /api/routes/all
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await RouteLog.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving global router database.' });
  }
};
