const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all transactions and summary
router.get('/', async (req, res) => {
    try {
        const [transactions] = await db.execute('SELECT * FROM funds ORDER BY transaction_date DESC');

        const [summary] = await db.execute(`
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as total_balance,
                SUM(CASE WHEN type = 'income' AND MONTH(transaction_date) = MONTH(CURRENT_DATE) THEN amount ELSE 0 END) as monthly_income,
                SUM(CASE WHEN type = 'expense' AND MONTH(transaction_date) = MONTH(CURRENT_DATE) THEN amount ELSE 0 END) as monthly_expense
            FROM funds
        `);

        res.json({
            transactions,
            summary: summary[0] || { total_balance: 0, monthly_income: 0, monthly_expense: 0 }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new transaction
router.post('/', async (req, res) => {
    const { type, amount, description, transaction_date, created_by } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO funds (type, amount, description, transaction_date, created_by) VALUES (?, ?, ?, ?, ?)',
            [type, amount, description, transaction_date || new Date(), created_by]
        );
        res.status(201).json({ id: result.insertId, message: 'Transaction recorded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
