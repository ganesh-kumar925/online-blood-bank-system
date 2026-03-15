const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticate } = require('../middleware/authMiddleware');

// Get all notifications for user
router.get('/:userId', authenticate, async (req, res) => {
    try {
        if (req.user.userId.toString() !== req.params.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const [notifications] = await db.query(
            'SELECT id, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.userId]
        );
        res.json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Mark single notification read
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        const [notif] = await db.query('SELECT user_id FROM notifications WHERE id = ?', [req.params.id]);
        if (!notif.length || notif[0].user_id !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Mark all read
router.put('/read-all/:userId', authenticate, async (req, res) => {
    try {
        if (req.user.userId.toString() !== req.params.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.params.userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
