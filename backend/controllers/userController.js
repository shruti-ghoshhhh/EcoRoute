const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // In Mongoose newer versions, deleteOne is preferred over remove
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User strategically removed from the platform.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to purge user record.' });
  }
};

// @desc    Update a user arbitrarily
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.points = req.body.points !== undefined ? req.body.points : user.points;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      points: updatedUser.points,
      password: updatedUser.password // Returns the hash explicitly
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update personnel records.' });
  }
};

// @desc    Create a new user manually
// @route   POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, points } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'An operative with this email is already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      points: points || 0
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to forge new identity.' });
  }
};

// @desc    Toggle Ban Status for a User
// @route   PUT /api/users/:id/ban
exports.toggleBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User completely missing.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'God-Mode operative cannot be banned.' });

    user.isBanned = !user.isBanned;
    await user.save();
    
    res.json({ message: user.isBanned ? 'Global privileges revoked.' : 'Access functionally restored.', isBanned: user.isBanned });
  } catch (error) {
    res.status(500).json({ message: 'Ban toggle failed on server layer.' });
  }
};
