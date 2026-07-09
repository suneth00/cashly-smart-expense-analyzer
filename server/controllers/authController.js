const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    monthlyIncome: user.monthlyIncome,
    savingsGoal: user.savingsGoal,
    currency: user.currency,
    token: generateToken(user._id)
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      sendAuthResponse(res, 201, user);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please add email and password' });
    }

    // Check for user email and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (user && user.password && (await user.matchPassword(password))) {
      sendAuthResponse(res, 200, user);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate or register a user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLoginUser = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google OAuth is not configured' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ message: 'Invalid Google account' });
    }

    if (!payload.email_verified) {
      return res.status(401).json({ message: 'Google email is not verified' });
    }

    let user = await User.findOne({
      $or: [
        { googleId: payload.sub },
        { email: payload.email }
      ]
    }).select('+password');

    if (user) {
      let shouldSave = false;

      if (!user.googleId) {
        user.googleId = payload.sub;
        shouldSave = true;
      }

      if (!user.authProvider) {
        user.authProvider = user.password ? 'local' : 'google';
        shouldSave = true;
      }

      if (!user.name && payload.name) {
        user.name = payload.name;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        googleId: payload.sub,
        authProvider: 'google'
      });
    }

    sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(401).json({ message: 'Google login failed' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user is set in the auth middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        savingsGoal: user.savingsGoal,
        currency: user.currency,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.monthlyIncome !== undefined) {
        user.monthlyIncome = Number(req.body.monthlyIncome) || 0;
      }
      
      if (req.body.savingsGoal !== undefined) {
        user.savingsGoal = Number(req.body.savingsGoal) || 0;
      }
      
      if (req.body.currency !== undefined) {
        user.currency = req.body.currency;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        monthlyIncome: updatedUser.monthlyIncome,
        savingsGoal: updatedUser.savingsGoal,
        currency: updatedUser.currency,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLoginUser,
  getUserProfile,
  updateUserProfile
};
