const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Delete ALL existing users first
    await User.deleteMany({});
    console.log('Deleted all existing users');

    // Create fresh admin
    const admin = await User.create({
      username: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'Admin',
      password: 'password123', // Will be hashed by pre-save hook
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: password123');
    console.log('User ID:', admin._id);

    // Test the password immediately
    const testMatch = await admin.matchPassword('password123');
    console.log('Password match test:', testMatch ? '✅ PASS' : '❌ FAIL');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();