const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Debugging: Check if JWT_SECRET is loaded properly
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Make sure it's not undefined

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;
