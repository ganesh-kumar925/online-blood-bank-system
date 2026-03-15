const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ==========================================================
// AUTH READY: Uncomment the line below to enable auth logic
// const { verifyToken, authorize } = require('../middleware/authMiddleware');
// ==========================================================

// Blood Compatibility Map
const compatibilityMap = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
};

/**
 * GET /api/blood/search
 * Description: Find compatible donors and inventory in a given city.
 * AUTH READY: To protect this route, change to: router.get('/search', verifyToken, async (req, res) => {
 */
router.get('/search', async (req, res) => {
    const { blood_type, city } = req.query;

    if (!blood_type || !city) {
        return res.status(400).json({ success: false, message: 'Blood type and city are required' });
    }

    try {
        const compatibleTypes = compatibilityMap[blood_type] || [blood_type, 'O-'];
        const typePlaceholders = compatibleTypes.map(() => '?').join(',');

        // 1. Search Active Donors
        const [donors] = await db.query(
            `SELECT id, name, phone, blood_type, city 
             FROM donors 
             WHERE city = ? AND is_available = 1 AND blood_type IN (${typePlaceholders})`,
            [city, ...compatibleTypes]
        );

        // 2. Search Blood Bank Inventory
        const [inventory] = await db.query(
            `SELECT blood_bank_name, city, blood_type, units_available 
             FROM blood_inventory 
             WHERE city = ? AND units_available > 0 AND blood_type IN (${typePlaceholders})`,
            [city, ...compatibleTypes]
        );

        res.json({
            success: true,
            donors,
            inventory,
            compatibleTypesSearched: compatibleTypes
        });
    } catch (err) {
        console.error('Search Route Error:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching blood data' });
    }
});

module.exports = router;
