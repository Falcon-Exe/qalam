const express = require('express');
const router = express.Router();
const db = require('../db');

// Get attendance for all students for a specific date
router.get('/', async (req, res) => {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.fullname, u.username as roll, a.status, a.id as attendance_id
            FROM users u
            LEFT JOIN attendance a ON u.id = a.user_id AND a.attendance_date = ?
            WHERE u.role = 'student'
            ORDER BY u.username ASC
        `, [targetDate]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get personal attendance summary for current user
router.get('/my', async (req, res) => {
    const { user_id } = req.query;
    try {
        const [stats] = await db.execute(`
            SELECT 
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days
            FROM attendance
            WHERE user_id = ?
        `, [user_id]);

        const [history] = await db.execute(`
            SELECT attendance_date, status
            FROM attendance
            WHERE user_id = ?
            ORDER BY attendance_date DESC
            LIMIT 30
        `, [user_id]);

        res.json({ stats: stats[0], history });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark/Update attendance (Admin)
router.post('/mark', async (req, res) => {
    const { user_id, attendance_date, status, marked_by } = req.body;
    try {
        // Check if already marked
        const [existing] = await db.execute(
            'SELECT id FROM attendance WHERE user_id = ? AND attendance_date = ?',
            [user_id, attendance_date]
        );

        if (existing.length > 0) {
            await db.execute(
                'UPDATE attendance SET status = ?, marked_by = ? WHERE id = ?',
                [status, marked_by, existing[0].id]
            );
        } else {
            await db.execute(
                'INSERT INTO attendance (user_id, attendance_date, status, marked_by) VALUES (?, ?, ?, ?)',
                [user_id, attendance_date, status, marked_by]
            );
        }
        res.json({ message: 'Attendance updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
