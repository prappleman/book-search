const mongoose = require('mongoose');

// Define the connection URI
const uri = process.env.MONGODB;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
