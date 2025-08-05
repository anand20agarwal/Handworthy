
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const twilio = require('twilio');
require('dotenv').config();
// ✅ Use strings with quotes — corrected here
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const client = require('twilio')(accountSid, authToken);

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Store OTPs in memory temporarily
const otpStore = new Map();

// ✅ Send OTP
router.post('/send-otp', async (req, res) => {
  let { phone } = req.body;
  console.log('📞 Raw phone from client:', phone);

  if (!phone) return res.status(400).json({ message: 'Phone number required' });

  // Format phone to +91 format if not present
  if (!phone.startsWith('+')) {
    phone = '+91' + phone;
  }

  console.log('📲 Formatted phone for Twilio:', phone);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('📨 Generated OTP:', otp);

  try {
    const message = await client.messages.create({
      body: `Your Handworthy OTP is: ${otp}`,
      from: twilioPhone,
      to: phone,
    });

    console.log('✅ Twilio message SID:', message.sid);
    otpStore.set(phone, otp);
    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error('❌ Twilio Error:', err);
    res.status(500).json({
      message: 'Failed to send OTP',
      error: err.message,
      code: err.code,
      info: err.moreInfo
    });
  }
});



// ✅ Verify OTP
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = otpStore.get(phone);

  if (storedOtp === otp) {
    otpStore.delete(phone); // Remove after success
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

// ✅ Signup
router.post('/signup', async (req, res) => {
  const { fname, lname, email, phone, address, pincode, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({
    fname,
    lname,
    email: normalizedEmail,
    phone,
    address,
    pincode,
    password: hash,
  });

  await newUser.save();
  res.status(201).json({ message: 'Signup successful' });
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '1h' });
  res.json({ token });
});

// ✅ Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    // Simulated reset logic
    res.json({ message: 'Reset link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
