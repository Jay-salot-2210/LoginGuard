const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deviceSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true },
  label: { type: String },
  lastSeen: { type: Date, default: Date.now }
}, { _id: false });

const loginHistorySchema = new mongoose.Schema({
  ip: String,
  country: String,
  city: String,
  device: String,
  time: { type: Date, default: Date.now },
  riskScore: { type: Number, default: 0 },
  status: { type: String, default: 'success' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  company: { type: String },
  trustedDevices: { type: [deviceSchema], default: [] },
  loginHistory: { type: [loginHistorySchema], default: [] },

  // OTP fields for challenge
  otpHash: { type: String, select: false },
  otpExpires: Date,
  
  // Add this field to track anomaly status
  hasPendingAnomaly: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

// password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// convenience method to clear OTP
userSchema.methods.clearOtp = function () {
  this.otpHash = undefined;
  this.otpExpires = undefined;
  this.hasPendingAnomaly = false;
};

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;