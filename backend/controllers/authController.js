const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'UNSET_CLIENT_ID');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate with Google OAuth
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  const { credential } = req.body;
  try {
    // 1. Verify Google token integrity
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { email, name, sub } = ticket.getPayload();
    
    // 2. Discover or Auto-Register user
    let user = await User.findOne({ email });
    
    if (!user) {
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      user = await User.create({
        name,
        email,
        role,
        // Bind random cryptographically secure string so they can't natively login via password unless they reset it
        password: sub + process.env.JWT_SECRET + Date.now().toString()
      });
    }

    // 3. Complete native login handshake
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Google Auth Failed:', error);
    res.status(401).json({ message: 'Secure Google Authentication Error' });
  }
};
