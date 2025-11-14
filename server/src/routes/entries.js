const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');

// Create a new entry
// Accepts optional `userId` in the body so the client can associate entries with a user.
router.post('/', async (req, res) => {
    try {
        const { name, calories, protein, carbs, fats, date, userId } = req.body;
        const entry = await Entry.create({ name, calories, protein, carbs, fats, date, userId });
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

// Get today's entries for a user
// Provide userId as a query parameter: /api/entries/today?userId=123
router.get('/today', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ error: 'userId query parameter required' });
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const entries = await Entry.find({ userId: String(userId), date: { $gte: start, $lte: end } }).sort({ date: -1 });
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
// Update
router.put('/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        Object.assign(entry, req.body);
        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        await entry.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;