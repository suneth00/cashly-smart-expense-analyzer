const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Stores account details, profile settings, and login provider information.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    // Google users do not need a local password.
    required: function() {
      return this.authProvider !== 'google';
    },
    minlength: 6,
    select: false // Ensure password is not returned by default
  },
  googleId: {
    type: String,
    unique: true,
    // Sparse allows normal email/password users to have no googleId.
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  savingsGoal: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: '$'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hashes local account passwords before saving them to MongoDB.
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compares the login password with the hashed password in the database.
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) {
    return false;
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
