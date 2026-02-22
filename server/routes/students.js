const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, username, fullname, role, class_role FROM users WHERE role = 'student'");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get student details by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, username, fullname, role, class_role FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
