const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ==========================================================
// AUTH READY: Uncomment the lines below to enable auth logic
// const { verifyToken, authorize } = require('../middleware/authMiddleware');
// ==========================================================

/**
 * GET /api/requests
 * Description: Get all requests (for Admin Dashboard).
 * AUTH READY: To protect this route, change to: router.get('/', verifyToken, authorize('admin'), async (req, res) => {
 */
router.get('/', async (req, res) => {
    try {
        const [requests] = await db.execute('SELECT * FROM blood_requests ORDER BY created_at DESC');
        res.json({ success: true, requests });
    } catch (err) {
        console.error('Fetch Requests Error:', err);
        res.status(500).json({ success: false, message: 'Error fetching requests' });
    }
});

/**
 * POST /api/requests/new
 * Description: Submit a new request (used by hospital request flow)
 * AUTH READY: To protect this route, change to: router.post('/new', verifyToken, authorize('hospital', 'admin'), async (req, res) => {
 */
router.post('/new', async (req, res) => {
    const { hospital_name, hospital_city, contact_person, phone, email, blood_type, units_needed, urgency, patient_name, patient_age, doctor_name, notes } = req.body;

    try {
        const [result] = await db.execute(
            `INSERT INTO blood_requests 
            (hospital_name, hospital_city, contact_person, phone, email, blood_type, units_needed, urgency, patient_name, patient_age, doctor_name, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [hospital_name, hospital_city, contact_person, phone, email, blood_type, units_needed, urgency, patient_name, patient_age, doctor_name, notes]
        );

        res.status(201).json({ success: true, message: 'Blood request submitted successfully', requestId: result.insertId });
    } catch (err) {
        console.error('Request Submit Error:', err);
        res.status(500).json({ success: false, message: 'Error processing blood request' });
    }
});

/**
 * PUT /api/requests/:id/status
 * Description: Update request status (Admin action)
 * AUTH READY: To protect this route, change to: router.put('/:id/status', verifyToken, authorize('admin'), async (req, res) => {
 */
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.execute('UPDATE blood_requests SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
});

module.exports = router;
