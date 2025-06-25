const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  const { fname, lname, email, phone, address, pincode, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ fname, lname, email, phone, address, pincode, password: hash });
  await newUser.save();

  res.status(201).json({ message: 'Signup successful' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;  // ✅ THIS IS IMPORTANT
