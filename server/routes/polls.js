const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all polls with options and vote counts
router.get('/', async (req, res) => {
    try {
        const [polls] = await db.execute('SELECT p.*, u.fullname as creator_name FROM polls p JOIN users u ON p.created_by = u.id ORDER BY p.created_at DESC');

        for (let poll of polls) {
            const [options] = await db.execute('SELECT * FROM poll_options WHERE poll_id = ?', [poll.id]);
            const [votes] = await db.execute('SELECT option_id, COUNT(*) as count FROM votes WHERE poll_id = ? GROUP BY option_id', [poll.id]);

            poll.options = options.map(opt => {
                const vote = votes.find(v => v.option_id === opt.id);
                return { ...opt, votes: vote ? vote.count : 0 };
            });

            poll.total_votes = votes.reduce((sum, v) => sum + v.count, 0);
        }

        res.json(polls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new poll (Admin)
router.post('/', async (req, res) => {
    const { question, options, deadline, created_by } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [pollResult] = await connection.execute(
            'INSERT INTO polls (question, deadline, created_by) VALUES (?, ?, ?)',
            [question, deadline, created_by]
        );
        const pollId = pollResult.insertId;

        for (let optionText of options) {
            await connection.execute(
                'INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)',
                [pollId, optionText]
            );
        }

        await connection.commit();
        res.status(201).json({ id: pollId, message: 'Poll created successfully' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// Submit a vote
router.post('/:id/vote', async (req, res) => {
    const { option_id, user_id } = req.body;
    const poll_id = req.params.id;

    try {
        await db.execute(
            'INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)',
            [poll_id, option_id, user_id]
        );
        res.json({ message: 'Vote recorded' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'You have already voted on this poll' });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
