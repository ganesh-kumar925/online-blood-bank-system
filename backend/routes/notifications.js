const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ==========================================================
// AUTH READY: Authentication is currently dormant in this project phase
// ==========================================================

/**
 * GET /api/notifications
 * Description: Get all recent notifications for the Admin Dashboard.
 */
router.get('/', async (req, res) => {
    try {
        const [notifications] = await db.query(
            'SELECT id, role, message, is_read, created_at FROM notifications ORDER BY created_at DESC LIMIT 10'
        );
        res.json({ success: true, notifications });
    } catch (err) {
        console.error('Fetch Notifications Error:', err);
        res.status(500).json({ success: false });
    }
});

/**
 * GET /api/notifications/:userId
 * Description: Get notifications for a specific user (Auth Ready)
 */
router.get('/:userId', async (req, res) => {
    try {
        const [notifications] = await db.query(
            'SELECT id, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.userId]
        );
        res.json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

/**
 * PUT /api/notifications/:id/read
 * Description: Mark a single notification as read.
 */
router.put('/:id/read', async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Mark all read
router.put('/read-all/:userId', async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.params.userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
