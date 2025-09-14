const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function fixAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anomalyguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    // Check and fix each user
    for (const user of users) {
      console.log('Checking user:', user._id);
      
      let needsUpdate = false;
      const updateData = {};
      
      // Check if email is missing or invalid
      if (!user.email || typeof user.email !== 'string' || !user.email.includes('@')) {
        console.log('❌ User has invalid email:', user.email);
        // Create a placeholder email based on user ID
        updateData.email = `user_${user._id}@example.com`;
        needsUpdate = true;
      }
      
      // Check if name is missing
      if (!user.name || typeof user.name !== 'string') {
        console.log('❌ User has invalid name:', user.name);
        updateData.name = `User ${user._id}`;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log('Updating user:', user._id, 'with data:', updateData);
        await User.findByIdAndUpdate(user._id, updateData);
        console.log('✅ User updated successfully');
      } else {
        console.log('✅ User data is valid');
      }
    }
    
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('Error fixing users:', error);
  }
}

fixAllUsers();