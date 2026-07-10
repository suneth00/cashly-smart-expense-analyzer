const mongoose = require('mongoose');

// Stores one expense and links it to the user who created it.
const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // This reference connects each expense to a User document.
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    // Keeps categories consistent for charts and analytics.
    enum: ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
