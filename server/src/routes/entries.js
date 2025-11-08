const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');

const auth = require('../middleware/auth');

// Create a new entry (auth required)
router.post('/', auth, async (req, res) => {
    try {
        const { name, calories, protein, carbs, fats, date } = req.body;
        const entry = await Entry.create({ name, calories, protein, carbs, fats, date, userId: req.user.id });
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all entries (admin/public use): optionally filter by userId query param
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.userId) filter.userId = req.query.userId;
        const entries = await Entry.find(filter).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get today's entries for authenticated user
router.get('/today', auth, async (req, res) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const entries = await Entry.find({ userId: req.user.id, date: { $gte: start, $lte: end } }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single entry
router.get('/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
// Update (only owner)
router.put('/:id', auth, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        if (entry.userId && entry.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
        Object.assign(entry, req.body);
        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete (only owner)
router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        if (entry.userId && entry.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
        await entry.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;