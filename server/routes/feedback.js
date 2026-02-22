const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all feedback (Admin)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT f.*, u.fullname as user_name 
            FROM feedback f 
            LEFT JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit feedback
router.post('/', async (req, res) => {
    const { type, content, is_anonymous, user_id } = req.body;
    try {
        await db.execute(
            'INSERT INTO feedback (type, content, is_anonymous, user_id) VALUES (?, ?, ?, ?)',
            [type || 'feedback', content, is_anonymous, is_anonymous ? null : user_id]
        );
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Resolve feedback (Admin)
router.patch('/:id/resolve', async (req, res) => {
    try {
        await db.execute(
            'UPDATE feedback SET status = "resolved" WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: 'Feedback marked as resolved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete feedback (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM feedback WHERE id = ?', [req.params.id]);
        res.json({ message: 'Feedback deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
