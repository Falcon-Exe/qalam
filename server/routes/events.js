const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

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
router.post('/', verifyToken, isAdmin, async (req, res) => {
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

// Update an event (Admin Only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { title, description, event_date, venue, poster_url } = req.body;
    try {
        await db.execute(
            'UPDATE events SET title = ?, description = ?, event_date = ?, venue = ?, poster_url = ? WHERE id = ?',
            [title, description, event_date, venue, poster_url, req.params.id]
        );
        res.json({ message: 'Event updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an event (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
