const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all events
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM events ORDER BY event_date ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create an event (Admin Only)
router.post('/', async (req, res) => {
    const { title, description, event_date, venue, poster_url, created_by } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO events (title, description, event_date, venue, poster_url, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, event_date, venue, poster_url, created_by]
        );
        res.status(201).json({ id: result.insertId, title, event_date, venue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
