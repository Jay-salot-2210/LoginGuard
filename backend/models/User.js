// backend/models/User.js
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
  time: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  company: { type: String },
  trustedDevices: { type: [deviceSchema], default: [] },
  loginHistory: { type: [loginHistorySchema], default: [] },

  // OTP fields for challenge
  otpHash: { type: String, select: false },
  otpExpires: Date,

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
};

module.exports = mongoose.model('User', userSchema);
