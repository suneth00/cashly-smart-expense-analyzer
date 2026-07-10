const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware checks if the request has a valid JWT token.
// If valid, the logged-in user is attached to req.user.
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Gets the token from "Authorization: Bearer <token>".
      token = req.headers.authorization.split(' ')[1];

      // Verifies the token using the same JWT_SECRET used during login.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Loads the logged-in user without returning the password.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Allows the protected controller to run.
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
