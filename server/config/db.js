const mongoose = require('mongoose');

// Opens the MongoDB connection using the MONGO_URI from environment variables.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Stop the server if the database cannot connect.
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
