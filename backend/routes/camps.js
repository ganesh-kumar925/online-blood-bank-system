const express = require('express');
const router = express.Router();
const db = require('../models/db');

// AUTH READY: uncomment the lines below to enable authentication
// const { verifyToken } = require('../middleware/authMiddleware');

/**
 * GET ALL CAMPS
 * Access: Public
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM donation_camps ORDER BY start_date DESC');
        res.json({ success: true, camps: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error });
    }
});

/**
 * GET UPCOMING/ACTIVE CAMPS
 * Access: Public
 */
router.get('/active', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM donation_camps WHERE status != 'Completed' ORDER BY start_date ASC");
        res.json({ success: true, camps: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error });
    }
});

/**
 * CREATE A CAMP
 * Access: Admin (Currently Public)
 * AUTH READY: add verifyToken, authorize('admin') middleware
 */
router.post('/', async (req, res) => {
    const { camp_name, location, city, organizer, start_date, end_date, contact_phone } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO donation_camps (camp_name, location, city, organizer, start_date, end_date, contact_phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [camp_name, location, city, organizer, start_date, end_date, contact_phone]
        );
        res.json({ success: true, message: 'Camp created successfully', campId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error });
    }
});

module.exports = router;
