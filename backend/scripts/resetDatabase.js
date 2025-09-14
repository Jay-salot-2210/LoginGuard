// backend/scripts/resetDatabase.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anomalyguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
    
    // Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all existing users');
    
    // Create new test users with proper data
    const testUsers = [
      {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Test User',
        company: 'Test Company',
        trustedDevices: [],
        loginHistory: []
      },
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 12),
        name: 'Admin User',
        company: 'Admin Company',
        trustedDevices: [],
        loginHistory: []
      }
    ];
    
    const createdUsers = await User.insertMany(testUsers);
    console.log('Created new test users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name})`);
    });
    
    await mongoose.connection.close();
    console.log('Database reset complete');
    
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

resetDatabase();