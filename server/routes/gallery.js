const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all gallery images
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM gallery ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload image (Admin)
router.post('/', upload.single('image'), async (req, res) => {
    const { event_name, gallery_date, created_by } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image_url) {
        return res.status(400).json({ error: 'Image file is required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO gallery (image_url, event_name, gallery_date, created_by) VALUES (?, ?, ?, ?)',
            [image_url, event_name, gallery_date || new Date(), created_by]
        );
        res.status(201).json({ id: result.insertId, image_url, message: 'Image uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete image (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ message: 'Image removed from gallery' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
