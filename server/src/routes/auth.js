const express = require('express');
const router = express.Router();
const users = require('../config/users');

// POST /api/auth/login
// Extremely simple login — NO JWT. Returns the user object if credentials match.
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Return only the user object (no token)
  res.json({ user: { id: user.id, username: user.username, name: user.name } });
});

module.exports = router;
