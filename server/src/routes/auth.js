const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../config/users');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const secret = process.env.JWT_SECRET || 'dev_secret';
  const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, secret, { expiresIn: '7d' });

  res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});

module.exports = router;
