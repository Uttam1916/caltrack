const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// GET /api/posts - public list of posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts - create a new post
// Accept authorId and authorName in the request body.
router.post('/', async (req, res) => {
  try {
    const { content, authorId, authorName } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const post = await Post.create({ authorId, authorName, content });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/posts/:id - delete a post (no auth enforced)
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
