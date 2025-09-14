const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function debugUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anomalyguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
    
    // Find the specific user by ID
    const userId = '68c3a10882f2ed9719d5d68a';
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User from database:', {
      id: user._id,
      email: user.email,
      name: user.name,
      hasEmail: !!user.email,
      hasName: !!user.name,
      allFields: Object.keys(user.toObject())
    });
    
    // Check if email field exists in schema
    console.log('User schema paths:', Object.keys(User.schema.paths));
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error debugging user:', error);
  }
}

debugUser();