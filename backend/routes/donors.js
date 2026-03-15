const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ==========================================================
// AUTH READY: Uncomment the lines below to enable auth logic
// const { verifyToken, authorize } = require('../middleware/authMiddleware');
// ==========================================================

/**
 * GET /api/donors
 * Description: Get a list of all donors for Admin dashboard.
 * AUTH READY: To protect this route, change to: router.get('/', verifyToken, authorize('admin'), async (req, res) => {
 */
router.get('/', async (req, res) => {
    try {
        const [donors] = await db.execute('SELECT id, name, email, phone, city, blood_type, is_available FROM donors ORDER BY created_at DESC');
        res.json({ success: true, donors });
    } catch (err) {
        console.error('Fetch Donors Error:', err);
        res.status(500).json({ success: false, message: 'Error fetching donors list' });
    }
});

/**
 * POST /api/donors/register
 * Description: Publically register a new donor (for the donate.html flow).
 */
router.post('/register', async (req, res) => {
    const { name, age, gender, blood_type, city, phone, email, medical_history, is_available } = req.body;

    // Default to true if not passed
    const avail = is_available !== undefined ? is_available : true;

    try {
        const [result] = await db.execute(
            `INSERT INTO donors 
            (name, age, gender, blood_type, city, phone, email, medical_history, is_available) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, age, gender, blood_type, city, phone, email, medical_history, avail]
        );
        res.status(201).json({ success: true, message: 'Registered successfully!', donorId: result.insertId });
    } catch (err) {
        console.error('Donor Reg Error:', err);
        res.status(500).json({ success: false, message: 'Server error during registry.' });
    }
});

module.exports = router;
