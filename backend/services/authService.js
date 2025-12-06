const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

class AuthService {
  async register(userData) {
    const { username, firstName, lastName, password, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error('Username already exists');
    }

    // Create user
    const user = await User.create({
      username,
      firstName,
      lastName,
      password,
      role: role || 'Cashier'
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: generateToken(user._id)
    };
  }

  async login(username, password) {
    // Check for user
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    return {
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: generateToken(user._id)
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();