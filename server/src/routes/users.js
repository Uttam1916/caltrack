const express = require('express');
const User = require('../models/user');

const router = express.Router();

// POST /api/users/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }

    // check existing
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: 'Email already in use' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(409).json({ error: 'Username already in use' });

  // NOTE: storing password as plain text per user preference (no encryption)
  const user = new User({ username, email, password });
    await user.save();

    // Return user without password
    const safeUser = { id: user._id, username: user.username, email: user.email };
    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Plain-text comparison (no hashing)
  if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const safeUser = { id: user._id, username: user.username, email: user.email };
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
