require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connects the backend to MongoDB before handling API requests.
connectDB();

// Imports route files for each main feature area.
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const ocrRoutes = require('./routes/ocrRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Lists frontend URLs that are allowed to call this backend.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cashly-smart-expense-analyzer.vercel.app',
  'https://cashly-smart-expense-analyzer-nine.vercel.app',
  ...(process.env.CLIENT_URL || '').split(','),
  ...(process.env.FRONTEND_URL || '').split(','),
  ...(process.env.CORS_ORIGIN || '').split(','),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedVercelOrigin = (origin) => {
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

// Enables CORS so the Vercel frontend can access the Render backend.
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isAllowedVercelOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
}));

// Reads JSON and form data from incoming requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route used to confirm the backend is live.
app.get("/", (req, res) => {
  res.send("CASHLY Backend API is running");
});

// Simple API test route used during deployment checks.
app.get("/api/test", (req, res) => {
  res.json({ message: "CASHLY API is running" });
});

// Connects backend routes to their API paths.
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ocr', ocrRoutes);

// Global Error Handler Middleware
// Catches unexpected errors and sends a clean JSON response.
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Starts the Express server on Render's PORT or local port 5000.
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
