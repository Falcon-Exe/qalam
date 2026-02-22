const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
    try {
        const [students] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
        const [announcements] = await db.execute("SELECT COUNT(*) as count FROM announcements");
        const [events] = await db.execute("SELECT COUNT(*) as count FROM events");
        const [funds] = await db.execute("SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance FROM funds");

        res.json({
            studentCount: students[0].count,
            announcementCount: announcements[0].count,
            eventCount: events[0].count,
            totalFunds: funds[0].balance || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
