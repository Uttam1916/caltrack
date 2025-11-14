// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const entriesRouter = require('./routes/entries');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// connect to database
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// routes
app.use('/api/entries', entriesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

// basic health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
