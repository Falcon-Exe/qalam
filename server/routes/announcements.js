const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, u.fullname as creator_name 
            FROM announcements a 
            LEFT JOIN users u ON a.created_by = u.id 
            ORDER BY a.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create an announcement (Admin Only)
router.post('/', async (req, res) => {
    const { title, content, priority_tag, created_by } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO announcements (title, content, priority_tag, created_by) VALUES (?, ?, ?, ?)',
            [title, content, priority_tag || 'medium', created_by]
        );
        res.status(201).json({ id: result.insertId, title, content, priority_tag });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
